import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WalletService } from '../../core/services/wallet.service';
import { NetworkService } from '../../core/services/network.service';
import { ButtonComponent } from '../../shared/components/button/button';
import { AlertComponent } from '../../shared/components/alert/alert';

@Component({
  selector: 'app-wallet-connect',
  standalone: true,
  imports: [ButtonComponent, AlertComponent],
  templateUrl: './wallet-connect.html',
  styleUrl: './wallet-connect.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletConnectComponent {
  private readonly walletService = inject(WalletService);
  private readonly networkService = inject(NetworkService);

  readonly networks = this.networkService.getAll();
  readonly isConnected = this.walletService.isConnected;
  readonly isLoading = this.walletService.isLoading;
  readonly error = this.walletService.error;
  readonly isPaliInstalled = this.walletService.isPaliInstalled();
  readonly currentChainIdHex = () => this.walletService.account().chainIdHex;

  /** 1) Iniciar sesión con Pali Wallet */
  connect(): void {
    void this.walletService.connect();
  }

  disconnect(): void {
    this.walletService.disconnect();
  }

  switchNetwork(networkKey: string): void {
    void this.walletService.switchOrAddNetwork(networkKey);
  }
}
