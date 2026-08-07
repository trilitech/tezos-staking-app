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

// A key belongs to the main client if it starts with `beacon:`; anything that
// contains `beacon:` behind a prefix (`P2P-`, `WALLET-`, …) is transport-scoped.
const isTransportScopedKey = (key: string) =>
  isBeaconKey(key) && !key.toLowerCase().startsWith('beacon:')

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

const deleteIndexedDb = (name: string): Promise<void> =>
  new Promise(resolve => {
    if (typeof window === 'undefined' || !window.indexedDB) return resolve()
    const request = window.indexedDB.deleteDatabase(name)
    request.onsuccess = () => resolve()
    request.onerror = () => resolve()
    request.onblocked = () => resolve()
  })

// Delete every beacon-related IndexedDB database and return the names actually
// targeted (enumerated live, so the reported count matches reality).
const deleteBeaconIndexedDbs = async (): Promise<string[]> => {
  const existing = await listIndexedDbDatabases()
  const targets = existing.filter(name =>
    BEACON_IDB_HINTS.some(hint => name.toLowerCase().includes(hint))
  )
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
 * "connected" against a dead transport. Deletes the transport-scoped
 * (`P2P-`/`WALLET-`) localStorage keys and all beacon IndexedDB, keeping the
 * unprefixed `beacon:*` account keys so getActiveAccount() still returns.
 */
export const simulateItpEviction = async (): Promise<SimulationResult> => {
  const removedKeys: string[] = []
  const keptKeys: string[] = []
  if (typeof window !== 'undefined') {
    for (const { key } of listBeaconStorage()) {
      if (isTransportScopedKey(key)) {
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
