import React, { useEffect, useState } from "react";
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

export default function Graph() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/journal_agg?period=week")
      .then((res) => res.json())
      .then((data) => {
        // Filter out empty/null entries to prevent chart gaps
        const filtered = data.filter(
          (d) => d.avg_emotion !== null && d.avg_stress !== null
        );
        setData(filtered);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-8 bg-[#0b1220] text-white min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-semibold mb-6">🧠 Mood & Stress Trends</h1>

      {data.length === 0 ? (
        <p className="text-gray-400 mt-20">
          No data yet. Try chatting with Mindwave to start your trend.
        </p>
      ) : (
        <ResponsiveContainer width="95%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#222" />
            <XAxis
              dataKey="date"
              stroke="#ccc"
              tick={{ fill: "#aaa", fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              stroke="#66ccff"
              domain={[-2, 2]}
              label={{
                value: "Mood",
                angle: -90,
                position: "insideLeft",
                fill: "#66ccff",
                fontSize: 12,
              }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="#ff6666"
              domain={[0, 1]}
              label={{
                value: "Stress",
                angle: 90,
                position: "insideRight",
                fill: "#ff6666",
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a2234",
                border: "1px solid #333",
                color: "#fff",
              }}
            />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="avg_emotion"
              stroke="#00bcd4"
              name="Mood"
              strokeWidth={2.5}
              dot={true}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="avg_stress"
              stroke="#ef4444"
              name="Stress"
              strokeWidth={2.5}
              dot={true}
              activeDot={{ r: 6 }}
              animationDuration={800}
            />
          </LineChart>
        </ResponsiveContainer>
      )}

      <p className="mt-6 text-slate-400 text-sm text-center max-w-lg">
        Higher mood → positive emotional state.  
        Higher stress → mental strain. Keep chatting and journaling daily to see your growth.
      </p>
    </div>
  );
}
