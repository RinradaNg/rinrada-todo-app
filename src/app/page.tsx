"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, CheckCircle2, Circle, Trash2, LayoutDashboard, ListTodo, PieChart, Loader2, Home, User, Settings } from 'lucide-react';

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
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-slate-900">
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-800">TASKMASTER</h1>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Vanness Plus Edition</p>
        </div>
        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-black text-slate-400 border border-slate-200">
          RN
        </div>
      </nav>

      <main className="p-5 max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
            <h3 className="text-2xl font-black text-slate-800">{total}</h3>
          </div>
          <div className="bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-200 border border-blue-500">
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Progress</p>
            <h3 className="text-2xl font-black text-white">{percent}%</h3>
          </div>
        </div>

        <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-100 mb-6">
          <form onSubmit={handleAddTask} className="space-y-4">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="วันนี้ต้องทำอะไร?" 
              className="w-full p-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 focus:ring-2 focus:ring-blue-500 outline-none text-base font-bold placeholder:text-slate-300"
            />
            
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority</span>
                <div className="flex gap-2">
                  {['high', 'medium', 'low'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${priority === p ? `ring-4 ring-offset-2 ${p === 'high' ? 'ring-red-500 bg-red-500' : p === 'medium' ? 'ring-orange-400 bg-orange-400' : 'ring-blue-500 bg-blue-500'}` : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
              </div>
              <button disabled={isAdding} className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-xl">
                {isAdding ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />} เพิ่มงาน
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center px-2 mb-2">
            <h2 className="font-black text-slate-800 text-sm tracking-widest uppercase">Ongoing Tasks</h2>
            <span className="text-[10px] font-bold text-slate-400">{completed}/{total} Done</span>
          </div>

          {tasks.length === 0 ? (
            <div className="py-12 text-center text-slate-300 font-bold text-sm">ไม่มีรายการงาน</div>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-3xl flex items-center justify-between shadow-sm border border-slate-50 active:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <button onClick={() => toggleStatus(task.id, task.status)} className="flex-shrink-0">
                    {task.status === 'completed' ? (
                      <CheckCircle2 className="text-emerald-500" size={24} />
                    ) : (
                      <Circle className="text-slate-200" size={24} />
                    )}
                  </button>
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-1.5 h-6 rounded-full flex-shrink-0 ${getPriorityColor(task.priority)}`} />
                    <span className={`text-sm font-black truncate transition-all ${task.status === 'completed' ? 'line-through text-slate-300 italic' : 'text-slate-700'}`}>
                      {task.title}
                    </span>
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 px-8 py-4 flex justify-between items-center z-40 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.1)]">
        <button className="flex flex-col items-center gap-1 text-blue-600">
          <Home size={24} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-300 hover:text-slate-400">
          <PieChart size={24} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Stats</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-slate-300 hover:text-slate-400">
          <Settings size={24} strokeWidth={3} />
          <span className="text-[10px] font-black uppercase tracking-tighter">Menu</span>
        </button>
      </footer>
    </div>
  );
}