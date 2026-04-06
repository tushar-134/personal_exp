import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import EmptyState from "../EmptyState";
import { chartPalette } from "../../data/chartPalette";
import { formatCurrency } from "../../utils/format";

const CategoryBreakdownChart = ({
  data,
  height = 280,
  outerRadius = 105,
  emptyTitle,
  emptyDescription,
}) => {
  if (!data?.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="total"
            nameKey="category"
            innerRadius={70}
            outerRadius={outerRadius}
            paddingAngle={3}
          >
            {data.map((entry, index) => (
              <Cell key={entry.category} fill={chartPalette[index % chartPalette.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="legend-list">
        {data.map((item, index) => (
          <div key={item.category} className="legend-item">
            <span
              className="legend-dot"
              style={{ backgroundColor: chartPalette[index % chartPalette.length] }}
            />
            <span>{item.category}</span>
            <strong>{formatCurrency(item.total)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;
