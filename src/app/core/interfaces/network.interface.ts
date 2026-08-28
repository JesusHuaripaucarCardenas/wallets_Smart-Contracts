/**
 * Representa la configuración de una red EVM (chain) que se puede
 * agregar/cambiar en la wallet mediante wallet_addEthereumChain.
 */
export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface NetworkConfig {
  key: string;
  chainName: string;
  chainIdDecimal: number;
  /** chainId en formato hexadecimal, requerido por el estándar EIP-3085 */
  chainIdHex: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: NativeCurrency;
  faucetUrl?: string;
  faucetInfo?: string;
}
