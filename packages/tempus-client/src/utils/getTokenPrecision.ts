import { DEFAULT_TOKEN_PRECISION } from '../constants';
import { TokenTypePrecision } from '../interfaces';
import getConfig from './get-config';

const tokenPrecisionCache: { [address: string]: { [key in TokenTypePrecision]?: number } } = {};

const getTokenPrecision = (poolAddress: string, tokenTypePrecision: TokenTypePrecision): number => {
  if (tokenPrecisionCache[poolAddress] && tokenPrecisionCache[poolAddress][tokenTypePrecision]) {
    return tokenPrecisionCache[poolAddress][tokenTypePrecision] || 0;
  }

  const pool = getConfig().tempusPools.find(config => config.address === poolAddress);

  if (!pool) {
    return 0;
  }

  if (!tokenPrecisionCache[poolAddress]) {
    tokenPrecisionCache[poolAddress] = {};
  }

  tokenPrecisionCache[poolAddress][tokenTypePrecision] =
    pool.tokenPrecision && pool.tokenPrecision[tokenTypePrecision] !== undefined
      ? pool.tokenPrecision[tokenTypePrecision]
      : DEFAULT_TOKEN_PRECISION;

  return tokenPrecisionCache[poolAddress][tokenTypePrecision] || 0;
};

export default getTokenPrecision;
