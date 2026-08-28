import { Injectable } from '@angular/core';
import { NetworkConfig } from '../interfaces';

/**
 * Catálogo de redes soportadas por la dApp.
 * Se usan para poder agregarlas/cambiarlas automáticamente en Pali Wallet
 * mediante los métodos RPC wallet_addEthereumChain / wallet_switchEthereumChain.
 */
@Injectable({
  providedIn: 'root',
})
export class NetworkService {
  private readonly networks: Record<string, NetworkConfig> = {
    hoodi: {
      key: 'hoodi',
      chainName: 'Ethereum Hoodi',
      chainIdDecimal: 560048,
      chainIdHex: '0x' + (560048).toString(16),
      rpcUrls: ['https://0xrpc.io/hoodi'],
      blockExplorerUrls: ['https://hoodi.etherscan.io/'],
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      faucetUrl: 'https://cloud.google.com/application/web3/faucet/ethereum/hoodi',
      faucetInfo: '1 ETH por día',
    },
    sepolia: {
      key: 'sepolia',
      chainName: 'Ethereum Sepolia',
      chainIdDecimal: 11155111,
      chainIdHex: '0x' + (11155111).toString(16),
      rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com/'],
      blockExplorerUrls: ['https://sepolia.etherscan.io/'],
      nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
      faucetUrl: 'https://cloud.google.com/application/web3/faucet/ethereum/sepolia',
      faucetInfo: '0.05 ETH por día',
    },
  };

  getAll(): NetworkConfig[] {
    return Object.values(this.networks);
  }

  getByKey(key: string): NetworkConfig | undefined {
    return this.networks[key];
  }

  getByChainIdHex(chainIdHex: string): NetworkConfig | undefined {
    const normalized = chainIdHex.toLowerCase();
    return this.getAll().find((n) => n.chainIdHex.toLowerCase() === normalized);
  }

  /** Payload requerido por wallet_addEthereumChain (EIP-3085). */
  toAddChainParams(network: NetworkConfig) {
    return {
      chainId: network.chainIdHex,
      chainName: network.chainName,
      rpcUrls: network.rpcUrls,
      blockExplorerUrls: network.blockExplorerUrls,
      nativeCurrency: network.nativeCurrency,
    };
  }
}
