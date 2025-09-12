import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const workloadData = [
  { name: "Lectures Delivered", value: 40 },
  { name: "Assignments Created", value: 15 },
  { name: "Quizzes Created", value: 10 },
  { name: "Pending Reviews", value: 8 },
];

// Modern palette (green = completed, yellow/blue = active tasks, red = backlog)
const COLORS = ["#10b981", "#3b82f6", "#6366f1", "#f87171"];

const TeacherWorkloadChart = () => {
  return (
    <div className="p-4 rounded-xl shadow-md bg-white">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Teacher Workload Overview
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={workloadData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={4}
            dataKey="value"
          >
            {workloadData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "10px",
              border: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 flex-wrap">
        {workloadData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            />
            <span className="text-sm text-gray-600">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherWorkloadChart;
