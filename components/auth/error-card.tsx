import { Header } from '@/components/auth/header'
import { BackButton } from '@/components/auth/back-button'
import { Card, CardHeader, CardFooter } from '@/components/ui/card'

export default function ErrorCard() {
    return (
        <Card className='w-[400px] shadow-md'>
            <CardHeader>
                <Header label='Something went wrong' />
            </CardHeader>
            <CardFooter>
                <BackButton
                    label='Go back to the previous page'
                    href='/auth/login'
                />
            </CardFooter>
        </Card>
    )
}
