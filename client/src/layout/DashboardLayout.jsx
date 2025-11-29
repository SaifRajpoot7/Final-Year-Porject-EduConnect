import React from 'react'
import { Outlet } from 'react-router'
import DashboardHeader from '../components/header/DashboardHeader'
import Sidebar from '../components/sidebar/Sidebar'
import Footer from '../components/footer/Footer'

const DashboardLayout = () => {
    return (
        <>
            <div className="flex flex-row h-screen w-screen bg-white p-2 sm:p-4 gap-4">
                    {/* Sidebar content goes here */}
                    <Sidebar />
                    {/* <Sidebar1 /> */}
                <div className="flex flex-col flex-grow bg-white max-w-screen">
                    {/* Header content goes here */}
                    <DashboardHeader />
                    {/* Main content area */}
                    <div className="flex-grow overflow-y-auto p-4 scrollbar-hide hover:scrollbar-hover">
                        <Outlet />
                        <Footer />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayout
