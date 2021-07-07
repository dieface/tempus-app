import { AreaChart, Tooltip, Area, ResponsiveContainer } from 'recharts';

import { generateChartData } from '../../../util/data-generator';

function TLVChart(): JSX.Element {
  // Dummy data - TODO - Replace with real date from contract
  const data = generateChartData(60);

  return (
    <ResponsiveContainer width="100%" height={275}>
      <AreaChart data={data}>
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
}
export default TLVChart;