"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"

export default function LoginPage() {

const router = useRouter()

const [tab, setTab] = useState<"login" | "register">("login")

const [email, setEmail] = useState("")
const [password, setPassword] = useState("")
const [confirmPassword, setConfirmPassword] = useState("")

const [showPassword, setShowPassword] = useState(false)
const [loading, setLoading] = useState(false)

/* AUTO LOGIN */

useEffect(() => {

const checkUser = async () => {

const { data } = await supabase.auth.getUser()

if (data.user) {
router.push("/")
}

}

checkUser()

}, [router])

/* LOGIN */

const handleLogin = async () => {

if (!email || !password) {
alert("Please enter email and password")
return
}

setLoading(true)

const { error } = await supabase.auth.signInWithPassword({
email,
password
})

if (error) {
alert("Invalid email or password")
setLoading(false)
return
}

setLoading(false)

router.push("/")

}

/* REGISTER */

const handleRegister = async () => {

if (!email || !password) {
alert("Please fill all fields")
return
}

if (password !== confirmPassword) {
alert("Passwords do not match")
return
}

setLoading(true)

const { error } = await supabase.auth.signUp({
email,
password
})

if (error) {
alert(error.message)
setLoading(false)
return
}

alert("Account created! Please login.")

setTab("login")
setPassword("")
setConfirmPassword("")
setLoading(false)

}

return (

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-800 to-purple-800 p-6">

<div className="w-full max-w-xs">

<div className="text-center mb-6 text-white">

<h1 className="text-3xl font-bold">
To-Do List App
</h1>

<p className="text-sm text-white/90 mt-1">
Login or create an account
</p>

</div>

<div className="bg-white p-6 rounded-2xl shadow-2xl space-y-4">

{/* TABS */}

<div className="flex bg-gray-200 rounded-lg p-1">

<button
onClick={() => setTab("login")}
className={`flex-1 text-sm py-2 rounded-md font-semibold ${
tab === "login"
? "bg-white shadow text-black"
: "text-gray-600"
}`}
>
Login
</button>

<button
onClick={() => setTab("register")}
className={`flex-1 text-sm py-2 rounded-md font-semibold ${
tab === "register"
? "bg-white shadow text-black"
: "text-gray-600"
}`}
>
Register
</button>

</div>

{/* EMAIL */}

<div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">

<Mail size={16} className="text-gray-600 mr-2" />

<input
type="email"
placeholder="Email"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="bg-transparent outline-none w-full text-sm text-gray-900"
/>

</div>

{/* PASSWORD */}

<div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">

<Lock size={16} className="text-gray-600 mr-2" />

<input
type={showPassword ? "text" : "password"}
placeholder="Password"
value={password}
onChange={(e) => setPassword(e.target.value)}
className="bg-transparent outline-none w-full text-sm text-gray-900"
/>

<button
onClick={() => setShowPassword(!showPassword)}
className="text-gray-600"
>

{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}

</button>

</div>

{/* CONFIRM PASSWORD */}

{tab === "register" && (

<div className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-3 py-2">

<Lock size={16} className="text-gray-600 mr-2" />

<input
type="password"
placeholder="Confirm password"
value={confirmPassword}
onChange={(e) => setConfirmPassword(e.target.value)}
className="bg-transparent outline-none w-full text-sm text-gray-900"
/>

</div>

)}

{/* BUTTON */}

<button
onClick={tab === "login" ? handleLogin : handleRegister}
disabled={loading}
className="w-full bg-indigo-700 text-white py-2.5 rounded-lg font-semibold text-sm hover:bg-indigo-800 transition flex items-center justify-center"
>

{loading
? <Loader2 className="animate-spin" size={16} />
: tab === "login"
? "Login"
: "Create Account"}

</button>

</div>

</div>

</div>

)

}