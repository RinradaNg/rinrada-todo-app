"use client"
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, CheckCircle2, Circle, Trash2, Calendar, LayoutDashboard, ListTodo, PieChart, Loader2 } from 'lucide-react';

export default function ProfessionalDashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [newTask, setNewTask] = useState('');
  const [isAdding, setIsAdding] = useState(false);

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
    await supabase.from('todos').insert([{ title: newTask, status: 'pending' }]);
    setNewTask('');
    fetchTasks();
    setIsAdding(false);
  };

  // ส่วนคำนวณสถิติ
  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:block p-6">
        <h2 className="text-xl font-bold mb-10 flex items-center gap-2">
          <LayoutDashboard className="text-blue-400" /> TaskMaster
        </h2>
        <nav className="space-y-4">
          <div className="flex items-center gap-3 text-blue-400 bg-slate-800 p-3 rounded-lg cursor-pointer">
            <ListTodo size={20} /> My Dashboard
          </div>
          <div className="flex items-center gap-3 text-slate-400 p-3 hover:bg-slate-800 rounded-lg cursor-pointer transition">
            <PieChart size={20} /> Analytics
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Overview</h1>
              <p className="text-slate-500">ติดตามความคืบหน้าและจัดการรายการงานของคุณ</p>
            </div>
            <div className="text-right text-sm font-medium text-slate-400">
              {new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}
            </div>
          </header>

          {/* Stats Cards - ส่วนสรุปผล Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-sm mb-1">Total Tasks</p>
              <h3 className="text-3xl font-bold">{total}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-sm mb-1">Completed</p>
              <h3 className="text-3xl font-bold text-green-500">{completed}</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <p className="text-slate-500 text-sm mb-1">Success Rate</p>
              <h3 className="text-3xl font-bold text-blue-600">{percent}%</h3>
              <div className="w-full bg-slate-100 h-2 mt-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full transition-all" style={{ width: `${percent}%` }}></div>
              </div>
            </div>
          </div>

          {/* Add Task Form */}
          <form onSubmit={handleAddTask} className="flex gap-3 mb-8">
            <input 
              type="text" 
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Add a new task..." 
              className="flex-1 p-4 rounded-xl border-none shadow-sm ring-1 ring-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button disabled={isAdding} className="bg-blue-600 hover:bg-blue-700 text-white px-8 rounded-xl font-bold transition flex items-center gap-2">
              {isAdding ? <Loader2 className="animate-spin" /> : <Plus />} Add
            </button>
          </form>

          {/* Task List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2">
              <ListTodo size={18} className="text-blue-500" /> Recent Tasks
            </div>
            <div className="divide-y divide-slate-50">
              {tasks.map((task) => (
                <div key={task.id} className="p-5 flex items-center justify-between group hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleStatus(task.id, task.status)}>
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="text-green-500" size={24} />
                      ) : (
                        <Circle className="text-slate-300 hover:text-blue-500" size={24} />
                      )}
                    </button>
                    <span className={`text-lg ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {task.title}
                    </span>
                  </div>
                  <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition">
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}