"use server"

import { signOut } from "@/auth"

export default async function logout() {
    // Server-side code

    await signOut()
}