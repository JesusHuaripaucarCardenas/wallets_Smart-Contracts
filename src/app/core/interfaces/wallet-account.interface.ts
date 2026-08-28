/**
 * Estado de la sesión de la wallet conectada (Pali Wallet u otra
 * wallet compatible con EIP-1193) dentro de la aplicación.
 */
export interface WalletAccount {
  address: string | null;
  balanceWei: string | null;
  balanceEth: string | null;
  chainIdHex: string | null;
  chainIdDecimal: number | null;
  networkName: string | null;
  isConnected: boolean;
}

export const EMPTY_WALLET_ACCOUNT: WalletAccount = {
  address: null,
  balanceWei: null,
  balanceEth: null,
  chainIdHex: null,
  chainIdDecimal: null,
  networkName: null,
  isConnected: false,
};
