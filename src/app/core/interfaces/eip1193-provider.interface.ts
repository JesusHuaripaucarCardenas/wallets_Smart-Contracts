/**
 * Tipado mínimo del proveedor inyectado por Pali Wallet (u otra wallet
 * compatible) en `window.ethereum`, siguiendo el estándar EIP-1193.
 */
export interface Eip1193Provider {
  isPali?: boolean;
  request: (args: { method: string; params?: unknown[] | object }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: Eip1193Provider;
  }
}
