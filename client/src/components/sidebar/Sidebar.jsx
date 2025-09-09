import React from 'react'
import { useAppContext } from '../../contexts/AppContext';

const Sidebar = () => {
  const { isSidebarOpen, } = useAppContext();
  return (
    <div className={`h-full ${ isSidebarOpen ? 'w-64' : 'w-20'} bg-brand-hover-default p-4 rounded-2xl shadow-xl border-2 border-gray-200 transition-all duration-300 ease-in-out`}>
        <h2 className='text-2xl font-bold text-brand-bg-primary mb-6'>Sidebar</h2>

    </div>
  )
}

export default Sidebar
