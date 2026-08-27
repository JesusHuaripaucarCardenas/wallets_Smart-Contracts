import { TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';
import { WalletService } from '../../core/services/wallet.service';

describe('HomeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    })
      .overrideProvider(WalletService, {
        useValue: {
          account: () => ({ address: null }),
          isConnected: () => false,
          isLoading: () => false,
          error: () => null,
          isPaliInstalled: () => true,
          connect: vi.fn(),
          disconnect: vi.fn(),
          switchOrAddNetwork: vi.fn(),
          refreshAccountData: vi.fn(),
        },
      })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render both wallet-connect and wallet-dashboard', () => {
    const fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-wallet-connect')).toBeTruthy();
    expect(el.querySelector('app-wallet-dashboard')).toBeTruthy();
  });
});
