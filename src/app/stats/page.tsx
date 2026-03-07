"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Home, PieChart, Settings, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [viewDate, setViewDate] = useState(new Date()); // สำหรับเลื่อนเดือน/ปี
  const [activeDay, setActiveDay] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedDayTasks, setSelectedDayTasks] = useState<any[]>([]);

  const fetchAllTasks = async () => {
    const { data } = await supabase.from('todos').select('*');
    if (data) {
      setAllTasks(data);
      setSelectedDayTasks(data.filter(t => t.task_date === activeDay));
    }
  };

  useEffect(() => { fetchAllTasks(); }, [activeDay]);

  const changeMonth = (offset: number) => {
    setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + offset)));
  };

  const handleDayClick = (day: number) => {
    const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setActiveDay(dateStr);
  };

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  return (
    <div className="min-h-screen bg-[#FDFEFF] pb-32 font-sans">
      {/* 📊 Header: สรุปงานค้างและ Success Rate รวม */}
      <header className="p-8 pt-12 bg-slate-900 text-white rounded-b-[3rem] shadow-2xl">
        <h1 className="text-2xl font-black tracking-tighter">Workflow Dashboard</h1>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white/10 p-5 rounded-[2rem] border border-white/10">
            <p className="text-[9px] font-black opacity-60 uppercase">Total Success</p>
            <h2 className="text-3xl font-black">
              {allTasks.length > 0 ? Math.round((allTasks.filter(t => t.status === 'completed').length / allTasks.length) * 100) : 0}%
            </h2>
          </div>
          <div className="bg-blue-600 p-5 rounded-[2rem]">
            <p className="text-[9px] font-black text-blue-100 uppercase">Pending Tasks</p>
            <h2 className="text-3xl font-black">{allTasks.filter(t => t.status === 'pending').length}</h2>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* 🗓️ ปฏิทินรวม: กดดูได้ทุกปี */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-black text-slate-800 uppercase tracking-tighter">
              {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button onClick={() => changeMonth(-1)} className="p-2 bg-slate-50 rounded-xl active:scale-75 transition-all"><ChevronLeft size={18}/></button>
              <button onClick={() => changeMonth(1)} className="p-2 bg-slate-50 rounded-xl active:scale-75 transition-all"><ChevronRight size={18}/></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-3 text-center">
            {['S','M','T','W','T','F','S'].map(d => <div key={d} className="text-[10px] font-black text-slate-300">{d}</div>)}
            {[...Array(firstDayOfMonth)].map((_, i) => <div key={i}/>)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const dateStr = `${viewDate.getFullYear()}-${String(viewDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const hasTasks = allTasks.some(t => t.task_date === dateStr);
              return (
                <button key={day} onClick={() => handleDayClick(day)} className={`relative w-10 h-10 mx-auto rounded-2xl flex items-center justify-center text-sm font-black transition-all ${activeDay === dateStr ? 'bg-blue-600 text-white' : 'text-slate-600'}`}>
                  {day}
                  {hasTasks && activeDay !== dateStr && <div className="absolute bottom-1 w-1 h-1 bg-blue-500 rounded-full"/>}
                </button>
              );
            })}
          </div>
        </section>

        {/* 📋 รายการงานที่ค้างอยู่ในวันที่เลือก */}
        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Work List: {activeDay}</h3>
          {selectedDayTasks.map(task => (
            <div key={task.id} className="bg-white p-5 rounded-[2.2rem] flex items-center justify-between border border-slate-50 shadow-sm">
              <div className="flex items-center gap-4">
                <div className={`w-1.5 h-8 rounded-full ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <span className={`font-black tracking-tight ${task.status === 'completed' ? 'line-through opacity-30 italic' : ''}`}>{task.title}</span>
              </div>
              {task.status === 'pending' ? <AlertCircle size={18} className="text-amber-400" /> : <CheckCircle2 size={18} className="text-emerald-500" />}
            </div>
          ))}
        </section>
      </main>

      {/* 🧭 Footer: กดสลับกลับหน้า Home */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-12 pt-6 pb-10 flex justify-between items-center z-40">
        <button onClick={() => router.push('/')} className="flex flex-col items-center gap-1.5 text-slate-300 active:scale-90 transition-transform">
          <Home size={26} strokeWidth={3} />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-blue-600 active:scale-90 transition-transform">
          <PieChart size={26} strokeWidth={3} />
          <span className="text-[9px] font-black uppercase tracking-widest">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-300 active:scale-90 transition-transform">
          <Settings size={26} strokeWidth={3} />
          <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
        </button>
      </footer>
    </div>
  );
}