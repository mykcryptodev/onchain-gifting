import { createConnector } from '@wagmi/core';
import { type WalletClient } from 'viem';
import { WAGMI_CHAIN } from '~/constants';

export type ViemClientWalletConnectorOptions = {
  walletClient: WalletClient;
};

export function viemClientWalletConnector(
  parameters: ViemClientWalletConnectorOptions
) {
  return createConnector((config) => ({
    id: 'viemClientWallet',
    name: 'Viem Client Wallet',
    type: 'viemClientWallet',
    
    async connect() {
      const [address] = await parameters.walletClient.getAddresses();
      const chainId = await parameters.walletClient.getChainId();
      
      return {
        accounts: [address] as readonly `0x${string}`[],
        chainId,
      };
    },

    async disconnect() {
      // Disconnection logic if needed
    },

    async getAccounts() {
      const addresses = await parameters.walletClient.getAddresses();
      return addresses as `0x${string}`[];
    },

    async getChainId() {
      return await parameters.walletClient.getChainId();
    },

    async getProvider() {
      return parameters.walletClient;
    },

    async isAuthorized() {
      const addresses = await parameters.walletClient.getAddresses();
      return addresses.length > 0;
    },

    // @ts-expect-error
    async switchChain({ chainId }) {
      // Chain switching logic if needed
      return null;
    },

    onAccountsChanged(accounts) {
      config.emitter.emit('change', { accounts: accounts as `0x${string}`[] });
    },

    onChainChanged(chain) {
      config.emitter.emit('change', { chainId: Number(chain) });
    },

    onDisconnect() {
      config.emitter.emit('disconnect');
    },
  }));
}