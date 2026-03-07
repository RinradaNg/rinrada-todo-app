'use client'

import { useRouter } from 'next/navigation'

export default function Header() {

const router = useRouter()

return (

<nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100 px-6 pt-14 pb-5 flex justify-between items-center">

<div>

<h1 className="text-xl font-black tracking-tight text-slate-800">
TaskMaster
</h1>

<p className="text-[10px] font-bold text-blue-600 tracking-widest uppercase mt-0.5">
Vanness Plus
</p>

</div>

<button
onClick={()=>router.push('/profile')}
className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white text-[11px] active:scale-95 transition"
>

RN

</button>

</nav>

)

}