import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import { JsonRpcSigner } from '@ethersproject/providers';
import Button from '@material-ui/core/Button';
import { Context } from '../../../context';
import { DashboardRowChild, Ticker } from '../../../interfaces';
import { TempusPool } from '../../../interfaces/TempusPool';
import PoolDataAdapter from '../../../adapters/PoolDataAdapter';
import NumberUtils from '../../../services/NumberUtils';
import getConfig from '../../../utils/get-config';
import { mul18f } from '../../../utils/wei-math';
import Typography from '../../typography/Typography';
import Spacer from '../../spacer/spacer';
import TokenSelector from '../../tokenSelector';
import CurrencyInput from '../../currencyInput';
import ActionContainer from '../shared/actionContainer';
import SectionContainer from '../shared/sectionContainer';
import PlusIconContainer from '../shared/plusIconContainer';
import ApproveButton from '../shared/approveButton';
import ExecuteButton from '../shared/executeButton';

import './detailMint.scss';
import { getMintNotification } from '../../../services/NotificationService';

type DetailMintInProps = {
  content: DashboardRowChild;
  tempusPool: TempusPool;
  userWalletAddress: string;
  signer: JsonRpcSigner | null;
  poolDataAdapter: PoolDataAdapter | null;
};

type DetailMintOutProps = {};

type DetailMintProps = DetailMintInProps & DetailMintOutProps;

