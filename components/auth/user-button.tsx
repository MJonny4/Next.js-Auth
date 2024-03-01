'use client'

import { FaUser } from 'react-icons/fa'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { useCurrentUser } from '@/hooks/use-current-user'
import LogoutButton from './logout-button'
import { ExitIcon } from '@radix-ui/react-icons'

export default function UserButton() {
    const user = useCurrentUser()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ''} />
                    <AvatarFallback className='bg-sky-500'>
                        <FaUser className='text-white' />
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-40' align='end'>
                <LogoutButton>
                    <DropdownMenuItem className='cursor-pointer'>
                        <ExitIcon className='w-5 h-5 mr-2' />
                        Logout
                    </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
