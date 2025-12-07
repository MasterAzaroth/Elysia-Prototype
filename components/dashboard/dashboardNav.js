"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function DNav() {
    const pathname = usePathname();

    const isTraining = pathname === "/dashboardTraining";
    const isNutrition = pathname === "/dashboardNutrition";
    const isConsistency = pathname === "/dashboardConsistency";

    const baseClasses =
        "w-1/3 rounded-full p-4 flex justify-center cursor-pointer transition-colors";

    return (
        <div className="w-full h-auto bg-brand-grey2 rounded-full flex p-3 justify-between">

            <Link
                href="/dashboardTraining"
                className={`${baseClasses} mr-2 ${isTraining ? "bg-brand-purple1" : ""}`}
            >
                <p>Training</p>
            </Link>

            <Link
                href="/dashboardNutrition"
                className={`${baseClasses} mx-2 ${isNutrition ? "bg-brand-purple1" : ""}`}
            >
                <p>Nutrition</p>
            </Link>

            <Link
                href="/dashboardConsistency"
                className={`${baseClasses} ml-2 ${isConsistency ? "bg-brand-purple1" : ""}`}
            >
                <p>Consistency</p>
            </Link>

        </div>
    );
}
