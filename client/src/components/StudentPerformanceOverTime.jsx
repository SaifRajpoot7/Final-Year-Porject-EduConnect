import React from "react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

// Dummy data (easy to map with backend)
const performanceData = [
    { week: "Week 1", quizScore: 72, assignmentScore: 78, avgScore: 75 },
    { week: "Week 2", quizScore: 85, assignmentScore: 80, avgScore: 82 },
    { week: "Week 3", quizScore: 65, assignmentScore: 70, avgScore: 68 },
    { week: "Week 4", quizScore: 90, assignmentScore: 88, avgScore: 89 },
    { week: "Week 5", quizScore: 78, assignmentScore: 82, avgScore: 80 },
];

// Chart component
const StudentPerformanceOverTime = () => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col lg:justify-between">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                My Performance Over Time
            </h2>

            <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    {/* Background grid */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />

                    {/* X & Y Axis */}
                    <XAxis dataKey="week" tick={{ fill: "#64748b" }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fill: "#64748b" }} axisLine={false} tickLine={false} domain={[0, 100]} dx={-12} />

                    {/* Tooltip */}
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        }}
                        formatter={(value, name) => {
                            if (name === "avgScore") return [value, "Average Score"];
                            return [value, name];
                        }}
                    />

                    {/* Gradient effect */}
                    <defs>
                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="10%" stopColor="#3b82f6" stopOpacity={0.4} />
                            <stop offset="90%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    {/* Area (average performance) */}
                    <Area
                        type="monotone"
                        dataKey="avgScore"
                        stroke="#3b82f6"
                        strokeWidth={2.5}
                        fill="url(#colorAvg)"
                        dot={{ r: 4, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}

export default StudentPerformanceOverTime;