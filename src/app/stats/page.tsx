"use client"
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Clock, Home, PieChart, Settings, Video, User, Briefcase, Star
} from 'lucide-react';

export default function DashboardPage() {

  const router = useRouter();

  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [activeDay, setActiveDay] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDayTasks, setSelectedDayTasks] = useState<any[]>([]);

  // NEW FILTER STATES
  const [search,setSearch] = useState("")
  const [filterCategory,setFilterCategory] = useState("all")
  const [filterStatus,setFilterStatus] = useState("all")

  const dateInputRef = useRef<HTMLInputElement>(null);

  const fetchAllTasks = async () => {

    const { data } = await supabase.from('todos').select('*');

    if (data) {

      setAllTasks(data);

      const tasks = data
        .filter(t => t.task_date === activeDay)
        .filter(t => filterCategory === "all" ? true : t.category === filterCategory)
        .filter(t => filterStatus === "all" ? true : t.status === filterStatus)
        .filter(t => t.title.toLowerCase().includes(search.toLowerCase()))

      setSelectedDayTasks(tasks)
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, [activeDay,search,filterCategory,filterStatus]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(viewDate)
    newDate.setMonth(newDate.getMonth() + offset)
    setViewDate(newDate)
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setActiveDay(dateStr);
  };

  const handleDatePicker = (e:any)=>{
    const selected = new Date(e.target.value);
    setViewDate(selected);
    setActiveDay(e.target.value);
  }

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-36 font-sans text-slate-900">

      {/* HEADER */}

      <nav className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl px-8 pt-16 pb-6 border-b border-slate-100 flex justify-between items-center">

        <div>
          <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-slate-900 to-slate-500 bg-clip-text text-transparent">
            Schedule
          </h1>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Analytics & Planning</p>
        </div>

        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
            <PieChart size={20} strokeWidth={2.5} />
          </div>
        </div>

      </nav>

      <main className="p-6 space-y-8">

        {/* CALENDAR */}

        <section className="bg-white p-6 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.03)] border border-white">

          <div className="flex justify-between items-center mb-8 px-2">

            <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">

              <CalendarIcon 
                size={20} 
                className="text-blue-500 cursor-pointer"
                onClick={()=>dateInputRef.current?.click()}
              />

              {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}

            </h2>

            <input
              ref={dateInputRef}
              type="date"
              value={activeDay}
              onChange={handleDatePicker}
              className="absolute opacity-0 w-0 h-0"
            />

            <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400">
                <ChevronLeft size={18}/>
              </button>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-400">
                <ChevronRight size={18}/>
              </button>
            </div>

          </div>

          <div className="grid grid-cols-7 gap-y-3 text-center mb-4 text-[10px] font-black text-slate-300 uppercase tracking-tighter">
            {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => <div key={d}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-y-3 text-center">

            {[...Array(firstDayOfMonth)].map((_, i) => <div key={i}/>)}

            {[...Array(daysInMonth)].map((_, i) => {

              const day = i + 1;

              const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

              const dayTasks = allTasks.filter(t => t.task_date === dateStr);

              const isSelected = activeDay === dateStr;

              const isToday = new Date().toISOString().split('T')[0] === dateStr;

              return (
                <button 
                  key={day} 
                  onClick={() => handleDayClick(day)} 
                  className={`relative w-11 h-11 mx-auto rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                    isSelected ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-110' :
                    isToday ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >

                  {day}

                  {dayTasks.length > 0 && !isSelected && (
                    <div className="absolute bottom-1.5 flex gap-0.5">
                      {dayTasks.slice(0, 3).map((t, idx) => (
                        <div key={idx} className={`w-1 h-1 rounded-full ${t.status === 'completed' ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                      ))}
                    </div>
                  )}

                </button>
              );

            })}

          </div>

        </section>

        {/* FILTER UI */}

        <div className="flex gap-2 flex-wrap px-2">

          <input
            type="text"
            placeholder="Search task..."
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none"
          />

          <select
            value={filterCategory}
            onChange={(e)=>setFilterCategory(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 text-sm"
          >
            <option value="all">All</option>
            <option value="Work">Work</option>
            <option value="Meeting">Meeting</option>
            <option value="Personal">Personal</option>
            <option value="Urgent">Urgent</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e)=>setFilterStatus(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 text-sm"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>

        </div>

        {/* TASK LIST */}

        <section className="space-y-6">

          <div className="flex items-end justify-between px-2">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Agenda of the day</h3>
            <span className="text-[10px] font-black text-slate-300">{selectedDayTasks.length} ITEMS</span>
          </div>

          <div className="space-y-4">

            {selectedDayTasks.length === 0 ? (

              <div className="bg-white rounded-[2.5rem] py-16 border border-slate-100 text-center flex flex-col items-center shadow-sm">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                  <Star size={32}/>
                </div>
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No plans for this day</p>
              </div>

            ) : (

              selectedDayTasks.map(task => (

                <div key={task.id} className="relative overflow-hidden bg-white p-6 rounded-[2.5rem] flex items-center gap-5 border border-slate-100 shadow-sm">

                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${
                    task.status === 'completed' ? 'bg-emerald-500' :
                    task.category === 'Meeting' ? 'bg-blue-600' : 'bg-amber-400'
                  }`} />

                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    task.category === 'Meeting' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'
                  }`}>
                    {task.category === 'Meeting' ? <Video size={22}/> : <Briefcase size={22}/>}
                  </div>

                  <div className="flex-1 min-w-0">

                    <span className={`text-lg font-black tracking-tight block truncate ${
                      task.status === 'completed' ? 'line-through text-slate-300' : 'text-slate-800'
                    }`}>
                      {task.title}
                    </span>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1">

                      <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                        <Clock size={12} className="text-blue-500" /> {task.due_time || "Flexible"}
                      </div>

                      {task.assignee && (
                        <div className="flex items-center gap-1 text-[9px] font-black text-slate-500 uppercase tracking-tighter">
                          <User size={12} className="text-slate-300" /> {task.assignee}
                        </div>
                      )}

                      <div className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${
                        task.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {task.status}
                      </div>

                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </section>

      </main>

      {/* FOOTER */}

      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-12 pt-6 pb-10 flex justify-between items-center z-40 shadow-2xl">

        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1.5 text-slate-300">
          <Home size={26}/>
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </button>

        <button className="flex flex-col items-center gap-1.5 text-blue-600">
          <PieChart size={28}/>
          <span className="text-[9px] font-black uppercase tracking-widest">Dashboard</span>
        </button>

        <button className="flex flex-col items-center gap-1.5 text-slate-300">
          <Settings size={26}/>
          <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
        </button>

      </footer>

    </div>
  );
}