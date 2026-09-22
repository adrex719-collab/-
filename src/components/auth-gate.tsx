import { useAuthActions } from "@convex-dev/auth/react"
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { useState } from "react"

export function AuthGate({ children }: { children: React.ReactNode }) {
  return <><AuthLoading><div dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-50">در حال بررسی نشست کاربر…</div></AuthLoading><Authenticated>{children}</Authenticated><Unauthenticated><SignIn /></Unauthenticated></>
}
function SignIn(){
 const {signIn}=useAuthActions(); const [mode,setMode]=useState<"signIn"|"signUp">("signIn"); const [busy,setBusy]=useState(false); const [error,setError]=useState("")
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");const data=new FormData(e.currentTarget);data.set("flow",mode);try{await signIn("password",data)}catch(err){setError(err instanceof Error?err.message:"عملیات احراز هویت انجام نشد.")}finally{setBusy(false)}}
 return <main dir="rtl" className="flex min-h-screen items-center justify-center bg-slate-50 p-5"><div className="w-full max-w-md rounded-3xl border bg-white p-7 shadow-sm"><div className="mb-7"><div className="text-2xl font-bold">ایمن بندر</div><div className="mt-2 text-sm text-slate-500">ورود به پلتفرم HSE</div></div><form onSubmit={submit} className="space-y-4"><input name="email" type="email" required placeholder="ایمیل" className="w-full rounded-xl border px-3 py-3"/><input name="password" type="password" minLength={8} required placeholder="رمز عبور" className="w-full rounded-xl border px-3 py-3"/>{error&&<div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}<button disabled={busy} className="w-full rounded-xl bg-slate-950 px-4 py-3 text-white disabled:opacity-40">{busy?"در حال پردازش…":mode==="signIn"?"ورود":"ثبت‌نام"}</button></form><button onClick={()=>setMode(mode==="signIn"?"signUp":"signIn")} className="mt-4 w-full text-sm text-slate-500">{mode==="signIn"?"حساب ندارید؟ ثبت‌نام":"حساب دارید؟ ورود"}</button></div></main>
}
