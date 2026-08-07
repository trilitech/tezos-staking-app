import { useCallback, useEffect, useState } from 'react'
import { Box, Button, Flex, Text } from '@chakra-ui/react'
import { useConnection } from '@/providers/ConnectionProvider'
import {
  clearAllBeaconStorage,
  listBeaconStorage,
  listIndexedDbDatabases,
  simulateItpEviction,
  simulateStaleLastSelectedWallet,
  StorageEntry
} from '@/utils/beaconDebug'

// The panel is OFF by default and gated solely on the build-time env var
// NEXT_PUBLIC_BEACON_DEBUG ("true"/"1" to show it). A missing/empty value is
// treated as off — no crash. The env var is inlined at build time, so it is
// stable across server and client render (no hydration flip needed).
const beaconDebugEnabled = () => {
  const value = process.env.NEXT_PUBLIC_BEACON_DEBUG
  return value === 'true' || value === '1'
}

export const BeaconDebugPanel = () => {
  const enabled = beaconDebugEnabled()
  const { isConnected, address, disconnect, resetConnection } = useConnection()
  const [entries, setEntries] = useState<StorageEntry[]>([])
  const [dbs, setDbs] = useState<string[]>([])
  const [log, setLog] = useState<string>('')
  const [open, setOpen] = useState(true)
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(async () => {
    setEntries(listBeaconStorage())
    setDbs(await listIndexedDbDatabases())
  }, [])

  useEffect(() => {
    if (enabled) refresh()
  }, [enabled, refresh])

  if (!enabled) return null

  const run = async (label: string, fn: () => Promise<string>) => {
    setBusy(true)
    setLog(`${label}…`)
    try {
      setLog(await fn())
    } catch (error) {
      setLog(`${label} failed: ${String(error)}`)
    } finally {
      await refresh()
      setBusy(false)
    }
  }

  return (
    <Box
      position='fixed'
      bottom='12px'
      right='12px'
      zIndex={99999}
      w={open ? '360px' : 'auto'}
      maxH='70vh'
      overflowY='auto'
      bg='#111'
      color='#eee'
      borderRadius='10px'
      border='1px solid #333'
      fontSize='12px'
      fontFamily='monospace'
      boxShadow='0 8px 24px rgba(0,0,0,0.4)'
      p='10px'
    >
      <Flex justify='space-between' align='center' mb={open ? '8px' : '0'}>
        <Text fontWeight={700}>🔌 Beacon debug</Text>
        <Button
          size='xs'
          variant='outline'
          color='#eee'
          borderColor='#444'
          onClick={() => setOpen(o => !o)}
        >
          {open ? 'hide' : 'show'}
        </Button>
      </Flex>

      {open && (
        <>
          <Box mb='8px'>
            <Text>
              app state:{' '}
              <Text as='span' color={isConnected ? '#5f5' : '#f77'}>
                {isConnected === undefined
                  ? 'initializing'
                  : isConnected
                    ? 'connected'
                    : 'disconnected'}
              </Text>
            </Text>
            <Text color='#aaa' wordBreak='break-all'>
              {address ?? '(no address)'}
            </Text>
          </Box>

          <Flex direction='column' gap='6px' mb='8px'>
            <Button
              size='xs'
              bg='#a33'
              color='white'
              disabled={busy}
              onClick={() =>
                run('Simulate ITP eviction', async () => {
                  const r = await simulateItpEviction()
                  return `Removed ${r.removedKeys.length} transport/peer keys [${r.removedKeys.join(', ') || 'none'}] + ${r.removedDatabases.length} IndexedDB db(s) [${r.removedDatabases.join(', ') || 'none'}]; kept ${r.keptKeys.length} identity keys. Reload: the account now has no peer, so the app should show "disconnected" (Connect). A later operation would also drop to Connect.`
                })
              }
            >
              Simulate ITP eviction (dead transport)
            </Button>

            <Button
              size='xs'
              bg='#a33'
              color='white'
              disabled={busy}
              onClick={() =>
                run('Simulate stale wallet key', async () => {
                  const key = simulateStaleLastSelectedWallet()
                  return `Wrote ${key} = "temple_chrome" (string). Reload: without the fix the app crashes with "Cannot create property 'name' on string"; with the sanitizer it removes the key and loads.`
                })
              }
            >
              Simulate stale last-selected-wallet (crash)
            </Button>

            <Button
              size='xs'
              bg='#933'
              color='white'
              disabled={busy}
              onClick={() =>
                run('Clear all beacon storage', async () => {
                  const r = await clearAllBeaconStorage()
                  return `Cleared ${r.removedKeys.length} keys + ${r.removedDatabases.length} db(s). Equivalent to a manual "clear site data".`
                })
              }
            >
              Clear ALL beacon storage (baseline)
            </Button>

            <Button
              size='xs'
              bg='#357'
              color='white'
              disabled={busy}
              onClick={() =>
                run('App disconnect()', async () => {
                  await disconnect()
                  return 'Called the app\'s disconnect(). Deterministic check: NO account/active-account/transport (P2P-/WALLET-) key should remain below. A fresh client immediately re-seeds a couple of identity keys (sdk_version, seed) and an empty "beacon" IndexedDB — that is expected; the point is that no connected-session state survives.'
                })
              }
            >
              Test app disconnect() (commit 1)
            </Button>

            <Button
              size='xs'
              bg='#357'
              color='white'
              disabled={busy}
              onClick={() => resetConnection()}
            >
              Test resetConnection() (purge + reload to /)
            </Button>

            <Flex gap='6px'>
              <Button
                size='xs'
                flex='1'
                variant='outline'
                color='#eee'
                borderColor='#444'
                disabled={busy}
                onClick={() => refresh()}
              >
                Refresh
              </Button>
              <Button
                size='xs'
                flex='1'
                variant='outline'
                color='#eee'
                borderColor='#444'
                onClick={() => window.location.reload()}
              >
                Reload page
              </Button>
            </Flex>
          </Flex>

          {log && (
            <Box mb='8px' p='6px' bg='#000' borderRadius='6px' color='#9cf'>
              {log}
            </Box>
          )}

          <Text color='#888' mb='4px'>
            localStorage beacon keys ({entries.length}):
          </Text>
          {entries.map(e => (
            <Text key={e.key} color='#ccc' wordBreak='break-all' mb='2px'>
              • {e.key} <Text as='span' color='#666'>({e.size}b)</Text>
            </Text>
          ))}

          <Text color='#888' mt='6px' mb='4px'>
            IndexedDB ({dbs.length}):
          </Text>
          {dbs.map(name => (
            <Text key={name} color='#ccc' wordBreak='break-all'>
              • {name}
            </Text>
          ))}
        </>
      )}
    </Box>
  )
}
