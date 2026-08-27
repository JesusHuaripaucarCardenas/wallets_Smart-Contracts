import { ShortAddressPipe } from './short-address.pipe';

describe('ShortAddressPipe', () => {
  const pipe = new ShortAddressPipe();

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should shorten a long address', () => {
    const address = '0x1234567890abcdef1234567890abcdef12345678';
    expect(pipe.transform(address)).toBe('0x1234...5678');
  });

  it('should return empty string for null/undefined', () => {
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return the same value if already short', () => {
    expect(pipe.transform('0xabc')).toBe('0xabc');
  });
});
