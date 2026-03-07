"use client"

import React, { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'

import {
ChevronLeft,
ChevronRight,
Calendar as CalendarIcon,
Clock,
Home,
PieChart,
Settings,
User,
Star
} from 'lucide-react'

export default function DashboardPage(){

const router = useRouter()

const [allTasks,setAllTasks] = useState<any[]>([])
const [viewDate,setViewDate] = useState(new Date())

const [activeDay,setActiveDay] = useState(
new Date().toISOString().split("T")[0]
)

const [selectedDayTasks,setSelectedDayTasks] = useState<any[]>([])

const [search,setSearch] = useState("")
const [filterCategory,setFilterCategory] = useState("all")
const [filterStatus,setFilterStatus] = useState("all")

const dateInputRef = useRef<HTMLInputElement>(null)

const today = new Date().toISOString().split("T")[0]

/* FETCH TASKS */

const fetchAllTasks = async ()=>{

let query = supabase
.from("todos")
.select("*")

if(filterCategory !== "all"){
query = query.eq("category",filterCategory)
}

if(filterStatus !== "all"){
query = query.eq("status",filterStatus)
}

const {data,error} = await query.order("due_time",{ascending:true})

if(error){
console.log("Fetch error:",error)
return
}

if(data){

setAllTasks(data)

const tasks = data
.filter(t=>t.due_date === activeDay)
.filter(t=>t.title.toLowerCase().includes(search.toLowerCase()))

setSelectedDayTasks(tasks)

}

}

/* REALTIME SUBSCRIPTION */

useEffect(()=>{

fetchAllTasks()

const channel = supabase
.channel("todos-realtime")
.on(
"postgres_changes",
{event:"*",schema:"public",table:"todos"},
()=>{
fetchAllTasks()
}
)
.subscribe()

return ()=>{
supabase.removeChannel(channel)
}

},[activeDay,search,filterCategory,filterStatus])



/* TOGGLE STATUS */

const toggleTaskStatus = async(task:any)=>{

const newStatus =
task.status==="completed" ? "pending":"completed"

const {error} = await supabase
.from("todos")
.update({status:newStatus})
.eq("id",task.id)

if(error){
console.log("Update error:",error)
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


/* CALENDAR CALCULATION */

const daysInMonth =
new Date(viewDate.getFullYear(),viewDate.getMonth()+1,0).getDate()

const firstDayOfMonth =
new Date(viewDate.getFullYear(),viewDate.getMonth(),1).getDay()


/* DASHBOARD STATS */

const totalTasks = allTasks.length
const completedTasks = allTasks.filter(t=>t.status==="completed").length
const pendingTasks = allTasks.filter(t=>t.status==="pending").length
const overdueTasks =
allTasks.filter(t=>t.status!=="completed" && t.due_date < today).length


/* DAILY PROGRESS */

const todayCompleted =
selectedDayTasks.filter(t=>t.status==="completed").length

const progress =
selectedDayTasks.length===0
?0
:Math.round((todayCompleted/selectedDayTasks.length)*100)



return(

<div className="min-h-screen bg-[#F8FAFC] pb-36 font-sans text-slate-900">

<Header/>

<main className="p-6 space-y-8">


{/* DASHBOARD STATS */}

<section className="grid grid-cols-2 gap-4">

<div className="bg-white p-5 rounded-3xl border border-slate-100">
<p className="text-[10px] font-black text-slate-400 uppercase">Total</p>
<h3 className="text-2xl font-black">{totalTasks}</h3>
</div>

<div className="bg-white p-5 rounded-3xl border border-slate-100">
<p className="text-[10px] font-black text-emerald-500 uppercase">Completed</p>
<h3 className="text-2xl font-black">{completedTasks}</h3>
</div>

<div className="bg-white p-5 rounded-3xl border border-slate-100">
<p className="text-[10px] font-black text-amber-500 uppercase">Pending</p>
<h3 className="text-2xl font-black">{pendingTasks}</h3>
</div>

<div className="bg-white p-5 rounded-3xl border border-slate-100">
<p className="text-[10px] font-black text-red-500 uppercase">Overdue</p>
<h3 className="text-2xl font-black">{overdueTasks}</h3>
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
className="h-full bg-blue-600"
style={{width:`${progress}%`}}
/>

</div>

</section>


{/* CALENDAR */}

<section className="bg-white p-6 rounded-[2rem] border border-slate-100">

<div className="flex justify-between items-center mb-6">

<h2 className="flex items-center gap-2 font-black">

<CalendarIcon
size={18}
className="cursor-pointer text-blue-500"
onClick={()=>dateInputRef.current?.click()}
/>

{viewDate.toLocaleString('default',{
month:'long',
year:'numeric'
})}

</h2>

<input
ref={dateInputRef}
type="date"
value={activeDay}
onChange={handleDatePicker}
style={{
position:"absolute",
opacity:0,
width:0,
height:0
}}
/>

<div className="flex gap-2">

<button onClick={()=>changeMonth(-1)}>
<ChevronLeft size={18}/>
</button>

<button onClick={()=>changeMonth(1)}>
<ChevronRight size={18}/>
</button>

</div>

</div>


<div className="grid grid-cols-7 text-center text-xs mb-2">
{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
<div key={d}>{d}</div>
))}
</div>


<div className="grid grid-cols-7 text-center">

{[...Array(firstDayOfMonth)].map((_,i)=><div key={i}/> )}

{[...Array(daysInMonth)].map((_,i)=>{

const day = i+1

const dateStr =
`${viewDate.getFullYear()}-${String(viewDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`

const dayTasks = allTasks.filter(t=>t.due_date===dateStr)

const isSelected = activeDay===dateStr
const isToday = today===dateStr

return(

<button
key={day}
onClick={()=>handleDayClick(day)}
className={`relative w-11 h-11 mx-auto rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
isSelected
?'bg-blue-600 text-white'
:isToday
?'bg-blue-50 text-blue-600 border border-blue-100'
:'text-slate-600 hover:bg-slate-50'
}`}
>

{day}

{dayTasks.length>0 && !isSelected &&(
<div className="absolute bottom-1 text-[9px] font-black text-blue-500">
{dayTasks.length}
</div>
)}

</button>

)

})}

</div>

</section>


{/* TASK LIST */}

<section className="space-y-4">

{selectedDayTasks.length===0?(

<div className="bg-white p-10 rounded-[2rem] text-center border border-slate-100">

<Star size={32} className="mx-auto mb-4 text-slate-300"/>

<p className="text-xs text-slate-400">
No plans for this day
</p>

</div>

):(selectedDayTasks.map(task=>{

const isOverdue =
task.status!=="completed" && task.due_date < today

return(

<div
key={task.id}
className="bg-white p-5 rounded-[2rem] flex justify-between items-center border border-slate-100"
>

<div>

<span className={`font-bold ${
task.status==="completed"
?"line-through text-slate-300":""
}`}>

{task.category==="Work" && "💼 "}
{task.category==="Meeting" && "🗓️ "}
{task.category==="Personal" && "🏠 "}
{task.category==="Urgent" && "🚨 "}

{task.title}

</span>

<div className="flex gap-3 text-xs text-slate-400 mt-1">

<div className="flex items-center gap-1">
<Clock size={12}/>
{task.due_time || "Flexible"}
</div>

{task.assignee &&(
<div className="flex items-center gap-1">
<User size={12}/>
{task.assignee}
</div>
)}

{isOverdue &&(
<span className="text-red-500 font-bold">
Overdue
</span>
)}

</div>

</div>

<button
onClick={()=>toggleTaskStatus(task)}
className={`w-6 h-6 rounded-full border-2 ${
task.status==="completed"
?"bg-emerald-500 border-emerald-500"
:"border-slate-300"
}`}
/>

</div>

)

}))}

</section>

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

<button
className="flex flex-col items-center text-blue-600"
>
<PieChart size={28}/>
<span className="text-[9px] font-black uppercase">
Dashboard
</span>
</button>

<button
className="flex flex-col items-center text-slate-300"
>
<Settings size={26}/>
<span className="text-[9px] font-black uppercase">
Menu
</span>
</button>

</footer>

</div>

)

}