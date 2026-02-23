import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TeacherWorkloadChart = ({ workloadData }) => {
  // 1. Handle Empty State
  if (!workloadData || workloadData.length === 0) {
    return (
      <div className="p-4 rounded-xl shadow-md bg-white h-[300px] flex items-center justify-center">
        <p className="text-gray-400">No workload data available.</p>
      </div>
    );
  }

  // 2. Filter data for the Chart specifically (hide 0 values from the circle)
  const validChartData = workloadData.filter((item) => item.count > 0);

  return (
    <div className="p-6 rounded-2xl shadow-lg bg-white border border-gray-100 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4 text-gray-700">
        Teacher Workload Overview
      </h2>
      
      <div className="flex-grow">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={validChartData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={4}
              dataKey="count" // Matches backend "count"
              nameKey="title" // Matches backend "title"
            >
              {validChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  // Use the specific color sent from the backend
                  fill={entry.color} 
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [`${value}`, name]}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                padding: "10px 14px",
              }}
              itemStyle={{ color: "#374151", fontWeight: 500 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend: Shows ALL items, even if count is 0 */}
      <div className="flex justify-center gap-4 mt-6 flex-wrap">
        {workloadData.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">
                {entry.title}: <span className="font-semibold text-gray-800">{entry.count}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherWorkloadChart;