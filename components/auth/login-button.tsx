'use client'

import { useRouter } from 'next/navigation'

type LoginButtonsProps = {
    children: React.ReactNode
    mode?: 'modal' | 'redirect'
    asChild?: boolean
}

export const LoginButtons = ({
    children,
    mode = 'modal',
    asChild = false,
}: LoginButtonsProps) => {
    const router = useRouter()

    const onClick = () => {
        router.push('/auth/login')
    }

    if (mode === 'modal') {
        return (
            <div className='flex flex-col space-y-4'>
                <span onClick={onClick} className='cursor-pointer'>
                    {children}
                </span>
                <span onClick={onClick} className='cursor-pointer'>
                    {children}
                </span>
            </div>
        )
    }

    return (
        <span onClick={onClick} className='cursor-pointer'>
            {children}
        </span>
    )
}
