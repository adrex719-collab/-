import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react'
import { SignInForm } from './sign-in-form'
export function AuthWrapper({ children }: { children: React.ReactNode }) { return <><AuthLoading><div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-500">در حال بررسی نشست…</div></AuthLoading><Authenticated>{children}</Authenticated><Unauthenticated><SignInForm /></Unauthenticated></> }
