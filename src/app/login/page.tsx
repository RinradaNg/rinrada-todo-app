"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import {
Mail,
Lock,
Loader2,
LogIn
} from "lucide-react"

export default function LoginPage(){

const router = useRouter()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [loading,setLoading] = useState(false)
const [isRegister,setIsRegister] = useState(false)

/* LOGIN */

const handleLogin = async ()=>{

setLoading(true)

const { error } = await supabase.auth.signInWithPassword({
email,
password
})

if(error){
alert(error.message)
setLoading(false)
return
}

router.push("/")

}

/* REGISTER */

const handleRegister = async ()=>{

setLoading(true)

const { error } = await supabase.auth.signUp({
email,
password
})

if(error){
alert(error.message)
setLoading(false)
return
}

alert("Account created!")
setIsRegister(false)
setLoading(false)

}

/* GOOGLE LOGIN */

const handleGoogle = async ()=>{

await supabase.auth.signInWithOAuth({
provider:"google",
options:{
redirectTo:"http://localhost:3000/auth/callback"
}
})

}

return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500 p-6">

<div className="w-full max-w-sm">

{/* APP TITLE */}

<div className="text-center mb-8 text-white">

<h1 className="text-4xl font-black tracking-tight">
Todo
</h1>

<p className="text-xs opacity-80 mt-1 font-semibold uppercase tracking-widest">
Manage your daily tasks
</p>

</div>


{/* CARD */}

<div className="bg-white/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl space-y-5">

{/* EMAIL */}

<div className="flex items-center bg-slate-50 rounded-xl px-3 py-3 border border-slate-100">

<Mail size={18} className="text-slate-400 mr-2"/>

<input
type="email"
placeholder="Email address"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="bg-transparent outline-none w-full text-sm font-semibold"
/>

</div>


{/* PASSWORD */}

<div className="flex items-center bg-slate-50 rounded-xl px-3 py-3 border border-slate-100">

<Lock size={18} className="text-slate-400 mr-2"/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="bg-transparent outline-none w-full text-sm font-semibold"
/>

</div>


{/* LOGIN BUTTON */}

<button
onClick={isRegister ? handleRegister : handleLogin}
disabled={loading}
className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition"
>

{loading
? <Loader2 className="animate-spin" size={18}/>
: <LogIn size={18}/>
}

{isRegister ? "Create Account" : "Login"}

</button>


{/* DIVIDER */}

<div className="flex items-center gap-3">

<div className="flex-1 h-[1px] bg-slate-200"/>

<span className="text-xs text-slate-400 font-bold">
OR
</span>

<div className="flex-1 h-[1px] bg-slate-200"/>

</div>


{/* GOOGLE LOGIN */}

<button
onClick={handleGoogle}
className="w-full border border-slate-200 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition"
>

Login with Google

</button>

</div>


{/* SWITCH LOGIN / REGISTER */}

<p className="text-center text-xs text-white mt-6 font-semibold">

{isRegister ? "Already have account?" : "Don't have account?"}

<button
onClick={()=>setIsRegister(!isRegister)}
className="ml-1 underline"
>

{isRegister ? "Login" : "Register"}

</button>

</p>

</div>

</div>

)

}