import { TestBed } from '@angular/core/testing';
import { NetworkService } from './network.service';

describe('NetworkService', () => {
  let service: NetworkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return both Hoodi and Sepolia networks', () => {
    const networks = service.getAll();
    expect(networks.length).toBe(2);
    expect(networks.map((n) => n.key)).toEqual(['hoodi', 'sepolia']);
  });

  it('should find Hoodi network by chainId 560048', () => {
    const network = service.getByKey('hoodi');
    expect(network?.chainIdDecimal).toBe(560048);
    expect(network?.chainIdHex).toBe('0x88bb0');
  });

  it('should find Sepolia network by chainId 11155111', () => {
    const network = service.getByKey('sepolia');
    expect(network?.chainIdDecimal).toBe(11155111);
    expect(network?.chainIdHex).toBe('0xaa36a7');
  });

  it('should find a network by its hex chainId', () => {
    const network = service.getByChainIdHex('0x88bb0');
    expect(network?.key).toBe('hoodi');
  });

  it('should build valid wallet_addEthereumChain params', () => {
    const hoodi = service.getByKey('hoodi')!;
    const params = service.toAddChainParams(hoodi);
    expect(params.chainId).toBe('0x88bb0');
    expect(params.nativeCurrency.symbol).toBe('ETH');
  });
});
