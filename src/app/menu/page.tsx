"use client"

import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Home, PieChart, Settings, User, LogOut } from "lucide-react"

export default function MenuPage() {
  const router = useRouter()

  const logout = async () => {
    try {
      // 1. สั่ง Sign Out จาก Supabase เพื่อล้าง Session ในฐานข้อมูล
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error

      // 2. ใช้ window.location.href แทน router.push เพื่อบังคับให้เบราว์เซอร์ล้าง Cache 
      // และกลับไปเช็คเงื่อนไขที่ middleware.ts ใหม่ทั้งหมด
      window.location.href = "/login"
    } catch (error) {
      console.error("Error logging out:", error)
      // กรณีเกิด Error ยังคงพยายามส่งไปหน้า login
      window.location.href = "/login"
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-36 font-sans text-slate-900">
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-black">Menu</h1>

        {/* จัดกลุ่มเมนูด้วยระยะห่าง space-y-4 */}
        <div className="space-y-4">
          
          {/* PROFILE CARD */}
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <button
              onClick={() => router.push("/profile")}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <User size={18} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold">Profile</p>
                  <p className="text-xs text-slate-400">Edit your profile information</p>
                </div>
              </div>
            </button>
          </div>

          {/* LOGOUT CARD - แยกบล็อกออกมาเพื่อให้ชัดเจนและลดการกดผิด */}
          <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <button
              onClick={logout}
              className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <LogOut size={18} className="text-red-500" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-red-500">Logout</p>
                  <p className="text-xs text-slate-400">Sign out from your account</p>
                </div>
              </div>
            </button>
          </div>

        </div>
      </main>

      {/* FOOTER NAV - ยึดไว้ด้านล่างเสมอ */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-12 pt-6 pb-10 flex justify-between items-center z-50">
        <button 
          onClick={() => router.push('/')} 
          className="flex flex-col items-center text-slate-300 hover:text-slate-400 transition"
        >
          <Home size={26} />
          <span className="text-[9px] font-black uppercase">Home</span>
        </button>
        
        <button 
          onClick={() => router.push('/stats')} 
          className="flex flex-col items-center text-slate-300 hover:text-slate-400 transition"
        >
          <PieChart size={28} />
          <span className="text-[9px] font-black uppercase">Dashboard</span>
        </button>
        
        <button className="flex flex-col items-center text-blue-600">
          <Settings size={26} />
          <span className="text-[9px] font-black uppercase">Menu</span>
        </button>
      </footer>
    </div>
  )
}