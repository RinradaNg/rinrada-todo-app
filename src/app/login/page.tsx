"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

import {
Mail,
Lock,
Eye,
EyeOff,
Loader2
} from "lucide-react"

export default function LoginPage(){

const router = useRouter()

const [tab,setTab] = useState<"login"|"register">("login")

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [confirmPassword,setConfirmPassword] = useState("")
const [showPassword,setShowPassword] = useState(false)
const [loading,setLoading] = useState(false)

/* AUTO LOGIN */

useEffect(()=>{

const checkUser = async ()=>{

const { data } = await supabase.auth.getUser()

if(data.user){
router.push("/")
}

}

checkUser()

},[])

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

if(password !== confirmPassword){
alert("Passwords do not match")
return
}

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
setTab("login")
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

/* FORGOT PASSWORD */

const handleForgotPassword = async ()=>{

if(!email){
alert("Please enter your email first")
return
}

const { error } = await supabase.auth.resetPasswordForEmail(email,{
redirectTo:"http://localhost:3000/reset-password"
})

if(error){
alert(error.message)
return
}

alert("Password reset link sent to your email")

}

return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 p-6">

<div className="w-full max-w-xs">

{/* TITLE */}

<div className="text-center mb-6 text-white">

<h1 className="text-3xl font-bold">
Welcome 
</h1>

<p className="text-xs opacity-80 mt-1">
Sign in or create an account
</p>

</div>

{/* CARD */}

<div className="bg-white p-5 rounded-2xl shadow-xl space-y-4">

{/* TABS */}

<div className="flex bg-slate-100 rounded-lg p-1">

<button
onClick={()=>setTab("login")}
className={`flex-1 text-sm py-2 rounded-md font-semibold ${
tab === "login"
? "bg-white shadow"
: "text-slate-500"
}`}
>
Login
</button>

<button
onClick={()=>setTab("register")}
className={`flex-1 text-sm py-2 rounded-md font-semibold ${
tab === "register"
? "bg-white shadow"
: "text-slate-500"
}`}
>
Register
</button>

</div>

{/* EMAIL */}

<div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">

<Mail size={16} className="text-slate-400 mr-2"/>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="bg-transparent outline-none w-full text-sm"
/>

</div>

{/* PASSWORD */}

<div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">

<Lock size={16} className="text-slate-400 mr-2"/>

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="bg-transparent outline-none w-full text-sm"
/>

<button
onClick={()=>setShowPassword(!showPassword)}
className="text-slate-400"
>

{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}

</button>

</div>

{/* FORGOT PASSWORD */}

{tab === "login" && (

<div className="text-right -mt-2">

<button
onClick={handleForgotPassword}
className="text-xs text-indigo-600 hover:underline"
>

Forgot password?

</button>

</div>

)}

{/* CONFIRM PASSWORD */}

{tab === "register" && (

<div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">

<Lock size={16} className="text-slate-400 mr-2"/>

<input
type="password"
placeholder="Confirm password"
value={confirmPassword}
onChange={(e)=>setConfirmPassword(e.target.value)}
className="bg-transparent outline-none w-full text-sm"
/>

</div>

)}

{/* MAIN BUTTON */}

<button
onClick={tab === "login" ? handleLogin : handleRegister}
disabled={loading}
className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-700 transition flex items-center justify-center"
>

{loading
? <Loader2 className="animate-spin" size={16}/>
: tab === "login"
? "Login"
: "Create Account"}

</button>

{/* DIVIDER */}

<div className="flex items-center gap-2">

<div className="flex-1 h-[1px] bg-slate-200"/>

<span className="text-xs text-slate-400">
OR
</span>

<div className="flex-1 h-[1px] bg-slate-200"/>

</div>

{/* GOOGLE LOGIN */}

<button
onClick={handleGoogle}
className="w-full border border-slate-300 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition"
>

<img
src="https://www.svgrepo.com/show/475656/google-color.svg"
className="w-4 h-4"
/>

Continue with Google

</button>

</div>

</div>

</div>

)

}