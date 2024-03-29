import React, { FC, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BigNumber, ethers } from 'ethers';
import { JsonRpcSigner } from '@ethersproject/providers';
import { catchError } from 'rxjs';
import Button from '@material-ui/core/Button';
import { Context, getDataForPool } from '../../../context';
import { DashboardRowChild, Ticker } from '../../../interfaces';
import { TempusPool } from '../../../interfaces/TempusPool';
import PoolDataAdapter from '../../../adapters/PoolDataAdapter';
import NumberUtils from '../../../services/NumberUtils';
import getTokenPrecision from '../../../utils/getTokenPrecision';
import getConfig from '../../../utils/get-config';
import { mul18f } from '../../../utils/wei-math';
import { isZeroString } from '../../../utils/isZeroString';
import Typography from '../../typography/Typography';
import Spacer from '../../spacer/spacer';
import AlertIcon from '../../icons/AlertIcon';
import TokenSelector from '../../tokenSelector';
import CurrencyInput from '../../currencyInput/currencyInput';
import ActionContainer from '../shared/actionContainer';
import SectionContainer from '../shared/sectionContainer';
import PlusIconContainer from '../shared/plusIconContainer';
import ApproveButton from '../shared/approveButton';
import ExecuteButton from '../shared/executeButton';

import './detailMint.scss';

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
  const { address } = tempusPool;
  const { supportedTokens } = content;
  const [backingToken] = supportedTokens;

  const {
    data: { poolData },
  } = useContext(Context);

  const [isYieldNegative, setIsYieldNegative] = useState<boolean | null>(null);
  const [selectedToken, setSelectedToken] = useState<Ticker | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [estimatedTokens, setEstimatedTokens] = useState<BigNumber | null>(null);
  const [tokensApproved, setTokensApproved] = useState<boolean>(false);
  const [estimateInProgress, setEstimateInProgress] = useState<boolean>(false);
  const [tokenPrecision, setTokenPrecision] = useState<number>(0);

  const getSelectedTokenBalance = useCallback((): BigNumber | null => {
    if (!selectedToken) {
      return null;
    }
    const data = getDataForPool(content.tempusPool.address, poolData);

    return selectedToken === backingToken ? data.userBackingTokenBalance : data.userYieldBearingTokenBalance;
  }, [backingToken, content.tempusPool.address, poolData, selectedToken]);

  const getSelectedTokenAddress = useCallback((): string | null => {
    if (!selectedToken) {
      return null;
    }
    return selectedToken === backingToken ? content.backingTokenAddress : content.yieldBearingTokenAddress;
  }, [backingToken, content.backingTokenAddress, content.yieldBearingTokenAddress, selectedToken]);

  const onTokenChange = useCallback(
    (token: Ticker | undefined) => {
      if (!token) {
        return;
      }
      if (backingToken === token) {
        setTokenPrecision(getTokenPrecision(address, 'backingToken'));
      } else {
        setTokenPrecision(getTokenPrecision(address, 'yieldBearingToken'));
      }

      setSelectedToken(token);
    },
    [address, backingToken, setSelectedToken],
  );

  const onAmountChange = useCallback(
    (amount: string) => {
      if (amount) {
        setAmount(amount);
      } else {
        setAmount('');
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
      const data = getDataForPool(content.tempusPool.address, poolData);

      const currentBalance =
        selectedToken === backingToken ? data.userBackingTokenBalance : data.userYieldBearingTokenBalance;
      if (!currentBalance) {
        return;
      }
      const percentage = ethers.utils.parseUnits(event.currentTarget.value, tokenPrecision);
      setAmount(ethers.utils.formatUnits(mul18f(currentBalance, percentage, tokenPrecision), tokenPrecision));
    },
    [backingToken, content.tempusPool.address, poolData, selectedToken, tokenPrecision],
  );

  const onApproveChange = useCallback(approved => {
    setTokensApproved(approved);
  }, []);

  const onExecute = useCallback((): Promise<ethers.ContractTransaction | undefined> => {
    if (!poolDataAdapter) {
      return Promise.resolve(undefined);
    }

    const amountParsed = ethers.utils.parseUnits(amount, tokenPrecision);

    return poolDataAdapter.deposit(
      address,
      amountParsed,
      userWalletAddress,
      selectedToken === backingToken,
      selectedToken === 'ETH',
    );
  }, [amount, backingToken, tokenPrecision, poolDataAdapter, selectedToken, address, userWalletAddress]);

  const onExecuted = useCallback(() => {
    setAmount('');
  }, []);

  // Fetch estimated tokens returned
  useEffect(() => {
    if (!poolDataAdapter || !amount) {
      return;
    }

    const isBackingToken = selectedToken === backingToken;
    const amountParsed = ethers.utils.parseUnits(amount, tokenPrecision);

    try {
      setEstimateInProgress(true);
      const stream$ = poolDataAdapter
        .estimatedMintedShares(address, amountParsed, isBackingToken)
        .pipe(
          catchError((error, caught) => {
            console.log('DetailMint - estimatedMintedShares - Failed to retrieve estimated minted shares!', error);
            return caught;
          }),
        )
        .subscribe(estimatedMintedShares => {
          setEstimatedTokens(estimatedMintedShares);
          setEstimateInProgress(false);
        });

      return () => stream$.unsubscribe();
    } catch (error) {
      console.error('DetailMint - getEstimates() - Failed to get estimates for selected token!', error);
      setEstimateInProgress(false);
    }
  }, [tokenPrecision, amount, backingToken, poolDataAdapter, selectedToken, address]);

  useEffect(() => {
    if (!poolDataAdapter) {
      return;
    }

    const stream$ = poolDataAdapter
      .isCurrentYieldNegativeForPool(address)
      .pipe(
        catchError((error, caught) => {
          console.log('DetailMint - isCurrentYieldNegativeForPool - Failed to retrieve current yield!', error);
          return caught;
        }),
      )
      .subscribe(isYieldNegative => {
        setIsYieldNegative(isYieldNegative);
      });

    return () => stream$.unsubscribe();
  }, [address, poolDataAdapter]);

  const balanceFormatted = useMemo(() => {
    const data = getDataForPool(content.tempusPool.address, poolData);

    const currentBalance =
      selectedToken === backingToken ? data.userBackingTokenBalance : data.userYieldBearingTokenBalance;
    if (!currentBalance) {
      return null;
    }
    return NumberUtils.formatToCurrency(
      ethers.utils.formatUnits(currentBalance, tokenPrecision),
      tempusPool.decimalsForUI,
    );
  }, [backingToken, content.tempusPool.address, poolData, selectedToken, tokenPrecision, tempusPool.decimalsForUI]);

  const estimatedTokensFormatted = useMemo(() => {
    if (!estimatedTokens) {
      return null;
    }
    return NumberUtils.formatToCurrency(
      ethers.utils.formatUnits(estimatedTokens, tokenPrecision),
      tempusPool.decimalsForUI,
    );
  }, [estimatedTokens, tokenPrecision, tempusPool.decimalsForUI]);

  const approveDisabled = useMemo((): boolean => {
    const zeroAmount = isZeroString(amount);

    return zeroAmount;
  }, [amount]);

  const mintDisabled = useMemo((): boolean => {
    return isYieldNegative === null ? true : isYieldNegative;
  }, [isYieldNegative]);

  const executeDisabled = useMemo((): boolean => {
    const zeroAmount = isZeroString(amount);
    const amountExceedsBalance = ethers.utils
      .parseUnits(amount || '0', tokenPrecision)
      .gt(getSelectedTokenBalance() || BigNumber.from('0'));

    return !tokensApproved || zeroAmount || amountExceedsBalance || estimateInProgress || mintDisabled;
  }, [amount, tokenPrecision, getSelectedTokenBalance, tokensApproved, estimateInProgress, mintDisabled]);

  return (
    <>
      <div role="tabpanel">
        <div className="tf__dialog__content-tab">
          {isYieldNegative && (
            <>
              <SectionContainer>
                <div className="tf__tab__warning">
                  <div className="tf__tab__warning__title">
                    <AlertIcon fillColor="#FF0F0F" />
                    <Typography variant="h4">Negative Yield - Deposits Disabled</Typography>
                  </div>
                  <div className="tf__tab__warning__content">
                    <p>
                      Depositing into this pool is temporarily disabled as the current yield in this pool is negative.
                    </p>
                    <p>
                      Deposits will be automatically re-enabled once yield recovers into a neutral or positive
                      territory. Existing depositors are free to perform other actions (e.g. Withdraw, Swap, Pool,
                      Redeem).
                    </p>
                  </div>
                </div>
              </SectionContainer>
              <Spacer size={25} />
            </>
          )}

          <ActionContainer label="From">
            <Spacer size={18} />
            <SectionContainer>
              <div className="tf__dialog__flex-row">
                <div className="tf__dialog__label-align-right">
                  <Typography variant="body-text">Token</Typography>
                </div>
                <TokenSelector tickers={supportedTokens} disabled={mintDisabled} onTokenChange={onTokenChange} />
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
                {selectedToken && (
                  <>
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
                  </>
                )}
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
            {selectedToken && (
              <ApproveButton
                poolDataAdapter={poolDataAdapter}
                tokenToApproveAddress={getSelectedTokenAddress()}
                tokenToApproveTicker={selectedToken}
                amountToApprove={getSelectedTokenBalance()}
                spenderAddress={getConfig().tempusControllerContract}
                disabled={approveDisabled}
                marginRight={20}
                onApproveChange={onApproveChange}
              />
            )}
            <ExecuteButton
              actionName="Mint"
              tempusPool={tempusPool}
              disabled={executeDisabled}
              onExecute={onExecute}
              onExecuted={onExecuted}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DetailMint;
