"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function ProfilePage(){

const router = useRouter()

const [user,setUser] = useState<any>(null)
const [name,setName] = useState("")
const [avatar,setAvatar] = useState("")
const [password,setPassword] = useState("")
const [loading,setLoading] = useState(false)

useEffect(()=>{

const loadUser = async ()=>{

const { data:{ user } } = await supabase.auth.getUser()

if(!user){
router.push("/login")
return
}

setUser(user)

const { data } = await supabase
.from("profiles")
.select("*")
.eq("id",user.id)
.single()

if(data){
setName(data.name || "")
setAvatar(data.avatar_url || "")
}

}

loadUser()

},[])



const updateProfile = async ()=>{

if(!user) return

setLoading(true)

await supabase
.from("profiles")
.upsert({
id:user.id,
name:name,
avatar_url:avatar
})

setLoading(false)

alert("บันทึกโปรไฟล์เรียบร้อย")

}



const updatePassword = async ()=>{

if(!password) return

const { error } = await supabase.auth.updateUser({
password:password
})

if(error){
alert(error.message)
}else{
alert("เปลี่ยนรหัสผ่านสำเร็จ")
setPassword("")
}

}



const uploadAvatar = async (e:any)=>{

const file = e.target.files[0]

if(!file || !user) return

const fileName = `${user.id}-${Date.now()}`

const { error } = await supabase.storage
.from("avatars")
.upload(fileName,file)

if(error){
alert(error.message)
return
}

const { data } = supabase.storage
.from("avatars")
.getPublicUrl(fileName)

setAvatar(data.publicUrl)

}



return(

<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">

<div className="bg-white w-[420px] rounded-2xl shadow-xl p-8 space-y-6">

<h1 className="text-2xl font-bold text-center">
โปรไฟล์ผู้ใช้
</h1>


{/* AVATAR */}

<div className="flex flex-col items-center gap-3">

<label className="cursor-pointer group">

{avatar ? (
<img
src={avatar}
className="w-28 h-28 rounded-full object-cover border-4 border-white shadow group-hover:opacity-80 transition"
/>
) : (
<div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-sm shadow">
No Image
</div>
)}

<input
type="file"
accept="image/*"
onChange={uploadAvatar}
className="hidden"
/>

</label>

<p className="text-xs text-gray-400">
คลิกที่รูปเพื่อเปลี่ยน
</p>

</div>



{/* NAME */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-600">
ชื่อในแอป
</label>

<input
value={name}
onChange={(e)=>setName(e.target.value)}
className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
/>

</div>



{/* EMAIL */}

<div className="space-y-1">

<label className="text-sm font-medium text-gray-600">
Email
</label>

<input
value={user?.email || ""}
disabled
className="w-full border rounded-lg p-2.5 bg-gray-100 text-gray-500"
/>

</div>



{/* PASSWORD */}

<div className="space-y-2">

<label className="text-sm font-medium text-gray-600">
เปลี่ยนรหัสผ่าน
</label>

<input
type="password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
placeholder="รหัสผ่านใหม่"
className="w-full border rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-400"
/>

<button
onClick={updatePassword}
className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2.5 rounded-lg transition"
>
เปลี่ยนรหัสผ่าน
</button>

</div>



{/* SAVE PROFILE */}

<button
onClick={updateProfile}
disabled={loading}
className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition"
>
{loading ? "กำลังบันทึก..." : "บันทึกโปรไฟล์"}
</button>



<button
onClick={()=>router.push("/") }
className="w-full text-gray-500 hover:text-gray-700 text-sm"
>
← กลับหน้า Home
</button>

</div>

</div>

)

}