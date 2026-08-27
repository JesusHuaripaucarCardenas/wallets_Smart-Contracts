import { TestBed } from '@angular/core/testing';
import { WalletDashboardComponent } from './wallet-dashboard';
import { WalletService } from '../../core/services/wallet.service';

describe('WalletDashboardComponent', () => {
  const fakeAccount = {
    address: '0x1234567890abcdef1234567890abcdef12345678',
    balanceWei: '1000000000000000000',
    balanceEth: '1.0',
    chainIdHex: '0x88bb0',
    chainIdDecimal: 560048,
    networkName: 'Ethereum Hoodi',
    isConnected: true,
  };

  let refreshSpy: ReturnType<typeof vi.fn>;

  async function setup(connected: boolean) {
    refreshSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [WalletDashboardComponent],
    })
      .overrideProvider(WalletService, {
        useValue: {
          account: () => (connected ? fakeAccount : { address: null }),
          isConnected: () => connected,
          isLoading: () => false,
          refreshAccountData: refreshSpy,
        },
      })
      .compileComponents();

    return TestBed.createComponent(WalletDashboardComponent);
  }

  it('should create', async () => {
    const fixture = await setup(false);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show empty state when not connected', async () => {
    const fixture = await setup(false);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Conéctate con Pali Wallet');
  });

  it('should show address and balance when connected', async () => {
    const fixture = await setup(true);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('1.0 ETH');
    expect(el.textContent).toContain('Ethereum Hoodi');
  });

  it('should call walletService.refreshAccountData on refreshBalance()', async () => {
    const fixture = await setup(true);
    fixture.componentInstance.refreshBalance();
    expect(refreshSpy).toHaveBeenCalledWith(fakeAccount.address);
  });
});
