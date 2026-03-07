"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Plus, CheckCircle2, Circle, Trash2, Home, PieChart, Settings, Loader2, Calendar, Search, UserPlus, Tag, Clock } from 'lucide-react';

export default function MobileAppDashboard() {

const router = useRouter();

const [tasks, setTasks] = useState<any[]>([]);
const [newTask, setNewTask] = useState('');
const [isAdding, setIsAdding] = useState(false);

const [priority, setPriority] = useState('low');
const [category, setCategory] = useState('Work');
const [assignee, setAssignee] = useState('');
const [dueTime, setDueTime] = useState('');

const [searchQuery, setSearchQuery] = useState('');
const [filterStatus, setFilterStatus] = useState('all'); 

const [selectedDate, setSelectedDate] = useState(
new Date().toISOString().split('T')[0]
);

const fetchTasks = async () => {

let query = supabase
.from('todos')
.select('*')
.eq('task_date', selectedDate);

if (searchQuery) {
query = query.ilike('title', `%${searchQuery}%`);
}

const { data } = await query.order('created_at', { ascending: false });

if (data) {

const filtered = data.filter(t => {
if (filterStatus === 'completed') return t.status === 'completed';
if (filterStatus === 'pending') return t.status === 'pending';
return true;
});

setTasks(filtered);

}

};

useEffect(() => { fetchTasks(); }, [selectedDate, searchQuery, filterStatus]);

const handleAddTask = async (e: React.FormEvent) => {

e.preventDefault();

if (!newTask.trim()) return;

setIsAdding(true);

await supabase.from('todos').insert([{
title: newTask,
status: 'pending',
priority,
category,
assignee,
due_time: dueTime,
task_date: selectedDate
}]);

setNewTask('');
setAssignee('');
setDueTime('');

fetchTasks();

setIsAdding(false);

};

const toggleStatus = async (id: string, currentStatus: string) => {

const nextStatus = currentStatus === 'completed'
? 'pending'
: 'completed';

await supabase
.from('todos')
.update({ status: nextStatus })
.eq('id', id);

fetchTasks();

};

const deleteTask = async (id: string) => {

await supabase
.from('todos')
.delete()
.eq('id', id);

fetchTasks();

};

const total = tasks.length;
const completed = tasks.filter(t => t.status === 'completed').length;
const percent = total > 0
? Math.round((completed / total) * 100)
: 0;

return (

<div className="min-h-screen bg-[#F8FAFC] pb-36 font-sans text-slate-900">

{/* HEADER */}

<nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100 px-5 pt-12 pb-3 flex justify-between items-center">

<div>
<h1 className="text-lg font-black tracking-tight text-slate-800">TaskMaster</h1>
<p className="text-[9px] font-bold text-blue-600 tracking-widest uppercase">Vanness Plus</p>
</div>

<div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white text-[10px]">
RN
</div>

</nav>


<main className="p-5 max-w-md mx-auto space-y-5">


{/* STATS */}

<div className="grid grid-cols-2 gap-3">

<div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
<p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
<h3 className="text-2xl font-black text-slate-800">{total}</h3>
</div>

<div className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-100 text-white">
<p className="text-[9px] font-bold text-blue-100 uppercase tracking-widest">Success</p>
<h3 className="text-2xl font-black">{percent}%</h3>
</div>

</div>


{/* SEARCH */}

<div className="relative flex items-center bg-white rounded-xl border border-slate-100 shadow-sm">

<Search className="text-slate-300 ml-3" size={16} />

<input
type="text"
placeholder="ค้นหางาน..."
value={searchQuery}
onChange={(e) => setSearchQuery(e.target.value)}
className="w-full bg-transparent outline-none p-3 text-sm font-semibold"
/>

</div>


{/* DATE */}

<div className="flex items-center bg-white p-3 rounded-xl border border-slate-100 shadow-sm">

<Calendar className="text-blue-500 mr-3" size={16} />

<input
type="date"
value={selectedDate}
onChange={(e) => setSelectedDate(e.target.value)}
className="w-full bg-transparent outline-none text-sm font-semibold"
/>

</div>


{/* ADD TASK CARD */}

<div className="bg-white p-5 rounded-2xl shadow-md border border-slate-100 space-y-4">

<input
type="text"
value={newTask}
onChange={(e) => setNewTask(e.target.value)}
placeholder="เพิ่มงานใหม่..."
className="w-full p-4 rounded-xl bg-slate-50 ring-1 ring-slate-100 text-sm font-semibold"
/>


{/* CATEGORY + TIME */}

<div className="grid grid-cols-2 gap-3">

<div className="flex items-center bg-slate-50 p-3 rounded-xl ring-1 ring-slate-100">

<Tag size={14} className="text-slate-400 mr-2" />

<select
value={category}
onChange={(e) => setCategory(e.target.value)}
className="bg-transparent outline-none text-[11px] font-bold uppercase w-full"
>

<option value="Work">💼 Work</option>
<option value="Meeting">🗓️ Meeting</option>
<option value="Personal">🏠 Personal</option>
<option value="Urgent">🚨 Urgent</option>

</select>

</div>


<div className="flex items-center bg-slate-50 p-3 rounded-xl ring-1 ring-slate-100">

<Clock size={14} className="text-slate-400 mr-2" />

<input
type="time"
value={dueTime}
onChange={(e) => setDueTime(e.target.value)}
className="bg-transparent outline-none text-[11px] font-bold w-full"
/>

</div>

</div>


{/* ASSIGNEE (ไม่เปลี่ยนโครงสร้าง) */}

<div className="flex items-center bg-slate-50 p-3 rounded-xl ring-1 ring-slate-100">

<UserPlus size={14} className="text-slate-400 mr-2" />

<input
type="text"
placeholder="ระบุผู้เกี่ยวข้อง..."
value={assignee}
onChange={(e) => setAssignee(e.target.value)}
className="bg-transparent outline-none text-[12px] font-bold w-full"
/>

</div>


<button
disabled={isAdding}
onClick={handleAddTask}
className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold text-[11px] tracking-widest active:scale-95 transition flex items-center justify-center gap-2"
>

{isAdding
? <Loader2 className="animate-spin" size={18} />
: <Plus size={18} strokeWidth={3} />}

ADD TASK

</button>

</div>


{/* FILTER */}

<div className="flex gap-2 overflow-x-auto pb-1">

{['all', 'pending', 'completed'].map((f) => (

<button
key={f}
onClick={() => setFilterStatus(f)}
className={`px-4 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition
${filterStatus === f
? 'bg-slate-900 text-white'
: 'bg-white text-slate-400 border border-slate-100'
}`}

>

{f}

</button>

))}

</div>


{/* TASK LIST */}

<div className="space-y-3">

{tasks.map((task) => (

<div
key={task.id}
className="bg-white p-4 rounded-xl flex items-center justify-between border border-slate-100 shadow-sm active:scale-[0.98] transition"
>

<div className="flex items-center gap-3 flex-1">

<button
onClick={() => toggleStatus(task.id, task.status)}
className="active:scale-75 transition"
>

{task.status === 'completed'
? <CheckCircle2 className="text-emerald-500" size={24} />
: <Circle className="text-slate-300" size={24} />
}

</button>

<div className="flex flex-col truncate">

<span className={`text-sm font-bold truncate
${task.status === 'completed'
? 'line-through text-slate-300'
: 'text-slate-800'}
`}>

{task.title}

</span>

<div className="flex gap-2 items-center mt-1">

<span className={`text-[8px] font-bold px-2 py-[2px] rounded-md uppercase
${task.category === 'Meeting'
? 'bg-blue-600 text-white'
: 'bg-slate-100 text-slate-500'}
`}>

{task.category}

</span>

{task.due_time &&
<span className="text-[9px] font-bold text-slate-400 flex items-center gap-1">
<Clock size={10}/> {task.due_time}
</span>
}

{task.assignee &&
<span className="text-[9px] font-bold text-blue-500 flex items-center gap-1">
<UserPlus size={10}/> {task.assignee}
</span>
}

</div>

</div>

</div>

<button
onClick={() => deleteTask(task.id)}
className="p-2 text-slate-200 hover:text-red-400 transition"
>

<Trash2 size={18} />

</button>

</div>

))}

</div>

</main>


{/* FOOTER */}

<footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-10 pt-4 pb-7 flex justify-between items-center shadow-xl">

<button className="flex flex-col items-center text-blue-600">
<Home size={22}/>
<span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
</button>

<button
onClick={() => router.push('/stats')}
className="flex flex-col items-center text-slate-400"
>

<PieChart size={22}/>
<span className="text-[9px] font-bold uppercase tracking-widest">Dashboard</span>

</button>

<button className="flex flex-col items-center text-slate-400">

<Settings size={22}/>
<span className="text-[9px] font-bold uppercase tracking-widest">Menu</span>

</button>

</footer>

</div>

)

}