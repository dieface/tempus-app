import { utils, BigNumber } from 'ethers';
import TokenParser from './TokenParser';

describe('TokenParser', () => {
  describe('parse()', () => {
    it('exposes a static method `parse()`', () => {
      expect(TokenParser.parse).toBeDefined();
    });

    it('returns a BigNumber when passing a value and a token', () => {
      const result = TokenParser.parse('1', 'ETH');
      const expected = utils.parseEther('1');
      expect(result).toStrictEqual(expected);
    });
  });

  describe('format()', () => {
    it('exposes a static method `format()`', () => {
      expect(TokenParser.format).toBeDefined();
    });

    it('returns a string when passing a value and a token', () => {
      const value = utils.parseEther('1');
      const result = TokenParser.format(value, 'ETH');
      const expected = '1.0';
      expect(result).toBe(expected);
    });
  });
});
