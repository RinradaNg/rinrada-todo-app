"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // เพิ่มการเชื่อมต่อหน้า
import { supabase } from '@/lib/supabase';
import { Plus, CheckCircle2, Circle, Trash2, Home, PieChart, Settings, Loader2, Calendar, Search, UserPlus, Tag, Clock, Video } from 'lucide-react';

export default function MobileAppDashboard() {
  const router = useRouter(); // สร้างตัวแปรควบคุมการเปลี่ยนหน้า
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [priority, setPriority] = useState('low');
  const [category, setCategory] = useState('Work');
  const [assignee, setAssignee] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchTasks = async () => {
    let query = supabase.from('todos').select('*').eq('task_date', selectedDate);
    
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
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    await supabase.from('todos').update({ status: nextStatus }).eq('id', id);
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await supabase.from('todos').delete().eq('id', id);
    fetchTasks();
  };

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-40 font-sans text-slate-900 selection:bg-blue-100">
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 pt-[var(--nav-pt)] pb-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-black tracking-tight text-slate-800 uppercase">TaskMaster</h1>
          <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Vanness Plus</p>
        </div>
        <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-xs shadow-lg shadow-slate-200">RN</div>
      </nav>

      <main className="p-6 max-w-md mx-auto space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
            <h3 className="text-3xl font-black text-slate-800">{total}</h3>
          </div>
          <div className="bg-blue-600 p-5 rounded-[2rem] shadow-xl shadow-blue-100 border border-blue-500 text-white">
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Success</p>
            <h3 className="text-3xl font-black">{percent}%</h3>
          </div>
        </div>

        <div className="space-y-3">
          <div className="relative flex items-center bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
            <Search className="text-slate-300 ml-3" size={18} />
            <input 
              type="text" 
              placeholder="ค้นหางานหรือคน..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none p-3 font-bold text-sm"
            />
          </div>
          <div className="flex items-center bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm">
            <Calendar className="text-blue-500 mr-3" size={18} />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-transparent border-none outline-none font-bold text-sm text-slate-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50 space-y-4 transition-all">
          <input 
            type="text" 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="เพิ่มงานหรือนัดหมายใหม่..." 
            className="w-full p-5 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-100 font-bold"
          />
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center bg-slate-50 p-3 rounded-xl ring-1 ring-slate-100">
              <Tag size={14} className="text-slate-400 mr-2" />
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-transparent border-none outline-none text-[10px] font-black uppercase w-full">
                <option value="Work">💼 Work</option>
                <option value="Meeting">🗓️ Meeting</option>
                <option value="Personal">🏠 Personal</option>
                <option value="Urgent">🚨 Urgent</option>
              </select>
            </div>
            <div className="flex items-center bg-slate-50 p-3 rounded-xl ring-1 ring-slate-100">
              <Clock size={14} className="text-slate-400 mr-2" />
              <input type="time" value={dueTime} onChange={(e) => setDueTime(e.target.value)} className="bg-transparent border-none outline-none text-[10px] font-black w-full" />
            </div>
          </div>
          
          <div className="flex items-center bg-slate-50 p-3 rounded-xl ring-1 ring-slate-100">
            <UserPlus size={14} className="text-slate-400 mr-2" />
            <input type="text" placeholder="ระบุผู้เกี่ยวข้อง..." value={assignee} onChange={(e) => setAssignee(e.target.value)} className="bg-transparent border-none outline-none text-[11px] font-black w-full" />
          </div>

          <button disabled={isAdding} onClick={handleAddTask} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-xs tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl">
            {isAdding ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} strokeWidth={3} />} ADD SCHEDULE
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {['all', 'pending', 'completed'].map((f) => (
            <button key={f} onClick={() => setFilterStatus(f)} className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${filterStatus === f ? 'bg-slate-900 text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-50'}`}>
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className={`p-5 rounded-[2.2rem] flex items-center justify-between shadow-sm border border-slate-50 active:scale-[0.98] transition-all ${task.category === 'Meeting' ? 'bg-blue-50/30' : 'bg-white'}`}>
              <div className="flex items-center gap-4 flex-1 overflow-hidden">
                <button onClick={() => toggleStatus(task.id, task.status)} className="active:scale-75 transition-transform">
                  {task.status === 'completed' ? <CheckCircle2 className="text-emerald-500" size={28} /> : <Circle className="text-slate-200" size={28} />}
                </button>
                <div className="flex flex-col truncate">
                  <span className={`text-base font-black truncate ${task.status === 'completed' ? 'line-through text-slate-300 italic' : 'text-slate-800'}`}>
                    {task.title}
                  </span>
                  <div className="flex gap-2 items-center mt-1">
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-md uppercase ${task.category === 'Meeting' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>{task.category}</span>
                    {task.due_time && <span className="text-[9px] font-black text-slate-400 flex items-center gap-1"><Clock size={10} /> {task.due_time}</span>}
                    {task.assignee && <span className="text-[9px] font-black text-blue-500 flex items-center gap-1"><UserPlus size={10} /> {task.assignee}</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => deleteTask(task.id)} className="p-2 text-slate-100 hover:text-red-400 transition-colors">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 px-12 pt-5 pb-10 flex justify-between items-center z-40 shadow-2xl">
        <button className="flex flex-col items-center gap-1.5 text-blue-600 active:scale-90 transition-transform">
          <Home size={24} strokeWidth={3} />
          <span className="text-[9px] font-black uppercase tracking-widest">Home</span>
        </button>
        {/* แก้ไขปุ่ม Stats ให้กดสลับไปหน้า Dashboard */}
        <button 
          onClick={() => router.push('/stats')} 
          className="flex flex-col items-center gap-1.5 text-slate-300 active:scale-90 transition-transform"
        >
          <PieChart size={24} strokeWidth={3} />
          <span className="text-[9px] font-black uppercase tracking-widest">Dashboard</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-slate-300 active:scale-90 transition-transform">
          <Settings size={24} strokeWidth={3} />
          <span className="text-[9px] font-black uppercase tracking-widest">Menu</span>
        </button>
      </footer>
    </div>
  );
}