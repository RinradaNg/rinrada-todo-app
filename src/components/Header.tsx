'use client'

import { useRouter } from 'next/navigation'

export default function Header() {

const router = useRouter()

return (

<nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-100 px-5 pt-12 pb-3 flex justify-between items-center">

<div>

<h1 className="text-lg font-black tracking-tight text-slate-800">
TaskMaster
</h1>

<p className="text-[9px] font-bold text-blue-600 tracking-widest uppercase">
Vanness Plus
</p>

</div>

<button
onClick={()=>router.push('/profile')}
className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center font-black text-white text-[10px] active:scale-95 transition"
>

RN

</button>

</nav>

)

}