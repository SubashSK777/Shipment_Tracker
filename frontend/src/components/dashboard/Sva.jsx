import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CircularProgress } from "@mui/material";

const SeasonalVariationChart = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeframe, setTimeframe] = useState("now 7-d");
  const [title, setTitle] = useState("Product");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get("http://127.0.0.1:5000/sva");
        setData(result.data);
        console.log(result.data);
        setTitle(result.data["product_name"]);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleTimeframeChange = (e) => {
    setTimeframe(e.target.value);
  };

  if (loading) return <div><CircularProgress /></div>;
  if (error) return <div>Error: {error.message}</div>;

  const nowData = data["sva"] && data["sva"][timeframe];

  return (
    <div className="w-full h-full flex flex-col justify-evenly items-center">
      <h2 className="font-bold font-2xl m-2">
        Seasonal Variation Analysis of {title}
      </h2>
      <div
        className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4"
      >
        <select
          className="border-2 cursor-pointer m-2 rounded-md shadow-md border-slate-600"
          value={timeframe}
          onChange={handleTimeframeChange}
        >
          <option value="now 7-d">Past 7 Days</option>
          <option value="today 1-m">Past 1 Month</option>
          <option value="today 3-m">Past 3 Month</option>
          <option value="today 12-m">Past 1 Year</option>
          <option value="today 5-y">Past 5 Years</option>
        </select>
        <LineChart
          width={1200}
          height={400}
          data={nowData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {/* <CartesianGrid strokeDasharray="3 3" /> */}
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#8884d8"
            activeDot={{ r: 2 }}
          />
        </LineChart>
      </div>
    </div>
  );
};

export default SeasonalVariationChart;
