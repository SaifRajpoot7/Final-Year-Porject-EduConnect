import React from 'react'
import { Outlet } from 'react-router'
import Sidebar from '../components/sidebar/Sidebar'
import Header from '../components/header/Header'

const DashboardLayout = () => {
    return (
        <>
            <div className="flex flex-row h-screen w-screen bg-white p-2 sm:p-4 gap-4">
                    {/* Sidebar content goes here */}
                    <Sidebar />
                <div className="flex flex-col flex-grow bg-white">
                    {/* Header content goes here */}
                    <Header />
                    {/* Main content area */}
                    <div className="flex-grow overflow-y-auto p-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayout
