import { CircularProgress } from '@material-ui/core';
import { ethers, BigNumber } from 'ethers';
import { useContext, useMemo } from 'react';
import { Context, ContextPoolData, getDataForPool } from '../../../context';
import { Ticker } from '../../../interfaces';
import NumberUtils from '../../../services/NumberUtils';
import Typography from '../../typography/Typography';

const TVLFormatter = ({ row }: any) => {
  const isChild = Boolean(row.parentId);

  const {
    data: { poolData },
  } = useContext(Context);

  const tvlFormatted = useMemo(() => {
    let tvl: BigNumber | null;
    if (!isChild) {
      tvl = getParentTVL(row.id, poolData);
    } else {
      tvl = getChildTVL(row.id, poolData);
    }

    if (!tvl) {
      return null;
    }
    return NumberUtils.formatWithMultiplier(ethers.utils.formatEther(tvl));
  }, [isChild, poolData, row.id]);

  return (
    <>
      {tvlFormatted && (
        <Typography color="default" variant="body-text">
          ${tvlFormatted}
        </Typography>
      )}
      {!tvlFormatted && <CircularProgress size={16} />}
    </>
  );
};
export default TVLFormatter;

function getParentTVL(parentId: Ticker, poolData: ContextPoolData[]): BigNumber | null {
  const parentChildren = poolData.filter(data => {
    return data.backingTokenTicker === parentId;
  });

  // In case TVL is still loading for some of the parent children, return null (show loading circle in dashboard)
  const childrenStillLoading = parentChildren.some(child => child.tvl === null);
  if (childrenStillLoading) {
    return null;
  }

  let parentTVL = BigNumber.from('0');
  parentChildren.forEach(child => {
    parentTVL = parentTVL.add(child.tvl || BigNumber.from('0'));
  });

  return parentTVL;
}

function getChildTVL(childId: string, poolData: ContextPoolData[]): BigNumber | null {
  return getDataForPool(childId, poolData).tvl;
}
