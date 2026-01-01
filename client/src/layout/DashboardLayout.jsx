// import React from 'react'
// import { Outlet } from 'react-router'
// import DashboardHeader from '../components/header/DashboardHeader'
// import Sidebar from '../components/sidebar/Sidebar'
// import Footer from '../components/footer/Footer'

// const DashboardLayout = () => {
//     return (
//         <>
//             <div className="flex flex-row h-screen w-screen bg-white p-2 sm:p-4 gap-4">
//                     {/* Sidebar content goes here */}
//                     <Sidebar />
//                     {/* <Sidebar1 /> */}
//                 <div className="flex flex-col flex-grow bg-white max-w-screen min-h-0 ">
//                     {/* Header content goes here */}
//                     <DashboardHeader />
//                     {/* Main content area */}
//                     <div className="flex  flex-col flex-grow justify-between overflow-y-auto p-4 scrollbar-hide hover:scrollbar-hover">
//                         <Outlet />
//                         <Footer />
//                     </div>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default DashboardLayout


import React from 'react'
import { Outlet } from 'react-router'
import DashboardHeader from '../components/header/DashboardHeader'
import Sidebar from '../components/sidebar/Sidebar'
import Footer from '../components/footer/Footer'

const DashboardLayout = () => {
    return (
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

                    {/* Footer inside scroll */}
                    <Footer />
                </div>

            </div>
        </div>
    )
}

export default DashboardLayout
