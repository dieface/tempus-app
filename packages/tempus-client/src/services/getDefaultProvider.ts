import { AlchemyProvider, JsonRpcProvider } from '@ethersproject/providers';
import getConfig from '../utils/get-config';

let defaultProvider: JsonRpcProvider;
const getDefaultProvider = () => {
  if (!defaultProvider) {
    defaultProvider = new JsonRpcProvider('http://127.0.0.1:8545', { chainId: 31337, name: 'localhost' });
  }

  return defaultProvider;
};

export default getDefaultProvider;
