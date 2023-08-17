'use client'
 import Link from 'next/link'
import { usePathname } from 'next/navigation'
 import { Home,HeartPulse,Baby,CircleDollarSign } from "lucide-react";

export default function FloatingNavbar() {
 const pathname = usePathname()
  return (
    <>
      <div className="fixed md:hidden bottom-0 left-0 right-0 flex items-center justify-evenly py-2 border-t bg-background z-40">
        <Link href="/" className={`flex flex-col items-center ${pathname === '/' ?'font-semibold':''}`}>
          <Home className={`w-[20px] h-[20px] ${pathname === '/' ? 'stroke-[2]':'stroke-[1.5]'}`} />
          <span className="text-xs">Home</span>
        </Link>
         <Link href="/pasien" className={`flex flex-col items-center ${pathname === '/pasien' ?'font-semibold':''}`}>
          <Baby className={`w-[20px] h-[20px] ${pathname === '/pasien' ? 'stroke-[2]':'stroke-[1.5]'}`}  />
          <span className="text-xs">Patient</span>
        </Link>
        <Link href="/keuangan" className={`flex flex-col items-center ${pathname === '/keuangan' ?'font-semibold':''}`}>
          <CircleDollarSign className={`w-[20px] h-[20px] ${pathname === '/keuangan' ? 'stroke-[2]':'stroke-[1.5]'}`}  />
          <span className="text-xs">Tabungan</span>
        </Link>
        <div className="flex flex-col items-center">
          <HeartPulse className="w-[20px] h-[20px] stroke-[1.5]" />
          <span className="text-xs">Uks</span>
        </div>
      </div>
    </>
  );
}
