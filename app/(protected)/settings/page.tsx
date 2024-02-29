'use client'

import { settings } from '@/actions/settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useSession } from 'next-auth/react'
import { useTransition } from 'react'

export default function SettingsPage() {
    const [isPending, startTransition] = useTransition()
    const { update } = useSession()

    const handleOnClick = () => {
        startTransition(() => {
            settings({
                name: 'New Name!',
            }).then(() => {
                update()
            })
        })
    }

    return (
        <Card className='w-[600px]'>
            <CardHeader>
                <p className='text-2xl font-semibold text-center'>
                    ⚙️ Settings
                </p>
            </CardHeader>
            <CardContent>
                <Button onClick={handleOnClick} disabled={isPending}>
                    Update name
                </Button>
            </CardContent>
        </Card>
    )
}
