export interface NativeCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface NetworkConfig {
  key: string;
  chainName: string;
  chainIdDecimal: number;
  chainIdHex: string;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  nativeCurrency: NativeCurrency;
  faucetUrl?: string;
  faucetInfo?: string;
}
