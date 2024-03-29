import { JsonRpcSigner, JsonRpcProvider } from '@ethersproject/providers';
import getDefaultProvider from '../services/getDefaultProvider';
import getERC20TokenService from '../services/getERC20TokenService';
import getStatisticsService from '../services/getStatisticsService';
import getTempusPoolService from '../services/getTempusPoolService';
import UserBalanceDataAdapter from './UserBalanceDataAdapter';

let userBalanceDataAdapter: UserBalanceDataAdapter;
const getUserBalanceDataAdapter = (signerOrProvider?: JsonRpcSigner | JsonRpcProvider): UserBalanceDataAdapter => {
  if (!userBalanceDataAdapter) {
    userBalanceDataAdapter = new UserBalanceDataAdapter();
    userBalanceDataAdapter.init({
      signerOrProvider: getDefaultProvider(),
      statisticsService: getStatisticsService(),
      tempusPoolService: getTempusPoolService(),
      eRC20TokenServiceGetter: getERC20TokenService,
    });
  }

  if (signerOrProvider) {
    userBalanceDataAdapter.init({
      signerOrProvider: signerOrProvider,
      statisticsService: getStatisticsService(signerOrProvider),
      tempusPoolService: getTempusPoolService(signerOrProvider),
      eRC20TokenServiceGetter: getERC20TokenService,
    });
  }

  return userBalanceDataAdapter;
};

export default getUserBalanceDataAdapter;