const DetailMint: FC<DetailMintProps> = props => {
  const { content, tempusPool, userWalletAddress, poolDataAdapter } = props;
  const { supportedTokens } = content;
  const [backingToken] = supportedTokens;

  const {
    data: { userBackingTokenBalance, userYieldBearingTokenBalance },
  } = useContext(Context);

  const [selectedToken, setSelectedToken] = useState<Ticker | null>(null);
  const [amount, setAmount] = useState<string>('0');
  const [estimatedTokens, setEstimatedTokens] = useState<BigNumber | null>(null);
  const [executeDisabled, setExecuteDisabled] = useState<boolean>(backingToken !== 'ETH');

  const onTokenChange = useCallback(
    (token: Ticker | undefined) => {
      if (!token) {
        return;
      }
      setSelectedToken(token);
    },
    [setSelectedToken],
  );

  const onAmountChange = useCallback(
    (amount: string) => {
      if (amount) {
        setAmount(amount);
      } else {
        setAmount('0');
      }
    },
    [setAmount],
  );

  /**
   * Update amount field when user clicks on percentage buttons.
   * - Requires token balance to be loaded so we can calculate percentage of that.
   */
  const onPercentageChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const currentBalance = selectedToken === backingToken ? userBackingTokenBalance : userYieldBearingTokenBalance;
      if (!currentBalance) {
        return;
      }
      const percentage = ethers.utils.parseEther(event.currentTarget.value);
      setAmount(ethers.utils.formatEther(mul18f(currentBalance, percentage)));
    },
    [backingToken, selectedToken, userBackingTokenBalance, userYieldBearingTokenBalance],
  );

  const onApproved = useCallback(() => {
    setExecuteDisabled(false);
  }, []);

  const onExecuted = useCallback(() => {
    setExecuteDisabled(false);
  }, []);

  const onExecute = useCallback((): Promise<ethers.ContractTransaction | undefined> => {
    if (!poolDataAdapter) {
      return Promise.resolve(undefined);
    }

    const amountParsed = ethers.utils.parseEther(amount);

    return poolDataAdapter.deposit(
      tempusPool.address,
      amountParsed,
      userWalletAddress,
      selectedToken === backingToken,
      selectedToken === 'ETH',
    );
  }, [amount, backingToken, poolDataAdapter, selectedToken, tempusPool.address, userWalletAddress]);

  // Fetch estimated tokens returned
  useEffect(() => {
    const getEstimates = async () => {
      if (!poolDataAdapter) {
        return;
      }
      const isBackingToken = selectedToken === backingToken;
      const amountParsed = ethers.utils.parseEther(amount.toString());

      try {
        setEstimatedTokens(
          await poolDataAdapter.estimatedMintedShares(tempusPool.address, amountParsed, isBackingToken),
        );
      } catch (error) {
        console.error('DetailMint - getEstimates() - Failed to get estimate for selected token!', error);
      }
    };
    getEstimates();
  }, [amount, backingToken, poolDataAdapter, selectedToken, tempusPool]);

  const balanceFormatted = useMemo(() => {
    const currentBalance = selectedToken === backingToken ? userBackingTokenBalance : userYieldBearingTokenBalance;
    if (!currentBalance) {
      return null;
    }
    return NumberUtils.formatToCurrency(ethers.utils.formatEther(currentBalance), tempusPool.decimalsForUI);
  }, [backingToken, selectedToken, tempusPool.decimalsForUI, userBackingTokenBalance, userYieldBearingTokenBalance]);

  const estimatedTokensFormatted = useMemo(() => {
    if (!estimatedTokens) {
      return null;
    }
    return NumberUtils.formatToCurrency(ethers.utils.formatEther(estimatedTokens), tempusPool.decimalsForUI);
  }, [estimatedTokens, tempusPool.decimalsForUI]);

  return (
    <div role="tabpanel">
      <div className="tf__dialog__content-tab">
        <ActionContainer label="From">
          <Spacer size={18} />
          <SectionContainer>
            <div className="tf__dialog__flex-row">
              <div className="tf__dialog__label-align-right">
                <Typography variant="body-text">Token</Typography>
              </div>
              <TokenSelector tickers={supportedTokens} onTokenChange={onTokenChange} />
              <Spacer size={20} />
              <Typography variant="body-text">
                {selectedToken && balanceFormatted && `Balance: ${balanceFormatted} ${selectedToken}`}
              </Typography>
            </div>
            <Spacer size={14} />
            <div className="tf__dialog__flex-row">
              <div className="tf__dialog__label-align-right">
                <Typography variant="body-text">Amount</Typography>
              </div>
              <CurrencyInput defaultValue={amount} onChange={onAmountChange} disabled={!selectedToken} />
              <Spacer size={20} />
              <Button variant="contained" size="small" value="0.25" onClick={onPercentageChange}>
                25%
              </Button>
              <Spacer size={10} />
              <Button variant="contained" size="small" value="0.5" onClick={onPercentageChange}>
                50%
              </Button>
              <Spacer size={10} />
              <Button variant="contained" size="small" value="0.75" onClick={onPercentageChange}>
                75%
              </Button>
              <Spacer size={10} />
              <Button variant="contained" size="small" value="1" onClick={onPercentageChange}>
                Max
              </Button>
            </div>
          </SectionContainer>
        </ActionContainer>
        <Spacer size={20} />
        <ActionContainer label="To">
          <Spacer size={20} />
          <div className="tf__dialog__flex-row">
            <div className="tf__dialog__flex-row-half-width">
              <SectionContainer>
                <Typography variant="h4">Principals</Typography>
                <Spacer size={14} />
                <Typography variant="body-text">est. {estimatedTokensFormatted} Principals</Typography>
              </SectionContainer>
            </div>
            <PlusIconContainer orientation="vertical" />
            <div className="tf__dialog__flex-row-half-width">
              <SectionContainer>
                <Typography variant="h4">Yields</Typography>
                <Spacer size={14} />
                <Typography variant="body-text">est. {estimatedTokensFormatted} Yields</Typography>
              </SectionContainer>
            </div>
          </div>
        </ActionContainer>
        <Spacer size={20} />
        <div className="tf__flex-row-center-vh">
          {selectedToken && selectedToken !== 'ETH' && (
            <>
              <ApproveButton
                amountToApprove={
                  selectedToken === backingToken ? userBackingTokenBalance : userYieldBearingTokenBalance
                }
                onApproved={onApproved}
                poolDataAdapter={poolDataAdapter}
                spenderAddress={getConfig().tempusControllerContract}
                tokenTicker={selectedToken}
                tokenToApprove={
                  selectedToken === backingToken ? content.backingTokenAddress : content.yieldBearingTokenAddress
                }
              />
              <Spacer size={20} />
            </>
          )}
          <ExecuteButton
            actionName="Mint"
            notificationText={getMintNotification(
              estimatedTokensFormatted || '',
              content.backingTokenTicker,
              content.protocol,
              content.maturityDate,
            )}
            disabled={executeDisabled}
            onExecute={onExecute}
            onExecuted={onExecuted}
          />
        </div>
      </div>
    </div>
  );
};

export default DetailMint;
