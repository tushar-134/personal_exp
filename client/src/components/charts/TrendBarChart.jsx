import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { trendColors } from "../../data/chartPalette";

const TrendBarChart = ({ data, height = 280 }) => {
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="income" fill={trendColors.income} radius={[10, 10, 0, 0]} />
          <Bar dataKey="expense" fill={trendColors.expense} radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TrendBarChart;
