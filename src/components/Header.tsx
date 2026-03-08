'use client'

import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'
import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'

export default function Header() {

const router = useRouter()

const [notifications,setNotifications] = useState<any[]>([])
const [open,setOpen] = useState(false)
const [menuOpen,setMenuOpen] = useState(false)
const [user,setUser] = useState<any>(null)

const dropdownRef = useRef<HTMLDivElement>(null)
const menuRef = useRef<HTMLDivElement>(null)


/* GET USER */

useEffect(()=>{

const getUser = async()=>{

const { data } = await supabase.auth.getUser()

if(data.user){
setUser(data.user)
}

}

getUser()

},[])



/* FETCH NOTIFICATIONS */

const fetchNotifications = async () => {

const { data, error } = await supabase
.from("notifications")
.select("*")
.order("created_at",{ascending:false})

if(error){
console.log(error)
return
}

if(data){
setNotifications(data)
}

}



/* MARK AS READ */

const markRead = async (id:any) => {

await supabase
.from("notifications")
.update({is_read:true})
.eq("id",id)

fetchNotifications()

}



/* DELETE */

const deleteNotification = async (id:any) => {

await supabase
.from("notifications")
.delete()
.eq("id",id)

fetchNotifications()

}



/* LOGOUT */

const handleLogout = async () => {

await supabase.auth.signOut()

router.push("/login")

}



/* REALTIME */

useEffect(()=>{

fetchNotifications()

const channel = supabase
.channel("notification-realtime")
.on(
"postgres_changes",
{event:"*",schema:"public",table:"notifications"},
()=>{
fetchNotifications()
}
)
.subscribe()

return ()=>{
supabase.removeChannel(channel)
}

},[])



/* CLICK OUTSIDE */

useEffect(()=>{

function handleClickOutside(event:any){

if(
dropdownRef.current &&
!dropdownRef.current.contains(event.target)
){
setOpen(false)
}

if(
menuRef.current &&
!menuRef.current.contains(event.target)
){
setMenuOpen(false)
}

}

document.addEventListener("mousedown",handleClickOutside)

return ()=>{
document.removeEventListener("mousedown",handleClickOutside)
}

},[])



const unreadCount = notifications.filter(n=>!n.is_read).length



return (

<nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100 px-6 pt-14 pb-5 flex justify-between items-center">

{/* LEFT */}

<div>

<h1 className="text-xl font-black tracking-tight text-slate-800">
To-Do List
</h1>

<p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mt-0.5">
Vanness Plus
</p>

</div>



{/* RIGHT */}

<div className="flex items-center gap-3 relative">

{/* BELL */}

<div ref={dropdownRef}>

<button
onClick={()=>setOpen(!open)}
className="relative w-10 h-10 rounded-2xl flex items-center justify-center bg-slate-100 active:scale-95 transition"
>

<Bell size={18}/>

{unreadCount > 0 && (

<span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-[1px] rounded-full">
{unreadCount}
</span>

)}

</button>



{/* NOTIFICATION DROPDOWN */}

{open && (

<div className="absolute right-0 top-14 w-80 bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden">

<div className="px-4 py-3 border-b border-slate-100">

<p className="text-xs font-black text-slate-400 uppercase">
Notifications
</p>

</div>


{notifications.length === 0 && (

<div className="p-6 text-center text-xs text-slate-400">
No notifications
</div>

)}


{notifications.map((n)=>{

return(

<div
key={n.id}
className="flex items-start justify-between px-4 py-3 border-b border-slate-100 hover:bg-slate-50"
>

<div
className="flex-1 cursor-pointer"
onClick={()=>markRead(n.id)}
>

<p className="text-sm font-semibold text-slate-800">
{n.title}
</p>

<p className="text-xs text-slate-400 mt-1">
{n.message}
</p>

</div>


{!n.is_read ? (

<span className="w-2.5 h-2.5 bg-slate-900 rounded-full mt-1"/>

) : (

<button
onClick={()=>deleteNotification(n.id)}
className="text-slate-400 hover:text-slate-600 text-xs"
>
✕
</button>

)}

</div>

)

})}

</div>

)}

</div>



{/* PROFILE */}

<div ref={menuRef} className="relative">

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-[11px] active:scale-95 transition"
>

{user?.email?.charAt(0).toUpperCase() || "U"}

</button>



{/* PROFILE DROPDOWN */}

{menuOpen && (

<div className="absolute right-0 top-14 w-44 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden">

<button
onClick={()=>router.push("/profile")}
className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50"
>
Edit Profile
</button>

<button
onClick={handleLogout}
className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-slate-50"
>
Logout
</button>

</div>

)}

</div>


</div>

</nav>

)

}