import { Injectable, computed, signal } from '@angular/core';
import { BrowserProvider, formatEther } from 'ethers';
import { EMPTY_WALLET_ACCOUNT, WalletAccount } from '../interfaces';
import { NetworkService } from './network.service';
import { EthersProviderFactory } from './ethers-provider.factory';

/**
 * Servicio central para conectarse a Pali Wallet (u otra wallet compatible
 * con EIP-1193 inyectada en window.ethereum) usando Ethers.js v6.
 *
 * Responsabilidades:
 *  - Detectar si Pali Wallet está instalada.
 *  - Iniciar sesión (eth_requestAccounts).
 *  - Leer el address de la cuenta conectada.
 *  - Leer el saldo (balance) de la cuenta conectada.
 *  - Reaccionar a cambios de cuenta / red (accountsChanged, chainChanged).
 */
@Injectable({
  providedIn: 'root',
})
export class WalletService {
  private provider: BrowserProvider | null = null;

  private readonly accountSignal = signal<WalletAccount>(EMPTY_WALLET_ACCOUNT);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly account = computed(() => this.accountSignal());
  readonly isConnected = computed(() => this.accountSignal().isConnected);
  readonly isLoading = computed(() => this.loadingSignal());
  readonly error = computed(() => this.errorSignal());

  constructor(
    private readonly networkService: NetworkService,
    private readonly providerFactory: EthersProviderFactory,
  ) {
    this.registerProviderEvents();
  }

  /** Indica si la extensión de Pali Wallet está disponible en el navegador. */
  isPaliInstalled(): boolean {
    return typeof window !== 'undefined' && !!window.ethereum;
  }

  /**
   * 1) Iniciar sesión con Pali Wallet.
   * Solicita las cuentas (eth_requestAccounts) y carga address + saldo.
   */
  async connect(): Promise<void> {
    this.errorSignal.set(null);

    if (!this.isPaliInstalled()) {
      this.errorSignal.set(
        'No se detectó Pali Wallet. Instala la extensión desde el navegador.',
      );
      return;
    }

    try {
      this.loadingSignal.set(true);
      this.provider = this.providerFactory.create(window.ethereum!);

      const accounts = (await window.ethereum!.request({
        method: 'eth_requestAccounts',
      })) as string[];

      if (!accounts || accounts.length === 0) {
        throw new Error('No se autorizó ninguna cuenta en Pali Wallet.');
      }

      await this.refreshAccountData(accounts[0]);
    } catch (err) {
      this.errorSignal.set(this.extractErrorMessage(err));
    } finally {
      this.loadingSignal.set(false);
    }
  }

  disconnect(): void {
    this.accountSignal.set(EMPTY_WALLET_ACCOUNT);
    this.provider = null;
  }

  /** 2) Leer el address y 3) leer el saldo de la cuenta activa. */
  async refreshAccountData(address?: string): Promise<void> {
    if (!this.provider) {
      if (!this.isPaliInstalled()) return;
      this.provider = this.providerFactory.create(window.ethereum!);
    }

    try {
      this.loadingSignal.set(true);

      const signer = address ? null : await this.provider.getSigner();
      const finalAddress = address ?? (signer ? await signer.getAddress() : null);
      if (!finalAddress) return;

      const [balanceWei, network] = await Promise.all([
        this.provider.getBalance(finalAddress),
        this.provider.getNetwork(),
      ]);

      const chainIdDecimal = Number(network.chainId);
      const chainIdHex = '0x' + chainIdDecimal.toString(16);
      const knownNetwork = this.networkService.getByChainIdHex(chainIdHex);

      this.accountSignal.set({
        address: finalAddress,
        balanceWei: balanceWei.toString(),
        balanceEth: formatEther(balanceWei),
        chainIdHex,
        chainIdDecimal,
        networkName: knownNetwork?.chainName ?? `Chain ${chainIdDecimal}`,
        isConnected: true,
      });
    } catch (err) {
      this.errorSignal.set(this.extractErrorMessage(err));
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Cambia a una red EVM en Pali Wallet (ej. Hoodi o Sepolia), agregándola
   * primero si la wallet todavía no la conoce.
   *
   * OJO: `wallet_addEthereumChain` (EIP-3085) solo *registra* la red en la
   * wallet; el estándar no obliga a la wallet a activarla como red actual,
   * y muchas (incluida Pali) simplemente la agregan sin cambiar de red si
   * ya tenían otra red activa (ej. te quedas "atascado" en Sepolia). Por
   * eso el flujo correcto es: 1) intentar `wallet_switchEthereumChain`
   * (EIP-3326) directamente, y 2) solo si la wallet responde que no conoce
   * esa red (código 4902), agregarla con `wallet_addEthereumChain` y volver
   * a pedir el cambio explícitamente.
   */
  async switchOrAddNetwork(networkKey: string): Promise<void> {
    const network = this.networkService.getByKey(networkKey);
    if (!network || !this.isPaliInstalled()) return;

    try {
      this.loadingSignal.set(true);
      await this.requestSwitchChain(network.chainIdHex);
      // No esperamos al evento chainChanged de la wallet: se fuerza aquí
      // para no leer el saldo con un provider que todavía apunta a la red
      // anterior.
      this.provider = null;
      await this.refreshAccountData();
    } catch (err) {
      this.errorSignal.set(this.extractErrorMessage(err));
    } finally {
      this.loadingSignal.set(false);
    }
  }

  private async requestSwitchChain(chainIdHex: string): Promise<void> {
    try {
      await window.ethereum!.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchErr) {
      if (!this.isUnrecognizedChainError(switchErr)) {
        throw switchErr;
      }

      const network = this.networkService.getByChainIdHex(chainIdHex);
      if (!network) throw switchErr;

      await window.ethereum!.request({
        method: 'wallet_addEthereumChain',
        params: [this.networkService.toAddChainParams(network)],
      });

      // Algunas wallets no activan la red recién agregada automáticamente,
      // así que se solicita el cambio explícitamente una vez agregada.
      await window.ethereum!.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    }
  }

  /** EIP-3326: código 4902 = la wallet no tiene esa red agregada todavía. */
  private isUnrecognizedChainError(err: unknown): boolean {
    const code = (err as { code?: number })?.code;
    if (code === 4902) return true;

    const message = this.extractErrorMessage(err).toLowerCase();
    return message.includes('unrecognized chain') || message.includes('wallet_addethereumchain');
  }

  private registerProviderEvents(): void {
    if (typeof window === 'undefined' || !window.ethereum) return;

    window.ethereum.on('accountsChanged', (...args: unknown[]) => {
      const accounts = args[0] as string[];
      if (!accounts || accounts.length === 0) {
        this.disconnect();
      } else {
        void this.refreshAccountData(accounts[0]);
      }
    });

    window.ethereum.on('chainChanged', () => {
      // Se recrea el provider para evitar arrastrar el estado de red
      // detectado antes del cambio (ver EthersProviderFactory).
      this.provider = null;
      void this.refreshAccountData(this.accountSignal().address ?? undefined);
    });
  }

  private extractErrorMessage(err: unknown): string {
    if (err && typeof err === 'object' && 'message' in err) {
      return String((err as { message: unknown }).message);
    }
    return 'Ocurrió un error inesperado al comunicarse con Pali Wallet.';
  }
}
