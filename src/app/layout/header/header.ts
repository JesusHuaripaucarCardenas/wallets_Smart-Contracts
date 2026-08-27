import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { WalletService } from '../../core/services/wallet.service';
import { ShortAddressPipe } from '../../shared/pipes/short-address.pipe';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ShortAddressPipe],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private readonly walletService = inject(WalletService);

  readonly appName = environment.appName;
  readonly account = this.walletService.account;
  readonly isConnected = this.walletService.isConnected;
}
