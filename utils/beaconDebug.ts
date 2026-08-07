/**
 * Manual-QA helpers for reproducing the Safari "stale Beacon connection"
 * failure without waiting days for ITP to evict storage on its own.
 *
 * None of this is used by the app at runtime — it only backs the gated
 * BeaconDebugPanel so the fixes in ConnectionProvider can be exercised by hand.
 *
 * Beacon spreads its state across several stores:
 *  - the main client:      localStorage keys `beacon:*`
 *  - the P2P transport:    localStorage keys `P2P-beacon:*`
 *  - the WalletConnect tx: localStorage keys `WALLET-beacon:*`
 *  - IndexedDB:            `beacon` (metrics/bug-report) and, for a live WC
 *                          session, `WALLET_CONNECT_V2_INDEXED_DB`
 * We match by substring so any instance prefix is handled.
 */

const BEACON_IDB_HINTS = ['beacon', 'wallet_connect']

const isBeaconKey = (key: string) => key.toLowerCase().includes('beacon:')

// Substrings that identify transport / peer / session state, independent of any
// instance prefix. Deleting these while keeping the account identity keys
// reproduces "connected but the transport is dead" — the shape a real
// connection takes on this app (all keys are unprefixed `beacon:*`, e.g.
// `beacon:postmessage-peers-dapp`, `beacon:sdk-matrix-preserved-state`).
const TRANSPORT_KEY_HINTS = [
  'peers',
  'matrix',
  'walletconnect',
  'postmessage',
  'wc-init',
  'wc-2',
  'wc_2'
]

// A key is transport state if it is behind an instance prefix (`P2P-`,
// `WALLET-`) OR its name matches a transport/peer/session hint.
const isTransportKey = (key: string) => {
  const k = key.toLowerCase()
  if (isBeaconKey(key) && !k.startsWith('beacon:')) return true
  return TRANSPORT_KEY_HINTS.some(hint => k.includes(hint))
}

export interface StorageEntry {
  key: string
  size: number
  preview: string
}

export const listBeaconStorage = (): StorageEntry[] => {
  if (typeof window === 'undefined') return []
  const entries: StorageEntry[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key || !isBeaconKey(key)) continue
    const value = localStorage.getItem(key) ?? ''
    entries.push({
      key,
      size: value.length,
      preview: value.length > 80 ? `${value.slice(0, 80)}…` : value
    })
  }
  return entries.sort((a, b) => a.key.localeCompare(b.key))
}

export const listIndexedDbDatabases = async (): Promise<string[]> => {
  if (typeof window === 'undefined' || !window.indexedDB) return []
  const factory = window.indexedDB as IDBFactory & {
    databases?: () => Promise<{ name?: string }[]>
  }
  if (typeof factory.databases === 'function') {
    try {
      const dbs = await factory.databases()
      return dbs.map(d => d.name ?? '(unnamed)').filter(Boolean)
    } catch {
      // fall through
    }
  }
  return []
}

// Known beacon IndexedDB names, used as a fallback when indexedDB.databases()
// isn't available (older Safari and others) so the simulations still clear the
// real Beacon DBs instead of silently no-op'ing.
const KNOWN_BEACON_DB_NAMES = ['beacon', 'WALLET_CONNECT_V2_INDEXED_DB']

const deleteIndexedDb = (name: string): Promise<void> =>
  new Promise(resolve => {
    if (typeof window === 'undefined' || !window.indexedDB) return resolve()
    // Safari's deleteDatabase() can hang with no callback when a connection is
    // still open. Time-box it so this helper stays best-effort and never blocks
    // the QA panel.
    const done = () => resolve()
    const timer = setTimeout(done, 1500)
    const finish = () => {
      clearTimeout(timer)
      resolve()
    }
    try {
      const request = window.indexedDB.deleteDatabase(name)
      request.onsuccess = finish
      request.onerror = finish
      request.onblocked = finish
    } catch {
      finish()
    }
  })

// Delete every beacon-related IndexedDB database and return the names actually
// targeted. Enumerates live where possible; falls back to known names when
// indexedDB.databases() is unavailable.
const deleteBeaconIndexedDbs = async (): Promise<string[]> => {
  const existing = await listIndexedDbDatabases()
  const targets = existing.length
    ? existing.filter(name =>
        BEACON_IDB_HINTS.some(hint => name.toLowerCase().includes(hint))
      )
    : KNOWN_BEACON_DB_NAMES
  await Promise.all(targets.map(deleteIndexedDb))
  return targets
}

export interface SimulationResult {
  removedKeys: string[]
  keptKeys: string[]
  removedDatabases: string[]
}

/**
 * Simulate Safari ITP evicting the transport half of the Beacon store while the
 * main account identity survives — the shape that leaves the app stuck
 * "connected" against a dead transport. Deletes every transport/peer/session
 * key (peers, matrix, postmessage, walletconnect — at any prefix) and all
 * beacon IndexedDB, keeping the account identity keys (accounts,
 * active-account, seed, sdk_version, user-id) so getActiveAccount() still
 * returns but no peer remains.
 */
export const simulateItpEviction = async (): Promise<SimulationResult> => {
  const removedKeys: string[] = []
  const keptKeys: string[] = []
  if (typeof window !== 'undefined') {
    for (const { key } of listBeaconStorage()) {
      if (isTransportKey(key)) {
        localStorage.removeItem(key)
        removedKeys.push(key)
      } else {
        keptKeys.push(key)
      }
    }
  }
  const removedDatabases = await deleteBeaconIndexedDbs()
  return { removedKeys, keptKeys, removedDatabases }
}

/**
 * Reproduce the older-SDK crash where `beacon:last-selected-wallet` was stored
 * as a bare string instead of an object. On reload, the unpatched app throws
 * "Cannot create property 'name' on string ..." from updateStorageWallet();
 * with the sanitizer in beacon.ts the bad key is removed and the app loads.
 */
export const simulateStaleLastSelectedWallet = (): string => {
  const key = 'beacon:last-selected-wallet'
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, 'temple_chrome')
  }
  return key
}

/**
 * Wipe everything Beacon-related — the equivalent of a manual "clear site data"
 * for this origin. Useful as a clean baseline between tests.
 */
export const clearAllBeaconStorage = async (): Promise<SimulationResult> => {
  const removedKeys: string[] = []
  if (typeof window !== 'undefined') {
    for (const { key } of listBeaconStorage()) {
      localStorage.removeItem(key)
      removedKeys.push(key)
    }
  }
  const removedDatabases = await deleteBeaconIndexedDbs()
  return { removedKeys, keptKeys: [], removedDatabases }
}
