/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */

import { SwitchChainError, fromHex, getAddress, numberToHex } from "viem";
import { ChainNotConfiguredError, type Connector, createConnector } from "wagmi";

frameConnector.type = "frameConnector" as const;

let accountsChanged: Connector['onAccountsChanged'] | undefined
let chainChanged: Connector['onChainChanged'] | undefined
let disconnect: Connector['onDisconnect'] | undefined

export function frameConnector() {
  let connected = true;
  let sdkInstance: any = null;

  const loadSDK = async () => {
    if (typeof window === 'undefined') return null;
    try {
      const frameSDK = await import('@farcaster/frame-sdk');
      return frameSDK.default;
    } catch (error) {
      console.error('Failed to load Frame SDK:', error);
      return null;
    }
  };

  return createConnector<any>((config) => ({
    id: "farcaster",
    name: "Farcaster Wallet",
    type: frameConnector.type,

    async setup() {
      sdkInstance = await loadSDK();
      await this.connect({ chainId: config.chains[0].id });
    },
    async connect({ chainId } = {}) {
      try {
        const provider = await this.getProvider();
        if (!provider) return { accounts: [], chainId: 8453 };

        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });

        if (!accountsChanged) {
          accountsChanged = this.onAccountsChanged.bind(this)
          provider.on('accountsChanged', accountsChanged)
        }
        if (!chainChanged) {
          chainChanged = this.onChainChanged.bind(this)
          provider.on('chainChanged', chainChanged)
        }
        if (!disconnect) {
          disconnect = this.onDisconnect.bind(this)
          provider.on('disconnect', disconnect)
        }

        let currentChainId = await this.getChainId();
        if (chainId && currentChainId !== chainId) {
          const chain = await this.switchChain!({ chainId });
          currentChainId = chain.id;
        }

        connected = true;

        return {
          accounts: accounts.map((address: string) => getAddress(address)),
          chainId: currentChainId,
        };
      } catch (error) {
        console.log('Error connecting:', error);
      }
      return {
        accounts: [],
        chainId: 8453,
      };
    },
    async disconnect() {
      const provider = await this.getProvider()
      if (!provider) return;

      if (accountsChanged) {
        provider.removeListener('accountsChanged', accountsChanged)
        accountsChanged = undefined
      }

      if (chainChanged) {
        provider.removeListener('chainChanged', chainChanged)
        chainChanged = undefined
      }

      if (disconnect) {
        provider.removeListener('disconnect', disconnect)
        disconnect = undefined
      }

      connected = false;
    },
    async getAccounts() {
      if (!connected) throw new Error("Not connected");
      try {
        const provider = await this.getProvider();
        if (!provider) return [];
        
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        return accounts.map((address: string) => getAddress(address));
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    async getChainId() {
      const provider = await this.getProvider();
      if (!provider) return 8453;

      const hexChainId = await provider.request({ method: "eth_chainId" });
      return fromHex(hexChainId, "number");
    },
    async isAuthorized() {
      if (!connected) {
        return false;
      }

      const accounts = await this.getAccounts();
      return !!accounts.length;
    },
    async switchChain({ chainId }) {
      const provider = await this.getProvider();
      if (!provider) throw new Error("Provider not available");

      const chain = config.chains.find((x) => x.id === chainId);
      if (!chain) throw new SwitchChainError(new ChainNotConfiguredError());

      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHex(chainId) }],
      });

      config.emitter.emit("change", { chainId });

      return chain;
    },
    onAccountsChanged(accounts) {
      if (accounts.length === 0) this.onDisconnect();
      else
        config.emitter.emit("change", {
          accounts: accounts.map((address: string) => getAddress(address)),
        });
    },
    onChainChanged(chain) {
      const chainId = Number(chain);
      config.emitter.emit("change", { chainId });
    },
    onDisconnect() {
      config.emitter.emit("disconnect");
      connected = false;
    },
    async getProvider() {
      if (typeof window === 'undefined') return null;

      try {
        if (!sdkInstance) {
          sdkInstance = await loadSDK();
        }
        const provider = sdkInstance?.wallet?.ethProvider;
        if (!provider) {
          console.log('Provider not available. Please make sure you are using a compatible wallet.');
          return null;
        }
        return provider;
      } catch (error) {
        console.log(error);
        return window.ethereum;
      }
    },
  }));
}
