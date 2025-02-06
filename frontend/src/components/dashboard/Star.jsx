import React from "react";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Star = ({ data }) => {
  // Calculate frequency of each star rating
  const starNCounts = data.reviews.reduce((acc, review) => {
    const star = review.star;
    acc[star] = (acc[star] || 0) + 1;
    return acc;
  }, {});

  // Convert frequency object to array of objects for Recharts
  const starNData = Object.keys(starNCounts).map((star) => ({
    star: parseFloat(star),
    count: starNCounts[star],
  }));

  const ncolors = ["#FF5733", "#3498DB", "#58D68D", "#F4D03F", "#9B59B6"];

  return (
    <PieChart width={450} height={250}>
      <Pie
        data={starNData}
        cx={220}
        cy={100}
        innerRadius={0}
        outerRadius={90}
        fill="#8884d8"
        paddingAngle={2}
        dataKey="count"
        label={({
          cx,
          cy,
          midAngle,
          innerRadius,
          outerRadius,
          percent,
          index,
        }) => {
          const radius = innerRadius + (outerRadius - innerRadius) * 0.75;
          const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
          const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

          return (
            <text
              x={x}
              y={y}
              fill="white"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {starNData[index].star} stars
            </text>
          );
        }}
      >
        {starNData.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={ncolors[index % ncolors.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default Star;
