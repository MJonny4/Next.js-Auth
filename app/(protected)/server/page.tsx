import { auth } from '@/auth'

export default async function ServerPage() {
    const session = await auth()
    return <div>{JSON.stringify(session)}</div>
}
