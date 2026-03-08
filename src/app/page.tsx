"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Header from "@/components/Header"

import {
Plus,
CheckCircle2,
Circle,
Trash2,
Home,
PieChart,
Settings,
Loader2,
Calendar,
Search,
Clock
} from "lucide-react"

export default function MobileAppDashboard() {

const router = useRouter()

const [user,setUser] = useState<any | null>(null)
const [loading,setLoading] = useState(true)

const [tasks,setTasks] = useState<any[]>([])
const [newTask,setNewTask] = useState("")
const [isAdding,setIsAdding] = useState(false)

const [priority,setPriority] = useState("medium")
const [dueTime,setDueTime] = useState("")

const [searchQuery,setSearchQuery] = useState("")
const [filterStatus,setFilterStatus] = useState("all")

const [selectedDate,setSelectedDate] = useState(
new Date().toISOString().split("T")[0]
)

const today = new Date().toISOString().split("T")[0]

/* CHECK USER LOGIN */

useEffect(()=>{

const checkUser = async ()=>{

const { data,error } = await supabase.auth.getUser()

if(error){
console.error(error)
}

if(!data.user){
router.push("/login")
return
}

setUser(data.user)
setLoading(false)

}

checkUser()

},[router])

/* FETCH TASKS */

const fetchTasks = useCallback(async ()=>{

if(!user) return

let query = supabase
.from("todos")
.select("*")
.eq("user_id",user.id)
.eq("due_date",selectedDate)

if(searchQuery){
query = query.ilike("title",`%${searchQuery}%`)
}

const { data,error } = await query.order("due_time",{ascending:true})

if(error){
console.error("Fetch error:",error)
return
}

if(!data) return

const filtered = data.filter((t)=>{

if(filterStatus === "completed") return t.status === "completed"
if(filterStatus === "pending") return t.status === "pending"

return true

})

setTasks(filtered)

},[user,selectedDate,searchQuery,filterStatus])

/* FETCH WHEN FILTER CHANGE */

useEffect(()=>{

fetchTasks()

},[fetchTasks])

/* REALTIME */

useEffect(()=>{

if(!user) return

const channel = supabase
.channel("todos-realtime")
.on(
"postgres_changes",
{
event:"*",
schema:"public",
table:"todos",
filter:`user_id=eq.${user.id}`
},
()=>{
fetchTasks()
}
)
.subscribe()

return ()=>{
supabase.removeChannel(channel)
}

},[user,fetchTasks])

/* ADD TASK */

const handleAddTask = async ()=>{

if(!newTask.trim() || !user) return

setIsAdding(true)

const { error } = await supabase
.from("todos")
.insert([{
user_id:user.id,
title:newTask.trim(),
status:"pending",
priority,
due_time: dueTime || null,
due_date:selectedDate
}])

if(error){
console.error("Insert error:",error)
}

setNewTask("")
setDueTime("")
setIsAdding(false)

fetchTasks()

}

/* ENTER ADD */

const handleKeyDown = (e:React.KeyboardEvent)=>{

if(e.key === "Enter"){
handleAddTask()
}

}

/* TOGGLE STATUS */

const toggleStatus = async(id:string,currentStatus:string)=>{

const nextStatus = currentStatus === "completed"
? "pending"
: "completed"

await supabase
.from("todos")
.update({status:nextStatus})
.eq("id",id)

}

/* DELETE */

const deleteTask = async(id:string)=>{

await supabase
.from("todos")
.delete()
.eq("id",id)

}

/* STATS */

const total = tasks.length

const completed = tasks.filter(
t=>t.status === "completed"
).length

const percent = total > 0
? Math.round((completed / total) * 100)
: 0

/* LOADING SCREEN */

if(loading){

return(
<div className="min-h-screen flex items-center justify-center">
<Loader2 className="animate-spin"/>
</div>
)

}

return(

<div className="min-h-screen bg-[#F8FAFC] pb-36 font-sans text-slate-900">

<Header/>

<main className="p-5 max-w-md mx-auto space-y-5">

{/* STATS */}

<div className="grid grid-cols-2 gap-3">

<div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
<p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
Total
</p>
<h3 className="text-2xl font-black text-slate-800">
{total}
</h3>
</div>

<div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-100 text-white">
<p className="text-[9px] font-bold text-blue-100 uppercase tracking-widest">
Success
</p>
<h3 className="text-2xl font-black">
{percent}%
</h3>
</div>

</div>

{/* SEARCH */}

<div className="relative flex items-center bg-white rounded-xl border border-slate-100 shadow-sm">

<Search className="text-slate-300 ml-3" size={16}/>

<input
type="text"
placeholder="ค้นหางาน..."
value={searchQuery}
onChange={(e)=>setSearchQuery(e.target.value)}
className="w-full bg-transparent outline-none p-3 text-sm font-semibold"
/>

</div>

{/* DATE */}

<div className="flex items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">

<Calendar className="text-blue-500 mr-3" size={16}/>

<input
type="date"
value={selectedDate}
onChange={(e)=>setSelectedDate(e.target.value)}
className="w-full bg-transparent outline-none text-sm font-semibold"
/>

</div>

{/* ADD TASK */}

<div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 space-y-4">

<input
type="text"
value={newTask}
onKeyDown={handleKeyDown}
onChange={(e)=>setNewTask(e.target.value)}
placeholder="เพิ่มงานใหม่..."
className="w-full p-4 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-sm font-semibold"
/>

<div className="flex items-center bg-slate-50 p-3 rounded-xl ring-1 ring-slate-100">

<Clock size={14} className="text-slate-400 mr-2"/>

<input
type="time"
value={dueTime}
onChange={(e)=>setDueTime(e.target.value)}
className="bg-transparent outline-none text-[11px] font-bold w-full"
/>

</div>

<button
disabled={isAdding}
onClick={handleAddTask}
className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-[11px] tracking-widest active:scale-95 transition flex items-center justify-center gap-2"
>

{isAdding
? <Loader2 className="animate-spin" size={18}/>
: <Plus size={18} strokeWidth={3}/>
}

ADD TASK

</button>

</div>

{/* FILTER */}

<div className="flex gap-2 overflow-x-auto pb-1">

{["all","pending","completed"].map((f)=>(
<button
key={f}
onClick={()=>setFilterStatus(f)}
className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition
${filterStatus===f
? "bg-slate-900 text-white"
: "bg-white text-slate-400 border border-slate-100"
}`}
>

{f}

</button>
))}

</div>

{/* TASK LIST */}

<div className="space-y-3">

{tasks.length === 0 && (
<div className="bg-white p-6 rounded-xl border border-slate-100 text-center">
<p className="text-xs text-slate-400 font-bold">
No tasks for this day
</p>
</div>
)}

{tasks.map((task)=>(

<div
key={task.id}
className="bg-white p-4 rounded-xl flex items-center justify-between border border-slate-100 shadow-sm"
>

<div className="flex items-center gap-3 flex-1">

<button
onClick={()=>toggleStatus(task.id,task.status)}
>

{task.status==="completed"
? <CheckCircle2 className="text-emerald-500" size={24}/>
: <Circle className="text-slate-300" size={24}/>
}

</button>

<div className="flex flex-col truncate">

<span className={`text-sm font-bold truncate
${task.status==="completed"
? "line-through text-slate-300"
: task.due_date < today
? "text-red-500"
: "text-slate-800"}
`}>

{task.title}

</span>

{task.due_time && (
<span className="text-[9px] font-bold text-slate-400 flex items-center gap-1 mt-1">
<Clock size={10}/> {task.due_time}
</span>
)}

</div>

</div>

<button
onClick={()=>deleteTask(task.id)}
className="p-2 text-slate-200 hover:text-red-400 transition"
>

<Trash2 size={18}/>

</button>

</div>

))}

</div>

</main>

<footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-12 pt-6 pb-10 flex justify-between items-center">

<button className="flex flex-col items-center text-blue-600">
<Home size={28}/>
<span className="text-[9px] font-black uppercase">
Home
</span>
</button>

<button
onClick={()=>router.push("/stats")}
className="flex flex-col items-center text-slate-300"
>
<PieChart size={26}/>
<span className="text-[9px] font-black uppercase">
Dashboard
</span>
</button>

<button className="flex flex-col items-center text-slate-300">
<Settings size={26}/>
<span className="text-[9px] font-black uppercase">
Menu
</span>
</button>

</footer>

</div>

)

}