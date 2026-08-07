/**
 * Manual-QA helpers for reproducing the Safari "stale Beacon connection"
 * failure without waiting days for ITP to evict storage on its own.
 *
 * None of this is used by the app at runtime — it only backs the gated
 * BeaconDebugPanel so the fixes in ConnectionProvider can be exercised by hand.
 *
 * Beacon persists its state under `beacon:*` keys in localStorage (the SDK may
 * add an instance prefix, so we match by substring), and the WalletConnect
 * transport keeps its session in an IndexedDB database.
 */

const WALLETCONNECT_DB_NAMES = ['WALLET_CONNECT_V2_INDEXED_DB']

// Substrings that identify transport / peer / session state — the parts Safari
// ITP tends to evict independently, leaving an account pointing at a dead
// transport. Identity + account state (seed, accounts, active-account,
// permissions) is deliberately NOT matched so the app still believes it is
// connected on the next load.
const TRANSPORT_KEY_HINTS = [
  'peers',
  'matrix',
  'walletconnect',
  'wc-init',
  'last-error'
]

const isBeaconKey = (key: string) => key.toLowerCase().includes('beacon:')

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
      // fall through to the known-names list below
    }
  }
  return [...WALLETCONNECT_DB_NAMES]
}

const deleteIndexedDb = (name: string): Promise<void> =>
  new Promise(resolve => {
    if (typeof window === 'undefined' || !window.indexedDB) return resolve()
    const request = window.indexedDB.deleteDatabase(name)
    request.onsuccess = () => resolve()
    request.onerror = () => resolve()
    request.onblocked = () => resolve()
  })

export const deleteWalletConnectIndexedDb = async (): Promise<string[]> => {
  const existing = await listIndexedDbDatabases()
  const targets = existing.filter(
    name => name && name.toLowerCase().includes('wallet_connect')
  )
  const toDelete = targets.length ? targets : WALLETCONNECT_DB_NAMES
  await Promise.all(toDelete.map(deleteIndexedDb))
  return toDelete
}

export interface SimulationResult {
  removedKeys: string[]
  keptKeys: string[]
  removedDatabases: string[]
}

/**
 * Simulate Safari ITP evicting the transport half of the Beacon store while the
 * account identity survives — the exact shape that leaves the app stuck
 * "connected" against a dead transport.
 */
export const simulateItpEviction = async (): Promise<SimulationResult> => {
  const removedKeys: string[] = []
  const keptKeys: string[] = []
  if (typeof window !== 'undefined') {
    for (const { key } of listBeaconStorage()) {
      const isTransport = TRANSPORT_KEY_HINTS.some(hint =>
        key.toLowerCase().includes(hint)
      )
      if (isTransport) {
        localStorage.removeItem(key)
        removedKeys.push(key)
      } else {
        keptKeys.push(key)
      }
    }
  }
  const removedDatabases = await deleteWalletConnectIndexedDb()
  return { removedKeys, keptKeys, removedDatabases }
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
  const removedDatabases = await deleteWalletConnectIndexedDb()
  return { removedKeys, keptKeys: [], removedDatabases }
}
