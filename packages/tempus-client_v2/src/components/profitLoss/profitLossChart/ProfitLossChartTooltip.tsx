import { format } from 'date-fns';
import { useMemo } from 'react';
import { TooltipProps } from 'recharts';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import NumberUtils from '../../../services/NumberUtils';
import Typography from '../../typography/Typography';
import PercentageLabel from '../../pool/percentageLabel/PercentageLabel';
import Spacer from '../../spacer/spacer';

const ProfitLossChartTooltip = (props: TooltipProps<ValueType, NameType>) => {
  const { active, payload } = props;

  const valueFormatted = useMemo(() => {
    if (active && payload && payload[0]) {
      return NumberUtils.formatToCurrency(payload[0].payload.value.toString(), 2, '$');
    }
  }, [active, payload]);

  const valueIncreaseFormatted = useMemo(() => {
    if (active && payload && payload[0]) {
      return payload[0].payload.valueIncrease;
    }
  }, [active, payload]);

  const dateFormatted = useMemo(() => {
    if (active && payload && payload[0]) {
      return format(payload[0].payload.date, 'd MMM yyyy');
    }
  }, [active, payload]);

  return (
    <div className="tc__profitLossChartTooltip">
      <Typography variant="h4">{valueFormatted}</Typography>
      <Spacer size={6} />
      <PercentageLabel percentage={valueIncreaseFormatted} />
      <Spacer size={6} />
      <Typography variant="body-text" color="title">
        {dateFormatted}
      </Typography>
    </div>
  );
};
export default ProfitLossChartTooltip;
