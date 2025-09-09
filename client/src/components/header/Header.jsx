import { Menu } from 'lucide-react'
import React from 'react'

const Header = () => {
    return (
        <header className='flex h-16 bg-[#F9FAFB] p-4 rounded-2xl  border-2 border-[#E5E7EB] flex-row items-center justify-between'>
            <div className='group cursor-pointer hover:bg-[#EFF6FF] rounded-full w-9 h-9 flex items-center justify-center transition-all'>
                <Menu className='text-[#111827] h-6 w-6 group-hover:text-[#339bfd] transition-colors' />
            </div>
            <p className='text-brand-hover-bg' >jjjj</p>
        </header>
    )
}

export default Header
