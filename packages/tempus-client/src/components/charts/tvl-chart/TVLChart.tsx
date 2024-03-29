import { FC, useEffect, useState, useCallback, useContext } from 'react';
import { AreaChart, Tooltip, Area, ResponsiveContainer } from 'recharts';

import getTVLChartDataAdapter from '../../../adapters/getTVLChartDataAdapter';
import { Context } from '../../../context';

import ChartDataPoint from '../../../interfaces/ChartDataPoint';

interface TVLChartProps {
  onSetActiveDataPoint: (activeDataPoint: ChartDataPoint) => void;
}

const TLVChart: FC<TVLChartProps> = (props): JSX.Element => {
  const { onSetActiveDataPoint } = props;

  const {
    data: { userWalletSigner },
  } = useContext(Context);

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  const onChartMouseMove = useCallback(
    (event: any) => {
      let activeDataPointIndex = chartData.length - 1;
      if (event.activeLabel) {
        activeDataPointIndex = event.activeLabel;
      }
      const activeDataPoint = chartData[activeDataPointIndex];

      onSetActiveDataPoint(activeDataPoint);
    },
    [chartData, onSetActiveDataPoint],
  );

  const onChartMouseLeave = (event: any) => {
    props.onSetActiveDataPoint(chartData[chartData.length - 1]);
  };

  useEffect(() => {
    const fetchChartData = async () => {
      const tvlChartDataAdapter = getTVLChartDataAdapter(userWalletSigner || undefined);

      const data = await tvlChartDataAdapter.generateChartData();
      setChartData(data);
    };
    fetchChartData();
  }, [userWalletSigner]);

  useEffect(() => {
    onSetActiveDataPoint(chartData[chartData.length - 1]);
  }, [chartData, onSetActiveDataPoint]);

  return (
    <ResponsiveContainer width="100%" height={275}>
      <AreaChart data={chartData} onMouseMove={onChartMouseMove} onMouseLeave={onChartMouseLeave}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#FFDF99" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#FFDF99" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* Hide default Tooltip card UI */}
        <Tooltip contentStyle={{ display: 'none' }} />
        <Area type="monotone" dataKey="value" stroke="#FFDF99" strokeWidth={3} fillOpacity={0.8} fill="url(#colorUv)" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
export default TLVChart;
