import { utils, BigNumber } from 'ethers';
import { FC, ChangeEvent, useEffect, useCallback, useContext, useState } from 'react';
import { format } from 'date-fns';
import Switch from '@material-ui/core/Switch';
import { TransferEventListener } from '../../services/ERC20TokenService';
import getPoolDataAdapter from '../../adapters/getPoolDataAdapter';
import PoolDataAdapter from '../../adapters/PoolDataAdapter';
import { DashboardRowChild } from '../../interfaces';
import { Context } from '../../context';
import TokenIcon, { getTickerFromProtocol } from '../tokenIcon';
import Typography from '../typography/Typography';
import Spacer from '../spacer/spacer';
import DetailUserInfo from './shared/detailUserInfo/detailUserInfo';
import DetailBasic from './basic/detailBasic';
import DetailAdvanced from './advanced/detailAdvanced';

import './detail.scss';
import NumberUtils from '../../services/NumberUtils';

type DetailInProps = {
  content: DashboardRowChild;
};

type DetailOutPros = {
  onClose: () => void;
};

type DetailProps = DetailInProps & DetailOutPros;

const Detail: FC<DetailProps> = ({ content, onClose }) => {
  const { token, protocol, maturityDate, tempusPool } = content;
  const { address, ammAddress } = tempusPool || {};

  const [showAdvancedUI, setShowAdvancedUI] = useState<boolean>(false);
  const [poolDataAdapter, setPoolDataAdapter] = useState<PoolDataAdapter | null>(null);

  const { data, setData } = useContext(Context);
  const { userWalletAddress, userWalletSigner } = data;

  const [poolFees, setPoolFees] = useState<BigNumber[] | []>([]);

  const onInterfaceChange = useCallback(
    (_: ChangeEvent<{}>, checked: boolean) => {
      setShowAdvancedUI(checked);
    },
    [setShowAdvancedUI],
  );

  useEffect(() => {
    if (userWalletSigner) {
      setPoolDataAdapter(getPoolDataAdapter(userWalletSigner));
    }
  }, [userWalletSigner]);

  // Fetch user balances
  useEffect(() => {
    const fetchBalances = async () => {
      if (!setData || !poolDataAdapter || !userWalletSigner) {
        return;
      }

      const [principalsBalance, yieldsBalance, lpBalance] = await Promise.all([
        poolDataAdapter.getTokenBalance(content.principalTokenAddress, userWalletAddress, userWalletSigner),
        poolDataAdapter.getTokenBalance(content.yieldTokenAddress, userWalletAddress, userWalletSigner),
        poolDataAdapter.getTokenBalance(tempusPool.ammAddress, userWalletAddress, userWalletSigner),
      ]);

      setData(previousData => ({
        ...previousData,
        userPrincipalsBalance: principalsBalance,
        userYieldsBalance: yieldsBalance,
        userLPBalance: lpBalance,
      }));
    };
    fetchBalances();
  }, [
    setData,
    poolDataAdapter,
    content.principalTokenAddress,
    content.yieldTokenAddress,
    tempusPool.ammAddress,
    userWalletAddress,
    userWalletSigner,
  ]);

  useEffect(() => {
    const getPoolFees = async () => {
      if (!setPoolFees || !poolDataAdapter) {
        return;
      }

      if (poolDataAdapter) {
        const poolFees = await poolDataAdapter.getPoolFees(address, ammAddress);
        if (poolFees && poolFees.length) {
          setPoolFees(poolFees);
        }
      }
    };

    getPoolFees();
  }, [address, ammAddress, setPoolFees, poolDataAdapter]);

  const onPrincipalReceived: TransferEventListener = useCallback(
    (from, to, value) => {
      if (!setData) {
        return;
      }

      setData(previousData => {
        if (!previousData.userPrincipalsBalance) {
          return previousData;
        }
        return {
          ...previousData,
          userPrincipalsBalance: previousData.userPrincipalsBalance.add(value),
        };
      });
    },
    [setData],
  );

  const onYieldsReceived: TransferEventListener = useCallback(
    (from, to, value) => {
      if (!setData) {
        return;
      }

      setData(previousData => {
        if (!previousData.userYieldsBalance) {
          return previousData;
        }
        return {
          ...previousData,
          userYieldsBalance: previousData.userYieldsBalance.add(value),
        };
      });
    },
    [setData],
  );

  const onLPReceived: TransferEventListener = useCallback(
    (from, to, value) => {
      if (!setData) {
        return;
      }

      setData(previousData => {
        if (!previousData.userLPBalance) {
          return previousData;
        }
        return {
          ...previousData,
          userLPBalance: previousData.userLPBalance.add(value),
        };
      });
    },
    [setData],
  );

  // Subscribe to token balance updates
  useEffect(() => {
    if (!poolDataAdapter || !userWalletSigner) {
      return;
    }
    poolDataAdapter.onTokenReceived(
      content.principalTokenAddress,
      userWalletAddress,
      userWalletSigner,
      onPrincipalReceived,
    );
    poolDataAdapter.onTokenReceived(content.yieldTokenAddress, userWalletAddress, userWalletSigner, onYieldsReceived);
    poolDataAdapter.onTokenReceived(tempusPool.ammAddress, userWalletAddress, userWalletSigner, onLPReceived);
  }, [
    onPrincipalReceived,
    onYieldsReceived,
    onLPReceived,
    poolDataAdapter,
    content.principalTokenAddress,
    content.yieldTokenAddress,
    tempusPool.ammAddress,
    userWalletSigner,
    userWalletAddress,
  ]);

  return (
    <div className="tf__detail__section__container">
      <div className="tf__dialog-container">
        <div className="tf__dialog-container__header">
          <div className="tf__dialog-container__header-summary-data">
            <TokenIcon ticker={token} />
            <Typography color="default" variant="h4">
              {token} via
            </Typography>
            <TokenIcon ticker={getTickerFromProtocol(protocol)} />
            <Typography color="default" variant="h4" capitalize={true}>
              {protocol}
            </Typography>
            <Typography color="default" variant="h4">
              -
            </Typography>
            <Typography color="default" variant="h4">
              Matures on {format(maturityDate, 'dd MMM yy')}
            </Typography>
          </div>
          <div className="tf__dialog-container__header-ui-toggle">
            <Switch checked={showAdvancedUI} onChange={onInterfaceChange} name="advanced-options" />
            <Typography color="default" variant="h4">
              Advanced options
            </Typography>
          </div>
        </div>
        <div className="tf__divider" />
        <div className="tf__dialog-container__fees">
          <Typography color="default" variant="h4">
            Fees:
          </Typography>
          <Typography color="default" variant="h5">
            Deposit {NumberUtils.formatPercentage(Number(utils.formatEther(poolFees[0])))}
          </Typography>
          <Typography color="default" variant="h5">
            Redemption {NumberUtils.formatPercentage(Number(utils.formatEther(poolFees[2])))}
          </Typography>
          <Typography color="default" variant="h5">
            Early Redemption {NumberUtils.formatPercentage(Number(utils.formatEther(poolFees[1])))}
          </Typography>
          <Typography color="default" variant="h5">
            Swap {NumberUtils.formatPercentage(Number(utils.formatEther(poolFees[3])))}
          </Typography>
        </div>

        <Spacer size={18} />
        <div className="tf__dialog__content">
          {showAdvancedUI ? (
            <DetailAdvanced
              content={content}
              tempusPool={tempusPool}
              userWalletAddress={userWalletAddress}
              poolDataAdapter={poolDataAdapter}
              signer={userWalletSigner}
            />
          ) : (
            <DetailBasic
              content={content}
              tempusPool={tempusPool}
              signer={userWalletSigner}
              userWalletAddress={userWalletAddress}
              poolDataAdapter={poolDataAdapter}
            />
          )}
        </div>
      </div>
      <Spacer size={23} />
      <div className="tf__user__details-container">
        <DetailUserInfo
          content={content}
          poolDataAdapter={poolDataAdapter}
          tempusPool={tempusPool}
          signer={userWalletSigner}
          userWalletAddress={userWalletAddress}
        />
      </div>
    </div>
  );
};

export default Detail;
