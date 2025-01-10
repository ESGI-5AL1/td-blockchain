import { useAccount, useConnect, useDisconnect, WagmiProvider, useBlock, useBlockNumber, useChainId, useFeeHistory } from 'wagmi'
import { config } from './wagmi.ts'
import { formatEther } from 'viem'

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  
  const chainId = useChainId()
  const { data: blockNumber } = useBlockNumber()
  const { data: block } = useBlock({
    blockNumber
  })
  useFeeHistory({
    blockCount: 1,
    rewardPercentiles: [25, 75]
  })

  const burntFees = block?.baseFeePerGas 
    ? formatEther((block.baseFeePerGas * block.gasUsed) / 10n**18n)
    : '0'

  return (
    <>
      <WagmiProvider config={config}>
        <div>
          <h2>Account</h2>
          <div>
            status: {account.status}
            <br />
            addresses: {JSON.stringify(account.addresses)}
            <br />
            chainId: {account.chainId}
          </div>
          {account.status === 'connected' && (
            <button 
              type="button" 
              onClick={() => disconnect()}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                marginTop: '12px'
              }}
            >
              Disconnect Wallet
            </button>
          )}
        </div>

        <div>
          <h2>Connect</h2>
          {connectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => connect({ connector })}
              type="button"
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '6px',
                marginRight: '8px',
                marginBottom: '8px'
              }}
            >
              Connect {connector.name}
            </button>
          ))}
          <div>{status}</div>
          <div style={{ color: '#ef4444' }}>{error?.message}</div>
        </div>

        {account.status === 'connected' && (
          <div style={{
            marginTop: '24px',
            padding: '16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px'
          }}>
            <h2>Blockchain Information</h2>
            <div style={{ display: 'grid', gap: '8px' }}>
              <div>
                <strong>Chain ID:</strong> {chainId}
              </div>
              <div>
                <strong>Block Number:</strong> {blockNumber?.toString() || 'Loading...'}
              </div>
              <div>
                <strong>Block Hash:</strong> {block?.hash || 'Loading...'}
              </div>
              <div>
                <strong>Gas Used:</strong> {block?.gasUsed?.toString() || 'Loading...'}
              </div>
              <div>
                <strong>Gas Price (Base Fee):</strong> {block?.baseFeePerGas 
                  ? `${formatEther(block.baseFeePerGas)} ETH`
                  : 'Loading...'}
              </div>
              <div>
                <strong>Burnt Fees:</strong> {burntFees} ETH
              </div>
            </div>
          </div>
        )}
      </WagmiProvider>
    </>
  )
}

export default App