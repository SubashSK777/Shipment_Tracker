import React from "react";
import {
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

const Aspect = ({ data }) => {
  const [loading, setLoading] = React.useState(true);
  const [aspects, setAspects] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:5000/absa");
        console.log(res.data);
        setAspects(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "5px",
            border: "1px solid #ccc",
          }}
        >
          <p>{`${data.aspect} : ${data.score.toFixed(2)} (${data.label})`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      {loading ? (
        <CircularProgress />
      ) : (
        <BarChart width={700} height={300} data={aspects}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="aspect" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="score"
            fill={data.label === "Positive" ? "#FE7A36" : "#9BCF53"}
          />
        </BarChart>
      )}
    </>
  );
};

export default Aspect;
