import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WalletService } from '../../core/services/wallet.service';
import { ButtonComponent } from '../../shared/components/button/button';
import { ShortAddressPipe } from '../../shared/pipes/short-address.pipe';

@Component({
  selector: 'app-wallet-dashboard',
  standalone: true,
  imports: [ButtonComponent, ShortAddressPipe],
  templateUrl: './wallet-dashboard.html',
  styleUrl: './wallet-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WalletDashboardComponent {
  private readonly walletService = inject(WalletService);

  readonly account = this.walletService.account;
  readonly isConnected = this.walletService.isConnected;
  readonly isLoading = this.walletService.isLoading;

  /** 3) Leer el saldo (refresca address + balance manualmente) */
  refreshBalance(): void {
    void this.walletService.refreshAccountData(this.account().address ?? undefined);
  }
}
