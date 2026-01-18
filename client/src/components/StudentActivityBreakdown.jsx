// import React, { useState } from "react";
// import {
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     ResponsiveContainer,
//     Sector,
// } from "recharts";

// // Dummy data (easy to map with backend)
// const activityData = [
//     { name: "Assignments Completed", value: 18 },
//     { name: "Assignments Pending", value: 4 },
//     { name: "Deadlines Missed", value: 1 },
//     { name: "Quizzes Attempted", value: 6 },
//     { name: "Quizzes Missed", value: 2 },
// ];

// // Modern soft color palette
// const COLORS = [
//   "#10b981",
//   "#fbbf24",
//   "#dc2626",
//   "#3b82f6",
//   "#ef4444",
// ];

// // Custom active shape (expands the hovered slice)
// const renderActiveShape = (props) => {
//     const {
//         cx,
//         cy,
//         innerRadius,
//         outerRadius,
//         startAngle,
//         endAngle,
//         fill,
//     } = props;

//     return (
//         <g>
//             {/* Expanded sector */}
//             <Sector
//                 cx={cx}
//                 cy={cy}
//                 innerRadius={innerRadius}
//                 outerRadius={outerRadius + 8}
//                 startAngle={startAngle}
//                 endAngle={endAngle}
//                 fill={fill}
//             />
//         </g>
//     );
// };

// const StudentActivityBreakdown = ({activityData}) => {
//     const [activeIndex, setActiveIndex] = useState(null);

//     const onPieEnter = (_, index) => {
//         setActiveIndex(index);
//     };

//     const onPieLeave = () => {
//         setActiveIndex(null);
//     };

//     return (
//         <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
//             <h2 className="text-lg font-semibold text-gray-700 mb-4">
//                 Assignment & Quiz Status
//             </h2>

//             <ResponsiveContainer width="100%" height={320}>
//                 <PieChart>
//                     <Pie
//                         activeIndex={activeIndex}
//                         activeShape={renderActiveShape}
//                         data={activityData}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={70}
//                         outerRadius={110}
//                         paddingAngle={3}
//                         dataKey="value"
//                         onMouseEnter={onPieEnter}
//                         onMouseLeave={onPieLeave}
//                     >
//                         {activityData.map((entry, index) => (
//                             <Cell
//                                 key={`cell-${index}`}
//                                 fill={COLORS[index % COLORS.length]}
//                                 stroke="#fff"
//                                 strokeWidth={2}
//                             />
//                         ))}
//                     </Pie>

//                     {/* Tooltip */}
//                     <Tooltip
//                         formatter={(value, name) => [`${value}`, name]}
//                         contentStyle={{
//                             backgroundColor: "#fff",
//                             borderRadius: "10px",
//                             border: "1px solid #e2e8f0",
//                             boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
//                             padding: "10px 14px",
//                         }}
//                         itemStyle={{ color: "#374151", fontWeight: 500 }}
//                     />
//                 </PieChart>
//             </ResponsiveContainer>

//             {/* Custom Legend */}
//             <div className="flex justify-center gap-2 flex-wrap">
//                 {activityData.map((entry, index) => (
//                     <div key={index} className="flex items-center gap-2">
//                         <span
//                             className="inline-block w-3 h-3 rounded-full"
//                             style={{ backgroundColor: COLORS[index % COLORS.length] }}
//                         ></span>
//                         <span className="text-gray-600 text-sm">{entry.name}</span>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// };

// export default StudentActivityBreakdown;

import React, { useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Sector,
} from "recharts";

// Fallback colors
const COLORS = ["#10b981", "#fbbf24", "#dc2626", "#3b82f6", "#ef4444"];

const renderActiveShape = (props) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 8}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
};

const StudentActivityBreakdown = ({ activityData }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    // 1. FILTER FOR CHART: Only show items with value > 0 in the actual Pie circle
    // This prevents empty tooltips or rendering issues.
    const validChartData = activityData?.filter((item) => item.value > 0) || [];

    const onPieEnter = (_, index) => {
        setActiveIndex(index);
    };

    const onPieLeave = () => {
        setActiveIndex(null);
    };

    if (!activityData || activityData.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-[400px] flex items-center justify-center">
                <p className="text-gray-400">No activity data available.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col h-full">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
                Assignment & Quiz Status
            </h2>

            <div className="flex-grow">
                <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={validChartData} // <--- Use Filtered Data Here
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={110}
                            paddingAngle={3}
                            dataKey="value"
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                        >
                            {validChartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.fill || COLORS[index % COLORS.length]}
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
                                boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                                padding: "10px 14px",
                            }}
                            itemStyle={{ color: "#374151", fontWeight: 500 }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* 2. LEGEND: Use FULL activityData here to show all tabs, even if value is 0 */}
            <div className="flex justify-center gap-3 flex-wrap mt-4">
                {activityData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <span
                            className="inline-block w-3 h-3 rounded-full"
                            style={{
                                backgroundColor: entry.fill || COLORS[index % COLORS.length],
                            }}
                        ></span>
                        <span className="text-gray-600 text-sm">
                            {entry.name} : <span className="font-semibold">{entry.value}</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentActivityBreakdown;