import React from 'react'
import { Outlet } from 'react-router'
import DashboardHeader from '../components/header/DashboardHeader'
import Sidebar from '../components/sidebar/Sidebar'
import Footer from '../components/footer/Footer'
import FeedbackButton from '../components/feedback/FeedbackButton'
import { useAppContext } from '../contexts/AppContext'
import FeedbackModal from '../components/feedback/FeedbackModal'

const DashboardLayout = () => {
    const { isSuperAdmin, openFeedbackModal, showModal, setShowModal } = useAppContext();

    return (
        <>
            <div className="flex h-screen w-screen bg-white p-2 sm:p-4 gap-4 overflow-hidden">

                {/* Sidebar — NO SCROLL */}
                <Sidebar />

                {/* Main Content Column */}
                <div className="flex flex-col flex-grow bg-white min-h-0 overflow-hidden">

                    {/* Header — FIXED */}
                    <DashboardHeader />

                    {/* Scrollable Content Area */}
                    <div className="flex flex-col flex-grow min-h-0 overflow-y-auto p-4 scrollbar-hide hover:scrollbar-hover">

                        {/* Page Content */}
                        <Outlet />

                        {!isSuperAdmin &&
                            <FeedbackButton />
                        }

                        {/* Footer inside scroll */}
                        <Footer />
                    </div>

                </div>
            </div>
            <FeedbackModal open={showModal} onClose={() => setShowModal(false)} />
        </>
    )
}

export default DashboardLayout
