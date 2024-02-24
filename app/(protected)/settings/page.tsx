import { auth, signOut } from '@/auth'

export default async function SettingsPage() {
    const session = await auth()

    return (
        <div>
            <h1>{JSON.stringify(session)}</h1>
            <form
                action={async () => {
                    'use server'
                    await signOut()
                }}
            >
                <button className='text-blue-500'>Sign out</button>
            </form>
        </div>
    )
}
