import { BigNumber, utils } from 'ethers';
import { Ticker } from '../interfaces';

const isCompound = (token: Ticker): boolean => ['cDAI', 'cUSDC'].includes(token);

class TokenParser {
  static parse(value: string, token: Ticker): BigNumber | null {
    let parsed: BigNumber | null = null;

    if (isCompound(token)) {
    } else if (token === 'cUSDC') {
    } else {
      parsed = utils.parseEther(value);
    }

    return parsed;
  }

  static format(value: BigNumber, token: Ticker): string {
    let formatted: string = '';

    if (isCompound(token)) {
    } else if (token === 'cUSDC') {
    } else {
      formatted = utils.formatEther(value);
    }

    return formatted;
  }
}

export default TokenParser;
