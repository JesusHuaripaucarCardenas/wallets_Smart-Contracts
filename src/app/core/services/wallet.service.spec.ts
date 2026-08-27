import { TestBed } from '@angular/core/testing';
import { BrowserProvider } from 'ethers';
import { WalletService } from './wallet.service';
import { NetworkService } from './network.service';
import { EthersProviderFactory } from './ethers-provider.factory';

const fakeAddress = '0x1234567890abcdef1234567890abcdef12345678';

describe('WalletService', () => {
  let service: WalletService;
  let getBalanceMock: ReturnType<typeof vi.fn>;
  let getNetworkMock: ReturnType<typeof vi.fn>;
  let getSignerMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    getBalanceMock = vi.fn().mockResolvedValue(1000000000000000000n);
    getNetworkMock = vi.fn().mockResolvedValue({ chainId: 560048n });
    getSignerMock = vi.fn().mockResolvedValue({
      getAddress: vi.fn().mockResolvedValue(fakeAddress),
    });

    const fakeProvider = {
      getBalance: getBalanceMock,
      getNetwork: getNetworkMock,
      getSigner: getSignerMock,
    } as unknown as BrowserProvider;

    (window as unknown as { ethereum?: unknown }).ethereum = {
      isPali: true,
      request: vi.fn().mockResolvedValue([fakeAddress]),
      on: vi.fn(),
      removeListener: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        NetworkService,
        {
          provide: EthersProviderFactory,
          useValue: { create: vi.fn().mockReturnValue(fakeProvider) },
        },
      ],
    });
    service = TestBed.inject(WalletService);
  });

  afterEach(() => {
    delete (window as unknown as { ethereum?: unknown }).ethereum;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect Pali Wallet as installed', () => {
    expect(service.isPaliInstalled()).toBe(true);
  });

  it('should connect and expose address + balance', async () => {
    await service.connect();

    expect(service.isConnected()).toBe(true);
    expect(service.account().address).toBe(fakeAddress);
    expect(service.account().balanceEth).toBe('1.0');
    expect(service.account().networkName).toBe('Ethereum Hoodi');
  });

  it('should set an error when Pali Wallet is not installed', async () => {
    delete (window as unknown as { ethereum?: unknown }).ethereum;
    await service.connect();

    expect(service.isConnected()).toBe(false);
    expect(service.error()).toContain('Pali Wallet');
  });

  it('should reset state on disconnect', async () => {
    await service.connect();
    service.disconnect();

    expect(service.isConnected()).toBe(false);
    expect(service.account().address).toBeNull();
  });
});
