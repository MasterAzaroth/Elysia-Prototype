"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, ChartPie, ListTree, CircleUser, Plus, Hamburger, Dumbbell } from "lucide-react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const getLinkClass = (path) => {

    const isActive = pathname === path; 
    
    const baseClasses = "flex flex-col items-center justify-center w-16 h-full transition-colors group";
    
    const activeClasses = "text-white";
    const inactiveClasses = "text-gray-400 hover:text-white";

    return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
  };

  return (
    <div className="absolute bottom-0 left-0 w-full z-50 pointer-events-none">
      <div className="relative w-full h-20 bg-neutral-900 border-t border-white/10 pointer-events-auto flex items-center justify-between px-6 pb-2">

        <Link
          className={getLinkClass("/dictionary")}
          href="/dictionary"
        >
          <BookOpenText className="w-6 h-6 mb-1 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[10px] font-medium">Learning</span>
        </Link>

        <Link
          className={getLinkClass("/dashboardTraining")}
          href="/dashboardTraining"
        >
          <ChartPie className="w-6 h-6 mb-1 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[10px] font-medium">Analytics</span>
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 -top-8">
          <button
            onClick={() => setIsOpen((prev) => !prev)}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center shadow-lg 
              hover:scale-105 transition-transform active:scale-95 pointer-events-auto
              ${isOpen ? "bg-brand-purple2" : "bg-brand-purple1"}
              text-white
            `}
          >

            <Plus className={`w-8 h-8 transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`} strokeWidth={3} />
          </button>

          {isOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 -top-40 w-64 h-32 rounded-3xl bg-brand-purple1 border border-white/10 shadow-xl pointer-events-auto flex p-4 gap-4">
              <Link 
                className={`w-1/2 h-full rounded-3xl flex flex-col justify-center items-center text-lg transition-colors ${pathname === '/trackingNutrition' ? 'bg-white text-brand-purple1' : 'bg-brand-purple2 text-white'}`} 
                onClick={() => setIsOpen(false)} 
                href="/trackingNutrition"
              >
                <Hamburger className="w-8 h-8 mb-2" />
                <p>Nutrition</p>
              </Link>
              <Link 
                className={`w-1/2 h-full rounded-3xl flex flex-col justify-center items-center text-lg transition-colors ${pathname === '/trackingTraining' ? 'bg-white text-brand-purple1' : 'bg-brand-purple2 text-white'}`}
                onClick={() => setIsOpen(false)} 
                href="/trackingTraining"
              >
                <Dumbbell className="w-8 h-8 mb-2" />
                <p>Training</p>
              </Link>
            </div>
          )}
        </div>

        <Link
          className={`${getLinkClass("/overviewNutrition")} ml-6`}
          href="/overviewNutrition"
        >
          <ListTree className="w-6 h-6 mb-1 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[10px] font-medium">Data Logs</span>
        </Link>

        <Link
          className={getLinkClass("/profile")}
          href="/profile"
        >
          <CircleUser className="w-6 h-6 mb-1 group-hover:-translate-y-0.5 transition-transform" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
}