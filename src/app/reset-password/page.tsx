"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ResetPassword(){

const [password,setPassword] = useState("")

const updatePassword = async ()=>{

const { error } = await supabase.auth.updateUser({
password
})

if(error){
alert(error.message)
return
}

alert("Password updated!")
}

return(

<div className="min-h-screen flex items-center justify-center">

<div className="bg-white p-6 rounded-xl shadow">

<h1 className="text-lg font-bold mb-4">
Set new password
</h1>

<input
type="password"
placeholder="New password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="border p-2 w-full mb-4"
/>

<button
onClick={updatePassword}
className="bg-indigo-600 text-white px-4 py-2 rounded"
>

Update Password

</button>

</div>

</div>

)
}