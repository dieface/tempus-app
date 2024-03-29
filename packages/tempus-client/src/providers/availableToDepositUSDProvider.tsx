import { FC, useCallback, useContext, useEffect } from 'react';
import UserBalanceDataAdapter from '../adapters/UserBalanceDataAdapter';
import { Context } from '../context';
import { TempusPool } from '../interfaces/TempusPool';
import getERC20TokenService from '../services/getERC20TokenService';
import getConfig from '../utils/get-config';

interface PresentValueProviderProps {
  userBalanceDataAdapter: UserBalanceDataAdapter;
}

const AvailableToDepositUSDProvider: FC<PresentValueProviderProps> = props => {
  const { userBalanceDataAdapter } = props;

  const {
    setData,
    data: { userWalletAddress, userWalletSigner },
  } = useContext(Context);

  const updateUserAvailableToDepositUSDForPool = useCallback(
    async (tempusPool: TempusPool) => {
      const userAvailableToDepositUSDForPool = await userBalanceDataAdapter.getUserUSDAvailableToDepositForPool(
        tempusPool,
        userWalletAddress,
      );

      setData &&
        setData(previousData => ({
          ...previousData,
          poolData: previousData.poolData.map(previousPoolData => {
            if (previousPoolData.address !== tempusPool.address) {
              return previousPoolData;
            }
            return {
              ...previousPoolData,
              userAvailableToDepositUSD: userAvailableToDepositUSDForPool,
            };
          }),
        }));
    },
    [setData, userBalanceDataAdapter, userWalletAddress],
  );

  const updateAvailableToDepositUSD = useCallback(() => {
    getConfig().tempusPools.forEach(poolConfig => {
      if (userWalletSigner) {
        updateUserAvailableToDepositUSDForPool(poolConfig);
      }
    });
  }, [userWalletSigner, updateUserAvailableToDepositUSDForPool]);

  /**
   * Fetch available to deposit USD when component mounts
   */
  useEffect(() => {
    updateAvailableToDepositUSD();
  }, [updateAvailableToDepositUSD]);

  /**
   * Subscribe to user principals, yields and LP Token transfer events for all pools
   */
  useEffect(() => {
    if (!userWalletSigner) {
      return;
    }

    getConfig().tempusPools.forEach(poolConfig => {
      const backingTokenService = getERC20TokenService(poolConfig.backingToken, userWalletSigner);
      const yieldBearingTokenService = getERC20TokenService(poolConfig.yieldBearingTokenAddress, userWalletSigner);

      backingTokenService.onTransfer(userWalletAddress, null, updateAvailableToDepositUSD);
      backingTokenService.onTransfer(null, userWalletAddress, updateAvailableToDepositUSD);

      yieldBearingTokenService.onTransfer(userWalletAddress, null, updateAvailableToDepositUSD);
      yieldBearingTokenService.onTransfer(null, userWalletAddress, updateAvailableToDepositUSD);
    });

    return () => {
      getConfig().tempusPools.forEach(poolConfig => {
        const backingTokenService = getERC20TokenService(poolConfig.backingToken, userWalletSigner);
        const yieldBearingTokenService = getERC20TokenService(poolConfig.yieldBearingTokenAddress, userWalletSigner);

        backingTokenService.offTransfer(userWalletAddress, null, updateAvailableToDepositUSD);
        backingTokenService.offTransfer(null, userWalletAddress, updateAvailableToDepositUSD);

        yieldBearingTokenService.offTransfer(userWalletAddress, null, updateAvailableToDepositUSD);
        yieldBearingTokenService.offTransfer(null, userWalletAddress, updateAvailableToDepositUSD);
      });
    };
  }, [setData, userWalletSigner, userWalletAddress, updateAvailableToDepositUSD]);

  /**
   * Provider component only updates context value when needed. It does not show anything in the UI.
   */
  return null;
};
export default AvailableToDepositUSDProvider;
