import React from 'react'
import { Outlet } from 'react-router'
import Header from '../components/header/Header'
import Sidebar from '../components/sidebar/Sidebar'
import Footer from '../components/footer/Footer'
import AllCoursesPage from '../pages/courses/AllCoursesPage'
import CompletedLecturesPage from '../pages/lectures/CompletedLecturesPage'
import AssignmentsPage from '../pages/assignment/AssignmentsPage'
import QuizzesPage from '../pages/quiz/QuizzesPage'

const DashboardLayout = () => {
    return (
        <>
            <div className="flex flex-row h-screen w-screen bg-white p-2 sm:p-4 gap-4">
                    {/* Sidebar content goes here */}
                    <Sidebar />
                    {/* <Sidebar1 /> */}
                <div className="flex flex-col flex-grow bg-white">
                    {/* Header content goes here */}
                    <Header />
                    {/* Main content area */}
                    <div className="flex-grow overflow-y-auto p-4 scrollbar-hide hover:scrollbar-hover">
                        {/* <Outlet /> */}
                        {/* <CompletedLecturesPage /> */}
                        <QuizzesPage />
                        <Footer />
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardLayout
