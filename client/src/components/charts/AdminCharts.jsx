import React, { useEffect, useState } from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend,
    Cell
} from 'recharts';
import axios from 'axios';
import { useAppContext } from '../../contexts/AppContext'; // To get backendUrl
import { format, parseISO } from 'date-fns';
import ComponentLoader from '../ComponentLoader';

const AdminCharts = () => {
    const { backendUrl } = useAppContext();
    const [newUserData, setNewUserData] = useState([]);
    const [activeUserData, setActiveUserData] = useState([]);
    const [loading, setLoading] = useState(true);
    const COLORS = [
        "#3b82f6", // Blue
        "#05b92cff", // Emerald
        "#f59e0b", // Amber
        "#ef4444", // Red
        "#8b5cf6", // Violet
        "#ec4899"  // Pink
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Call the API endpoint we discussed earlier
                const response = await axios.get(`${backendUrl}/api/super-admin/chart-data`, {
                    withCredentials: true
                });
                if (response.data.success) {
                    setNewUserData(response.data.chartData);
                    setActiveUserData(response.data.chartData.slice(-7));
                }
            } catch (error) {
                console.error("Failed to fetch chart data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [backendUrl]);

    if (loading) return <ComponentLoader />

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

            {/* CHART 1: User Growth (Area Chart) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    User Growth (Last 30 Days)
                </h2>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={newUserData}>
                            <defs>
                                <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(str) => format(parseISO(str), "MMM d")} // "Jan 4"
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                labelFormatter={(str) => format(parseISO(str), "MMM d, yyyy")}
                            />
                            <Area
                                type="monotone"
                                dataKey="registrations"
                                stroke="#3b82f6"
                                fillOpacity={1}
                                fill="url(#colorReg)"
                                name="New Users"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* CHART 2: Daily Active Users (Bar Chart) */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                    Daily Active Users (Last 7 Days)
                </h2>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={activeUserData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={(str) => format(parseISO(str), "MMM d")}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <YAxis
                                allowDecimals={false}
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 12, fill: '#6B7280' }}
                            />
                            <Tooltip
                                cursor={{ fill: '#F3F4F6' }}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                labelFormatter={(str) => format(parseISO(str), "MMM d, yyyy")}
                            />
                            {/* <Legend wrapperStyle={{ paddingTop: '10px' }} /> */}
                            <Bar
                                dataKey="activeUsers"
                                name="Active Users"
                                fill="#3b82f6"
                                radius={[4, 4, 0, 0]}
                                barSize={30}
                            >
                                {/* Loop through data and assign a color from the COLORS array */}
                                {activeUserData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default AdminCharts;