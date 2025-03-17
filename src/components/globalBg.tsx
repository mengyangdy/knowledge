'use client';
import {useTheme} from 'next-themes'
import { useEffect, useState } from 'react'

export default function GlobalBg(){
  const {theme}=useTheme()
  const [mounted,setMounted]=useState(false)

  useEffect(()=>{
    setMounted(true)
  })
  return (
    <div className={`z-[-1] absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] ${theme === 'dark' && mounted?'[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]':'[mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]'}`} />
  )
}