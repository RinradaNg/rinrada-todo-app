"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"

import {
ChevronLeft,
ChevronRight,
Calendar as CalendarIcon,
Clock,
Home,
PieChart,
Settings,
Star,
Loader2
} from "lucide-react"

export default function DashboardPage(){

const router = useRouter()

const [user,setUser] = useState<any | null>(null)
const [loading,setLoading] = useState(true)

const [allTasks,setAllTasks] = useState<any[]>([])
const [viewDate,setViewDate] = useState(new Date())

const [activeDay,setActiveDay] = useState(
new Date().toISOString().split("T")[0]
)

const [selectedDayTasks,setSelectedDayTasks] = useState<any[]>([])

const [search,setSearch] = useState("")
const [filterStatus,setFilterStatus] = useState("all")

const dateInputRef = useRef<HTMLInputElement>(null)

const today = new Date().toISOString().split("T")[0]

/* CHECK USER LOGIN */

useEffect(()=>{

const checkUser = async ()=>{

const {data,error} = await supabase.auth.getUser()

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

const fetchAllTasks = useCallback(async ()=>{

if(!user) return

let query = supabase
.from("todos")
.select("*")
.eq("user_id",user.id)

if(filterStatus !== "all"){
query = query.eq("status",filterStatus)
}

const {data,error} = await query.order("due_time",{ascending:true})

if(error){
console.error("Fetch error:",error)
return
}

if(!data) return

setAllTasks(data)

const tasks = data
.filter(t=>t.due_date === activeDay)
.filter(t=>t.title.toLowerCase().includes(search.toLowerCase()))

setSelectedDayTasks(tasks)

},[user,activeDay,search,filterStatus])



/* FETCH WHEN FILTER CHANGE */

useEffect(()=>{

fetchAllTasks()

},[fetchAllTasks])



/* REALTIME */

useEffect(()=>{

if(!user) return

const channel = supabase
.channel("todos-dashboard")
.on(
"postgres_changes",
{
event:"*",
schema:"public",
table:"todos",
filter:`user_id=eq.${user.id}`
},
()=>{
fetchAllTasks()
}
)
.subscribe()

return ()=>{

supabase.removeChannel(channel)

}

},[user,fetchAllTasks])



/* TOGGLE STATUS */

const toggleTaskStatus = async(task:any)=>{

const newStatus =
task.status === "completed"
? "pending"
: "completed"

const {error} = await supabase
.from("todos")
.update({status:newStatus})
.eq("id",task.id)

if(error){
console.error("Update error:",error)
}

}



/* CHANGE MONTH */

const changeMonth = (offset:number)=>{

const newDate = new Date(viewDate)

newDate.setMonth(newDate.getMonth()+offset)

setViewDate(newDate)

}



/* CLICK DAY */

const handleDayClick = (day:number)=>{

const dateStr =
`${viewDate.getFullYear()}-${String(viewDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`

setActiveDay(dateStr)

}



/* DATE PICKER */

const handleDatePicker = (e:any)=>{

const selected = new Date(e.target.value)

setViewDate(selected)
setActiveDay(e.target.value)

}



/* CALENDAR */

const daysInMonth =
new Date(viewDate.getFullYear(),viewDate.getMonth()+1,0).getDate()

const firstDayOfMonth =
new Date(viewDate.getFullYear(),viewDate.getMonth(),1).getDay()



/* DASHBOARD STATS */

const totalTasks = allTasks.length

const completedTasks =
allTasks.filter(t=>t.status==="completed").length

const pendingTasks =
allTasks.filter(t=>t.status==="pending").length

const overdueTasks =
allTasks.filter(t=>t.status!=="completed" && t.due_date < today).length



/* DAILY PROGRESS */

const todayCompleted =
selectedDayTasks.filter(t=>t.status==="completed").length

const progress =
selectedDayTasks.length===0
?0
:Math.round((todayCompleted/selectedDayTasks.length)*100)



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

<main className="p-6 space-y-8">



{/* DASHBOARD STATS */}

<section className="grid grid-cols-2 gap-4">

<div className="bg-white p-5 rounded-3xl border border-slate-100">
<p className="text-[10px] font-black text-slate-400 uppercase">
Total
</p>
<h3 className="text-2xl font-black">
{totalTasks}
</h3>
</div>

<div className="bg-white p-5 rounded-3xl border border-slate-100">
<p className="text-[10px] font-black text-emerald-500 uppercase">
Completed
</p>
<h3 className="text-2xl font-black">
{completedTasks}
</h3>
</div>

<div className="bg-white p-5 rounded-3xl border border-slate-100">
<p className="text-[10px] font-black text-amber-500 uppercase">
Pending
</p>
<h3 className="text-2xl font-black">
{pendingTasks}
</h3>
</div>

<div className="bg-white p-5 rounded-3xl border border-slate-100">
<p className="text-[10px] font-black text-red-500 uppercase">
Overdue
</p>
<h3 className="text-2xl font-black">
{overdueTasks}
</h3>
</div>

</section>



{/* PROGRESS */}

<section className="bg-white p-6 rounded-[2rem] border border-slate-100">

<div className="flex justify-between mb-3">

<span className="text-xs font-black text-slate-400 uppercase">
Daily Progress
</span>

<span className="text-xs font-black text-blue-600">
{progress}%
</span>

</div>

<div className="w-full h-3 bg-slate-100 rounded-full">

<div
className="h-full bg-blue-600 rounded-full"
style={{width:`${progress}%`}}
/>

</div>

</section>

{/* (ส่วน Calendar และ Task list ของคุณสามารถใช้ต่อได้เหมือนเดิม) */}

</main>



<footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-12 pt-6 pb-10 flex justify-between items-center">

<button
onClick={()=>router.push('/')}
className="flex flex-col items-center text-slate-300"
>

<Home size={26}/>

<span className="text-[9px] font-black uppercase">
Home
</span>

</button>

<button className="flex flex-col items-center text-blue-600">

<PieChart size={28}/>

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