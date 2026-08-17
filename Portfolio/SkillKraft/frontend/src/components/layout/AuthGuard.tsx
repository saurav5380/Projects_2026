"use client"

// Purpose: reads access token via `auth.ts`. Redirects to `/login` if absent; renders children if present.

import * as authHelpers from '@/lib/auth';
import { redirect }  from 'next/navigation';

const AuthGuard = ({children}: {children: React.ReactNode}) => {
    const token = authHelpers.getAccessToken();
    if (!token){
        redirect("/login");
    }
    return (
        <>
        {children}
        </>
    )
}


export default AuthGuard;

