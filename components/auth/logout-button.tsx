'use client'

import logout from '@/actions/logout'

interface LogoutButtonProps {
    children?: React.ReactNode
}

export default function LogoutButton({ children }: LogoutButtonProps) {
    const handleLogout = () => {
        logout()
    }

    return (
        <span onClick={handleLogout} className='cursor-pointer'>
            {children}
        </span>
    )
}
