"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, CheckCircle2, Circle, Trash2, Home, PieChart, Settings, Loader2 } from 'lucide-react';

export default function MobileAppDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [priority, setPriority] = useState('low'); 

  const fetchTasks = async () => {
    const { data } = await supabase.from('todos').select('*').order('created_at', { ascending: false });
    if (data) setTasks(data);
  };

  useEffect(() => { fetchTasks(); }, []);

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await supabase.from('todos').update({ status: nextStatus }).eq('id', id);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await supabase.from('todos').delete().eq('id', id);
    fetchTasks();
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setIsAdding(true);
    await supabase.from('todos').insert([{ 
      title: newTask, 
      status: 'pending',
      priority: priority 
    }]);
    setNewTask('');
    setPriority('low');
    fetchTasks();
    setIsAdding(false);
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans text-slate-900">
      {/* 1. ปรับ Header ให้เว้นระยะจากรอยบาก (Padding Top) */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 pt-[var(--nav-pt)] pb-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase">TaskMaster</h1>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Vanness Plus</p>
        </div>
        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-slate-200">
          RN
        </div>
      </nav>

      <main className="p-6 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 transition-transform active:scale-95">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
            <h3 className="text-3xl font-black text-slate-800">{total}</h3>
          </div>
          <div className="bg-blue-600 p-5 rounded-[2rem] shadow-xl shadow-blue-100 border border-blue-500 transition-transform active:scale-95">
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Success</p>
            <h3 className="text-3xl font-black text-white">{percent}%</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 mb-8">
          <form onSubmit={handleAddTask} className="space-y-5">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="วันนี้ต้องทำอะไร?" 
              className="w-full p-5 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-4 focus:ring-blue-500/10 outline-none text-base font-bold placeholder:text-slate-300 transition-all"
            />
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Set Priority</span>
                <div className="flex gap-3">
                  {['high', 'medium', 'low'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`w-4 h-4 rounded-full transition-all duration-300 ${priority === p ? `ring-4 ring-offset-2 scale-110 ${p === 'high' ? 'ring-red-500 bg-red-500' : p === 'medium' ? 'ring-orange-400 bg-orange-400' : 'ring-blue-500 bg-blue-500'}` : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
              <button disabled={isAdding} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-2xl shadow-slate-300">
                {isAdding ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} strokeWidth={3} />} ADD TASK
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-3 mb-2">
            <h2 className="font-black text-slate-900 text-xs tracking-[0.2em] uppercase italic">My Workflow</h2>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{completed}/{total} Done</span>
          </div>

          {tasks.length === 0 ? (
            <div className="py-16 text-center text-slate-200 font-black text-xs uppercase tracking-widest">Queue is Empty</div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-white p-5 rounded-[2rem] flex items-center justify-between shadow-sm border border-slate-50 active:scale-[0.98] transition-all">
                <div className="flex items-center gap-5 flex-1 overflow-hidden">
                  <button onClick={() => toggleStatus(task.id, task.status)} className="flex-shrink-0 transition-transform active:scale-75">
                    {task.status === 'completed' ? (
                      <div className="bg-emerald-500 p-1 rounded-full text-white shadow-lg shadow-emerald-500/20"><CheckCircle2 size={24} /></div>
                    ) : (
                      <Circle className="text-slate-200" size={32} />
                    )}
                  </button>
                  <div className="flex items-center gap-4 truncate">
                    <div className={`w-2 h-7 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)} shadow-sm`} />
                    <span className={`text-lg font-black tracking-tight truncate transition-all ${task.status === 'completed' ? 'line-through text-slate-300 italic' : 'text-slate-800'}`}>
                      {task.title}
                    </span>
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} className="p-3 text-slate-200 hover:text-red-500 transition-colors ml-2">
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* 2. ปรับ Footer (Bottom Nav) ให้ขยับไอคอนเข้าข้างใน (Padding Horizontal) และเว้นขอบล่าง (Padding Bottom) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-12 pt-5 pb-10 flex justify-between items-center z-40 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        {/* ปรับ px-12 เพื่อขยับไอคอนซ้ายขวาเข้าหาตรงกลาง ไม่ให้ชิดมุมจอโค้ง */}
        {/* ปรับ pb-10 เพื่อเว้นระยะจากขอบล่างของ iPhone (Home Indicator) */}
        
        <button className="flex flex-col items-center gap-1.5 text-blue-600 transition-transform active:scale-90">
          <Home size={26} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </button>
        
        <button className="flex flex-col items-center gap-1.5 text-slate-300 transition-transform active:scale-90">
          <PieChart size={26} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Stats</span>
        </button>
        
        <button className="flex flex-col items-center gap-1.5 text-slate-300 transition-transform active:scale-90">
          <Settings size={26} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Menu</span>
        </button>
      </footer>
    </div>
  );
}