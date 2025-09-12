import React, { useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";

// Dummy data (easy to map with backend)
const performanceDistribution = [
  { label: "Weak", range: "0–40%", count: 12 },
  { label: "Average", range: "41–60%", count: 25 },
  { label: "Good", range: "61–80%", count: 40 },
  { label: "Excellent", range: "81–100%", count: 18 },
];

// Base + hover colors
const COLORS = ["#f87171", "#fbbf24", "#60a5fa", "#34d399"];
const HOVER_COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];

const TeacherPerformanceDistribution = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        Overall Distribution Of Students Across All Courses
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={performanceDistribution}
          margin={{ top: 20, right: 20, left: 0, bottom: 10 }}
          barSize={60}
        >
          {/* Grid */}
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

          {/* Axes */}
          <XAxis
            dataKey="label"
            tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#64748b" }}
            axisLine={false}
            tickLine={false}
          />

          {/* Tooltip */}
          <Tooltip
            formatter={(value) => [`${value} Students`]}
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "10px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          />

          {/* Bars with hover effect */}
          <Bar
            dataKey="count"
            radius={[8, 8, 0, 0]}
            activeBar={{backgroundColor : "#11111"}}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {performanceDistribution.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  COLORS[index]
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend with ranges */}
      <div className="flex justify-center gap-6 mt-4 flex-wrap">
        {performanceDistribution.map((entry, index) => (
          <div key={index} className="flex flex-col items-center">
            <span
              className="inline-block w-4 h-4 rounded-full mb-1"
              style={{ backgroundColor: COLORS[index] }}
            ></span>
            <span className="text-sm font-medium text-gray-700">
              {entry.label}
            </span>
            <span className="text-xs text-gray-500">{entry.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherPerformanceDistribution;
