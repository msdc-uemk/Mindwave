// src/components/MoodGraph.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function MoodGraph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/journal_agg?period=week").then((res) => {
      // Filter out days that have no data (nulls)
      const filtered = res.data.filter(
        (d) => d.avg_emotion !== null && d.avg_stress !== null
      );
      setData(filtered);
    });
  }, []);

  return (
    <div className="w-full p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Mood & Stress Trend 🌤️
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500 text-sm">No data yet. Try chatting today!</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              yAxisId="left"
              label={{
                value: "Emotion",
                angle: -90,
                position: "insideLeft",
              }}
              domain={[-2, 2]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Stress",
                angle: 90,
                position: "insideRight",
              }}
              domain={[0, 1]}
            />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avg_emotion"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={true}
              name="Avg Emotion"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avg_stress"
              stroke="#EF4444"
              strokeWidth={2.5}
              dot={true}
              name="Avg Stress"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
