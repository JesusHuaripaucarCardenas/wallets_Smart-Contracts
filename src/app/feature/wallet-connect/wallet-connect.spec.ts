import { TestBed } from '@angular/core/testing';
import { WalletConnectComponent } from './wallet-connect';
import { WalletService } from '../../core/services/wallet.service';

describe('WalletConnectComponent', () => {
  let connectSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    connectSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [WalletConnectComponent],
    })
      .overrideProvider(WalletService, {
        useValue: {
          isConnected: () => false,
          isLoading: () => false,
          error: () => null,
          account: () => ({}),
          isPaliInstalled: () => true,
          connect: connectSpy,
          disconnect: vi.fn(),
          switchOrAddNetwork: vi.fn(),
        },
      })
      .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(WalletConnectComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should list Hoodi and Sepolia networks', () => {
    const fixture = TestBed.createComponent(WalletConnectComponent);
    expect(fixture.componentInstance.networks.map((n) => n.key)).toEqual([
      'hoodi',
      'sepolia',
    ]);
  });

  it('should call walletService.connect() when connecting', () => {
    const fixture = TestBed.createComponent(WalletConnectComponent);
    fixture.componentInstance.connect();
    expect(connectSpy).toHaveBeenCalled();
  });
});
