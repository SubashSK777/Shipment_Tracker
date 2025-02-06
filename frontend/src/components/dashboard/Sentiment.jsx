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
import { CircularProgress } from "@mui/material";
import axios from "axios";

const Sentiment = ({ data }) => {
  const [loading, setLoading] = React.useState(true);
  const [sentimentData, setSentimentData] = React.useState([]);

  React.useEffect(() => {
    // if (res.data) {
    //   const sentimentData = [
    //     {
    //       name: "Negative",
    //       value: parseFloat(res.data.negative.toFixed(4)),
    //     },
    //     {
    //       name: "Neutral",
    //       value: parseFloat(res.data.neutral.toFixed(4)),
    //     },
    //     {
    //       name: "Positive",
    //       value: parseFloat(res.data.positive.toFixed(4)),
    //     },
    //   ];
    //   setSentimentData(sentimentData);
    //   setLoading(false);
    // }
    const fetchData = async () => {
      await axios
        .get("http://127.0.0.1:5000/sentiment")
        .then((res) => {
          console.log(res.data);
            const sentimentData = [
              {
                name: "Negative",
                value: parseFloat(res.data.negative.toFixed(4)),
              },
              {
                name: "Neutral",
                value: parseFloat(res.data.neutral.toFixed(4)),
              },
              {
                name: "Positive",
                value: parseFloat(res.data.positive.toFixed(4)),
              },
            ];
            setSentimentData(sentimentData);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchData();
  }, [data]);
  // const sentimentData = [
  //     { name: 'Negative', value: parseFloat(res.data.negative.toFixed(4)) },
  //     { name: 'Neutral', value: parseFloat(res.data.neutral.toFixed(4)) },
  //     { name: 'Positive', value: parseFloat(res.data.positive.toFixed(4)) }
  // ];

  const colors = ["#FF5733", "#3498DB", "#58D68D"];

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <PieChart width={450} height={250}>
          <Pie
            data={sentimentData}
            cx={210}
            cy={100}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            label={({ name, value }) => `${name}: ${(value * 100).toFixed(2)}%`}
          >
            {sentimentData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      )}
    </>
  );
};

export default Sentiment;
