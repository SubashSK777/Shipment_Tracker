import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";
import { CircularProgress } from "@mui/material";

import { useState } from "react";

const ChartComponent = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "http://127.0.0.1:5000/related_sentences"
      );
      const data = response.data;
      console.log(data);
      setData(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const category = payload[0].payload.category;
      const lines = data[category];
      return (
        <div
          style={{
            backgroundColor: "#fff",
            padding: "5px",
            border: "1px solid #ccc",
          }}
        >
          <p>
            <strong>{category}</strong>
          </p>
          {lines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Count occurrences of keywords in each category
  const keywordCounts = Object.keys(data).map((category) => ({
    category,
    count: data[category].reduce(
      (acc, text) => acc + (text.includes(category) ? 1 : 0),
      0
    ),
  }));

  return (
    (loading && (
      <div>
        <CircularProgress />
      </div>
    )) || (
      <BarChart width={600} height={300} data={keywordCounts}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" />
      </BarChart>
    )
  );
};

export default ChartComponent;
