import { auth } from '@/auth'

export default async function SettingsPage() {
    const session = await auth()
    return <h1>{JSON.stringify(session)}</h1>
}
