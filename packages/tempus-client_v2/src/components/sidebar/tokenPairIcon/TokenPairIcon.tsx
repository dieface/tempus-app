import { FC } from 'react';
import { Ticker } from '../../../interfaces/Token';
import TokenIcon from '../../tokenIcon';

import './TokenPairIcon.scss';

interface TokenPairIconProps {
  parentTicker: Ticker;
  childTicker: Ticker;
}

const TokenPairIcon: FC<TokenPairIconProps> = props => {
  const { parentTicker, childTicker } = props;

  return (
    <div className="tc__tokenPairIcon-parent">
      <TokenIcon ticker={parentTicker} width={40} height={40} />
      <div className="tf__tokenPairIcon-child">
        <TokenIcon ticker={childTicker} width={27} height={27} />
      </div>
    </div>
  );
};
export default TokenPairIcon;
