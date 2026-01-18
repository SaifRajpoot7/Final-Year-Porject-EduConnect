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



const StudentPerformanceOverTime = ({ performanceData }) => {
    // If no data is available, show a fallback message or empty state
    if (!performanceData || performanceData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center h-[400px]">
                <p className="text-gray-400">No performance data available yet.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col lg:justify-between h-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                My Performance Over Time
            </h2>

            <ResponsiveContainer width="100%" height={350}>
                <AreaChart
                    data={performanceData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                    {/* Background grid */}
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />

                    {/* X & Y Axis */}
                    {/* UPDATED: dataKey changed from "week" to "name" to match API response */}
                    <XAxis 
                        dataKey="name" 
                        tick={{ fill: "#64748b", fontSize: 12 }} 
                        axisLine={false} 
                        tickLine={false} 
                        dy={10} 
                    />
                    
                    <YAxis 
                        tick={{ fill: "#64748b", fontSize: 12 }} 
                        axisLine={false} 
                        tickLine={false} 
                        domain={[0, 100]} 
                        tickFormatter={(value) => `${value}%`} // Adds % sign to Y-axis
                        dx={-10} 
                    />

                    {/* Tooltip */}
                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#fff",
                            borderRadius: "10px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                            padding: "10px"
                        }}
                        labelStyle={{ color: "#1e293b", fontWeight: "bold", marginBottom: "5px" }}
                        formatter={(value) => [`${value}%`, "Average Score"]}
                        // Custom label to show "Week X (Date - Date)"
                        labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                                return `${label} (${payload[0].payload.dateRange})`;
                            }
                            return label;
                        }}
                    />

                    {/* Gradient effect */}
                    <defs>
                        <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                    </defs>

                    {/* Area (average performance) */}
                    <Area
                        type="monotone"
                        dataKey="performance"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        fill="url(#colorAvg)"
                        activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StudentPerformanceOverTime;