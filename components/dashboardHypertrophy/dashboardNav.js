"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DNav() {
    const router = useRouter();

    const [active, setActive] = useState("hypertrophy");

    function handleClick(tab, path) {
        setActive(tab);
        router.push(path);
    }

    const baseClasses = "w-1/3 rounded-full p-4 flex justify-center cursor-pointer transition-colors";

    return (
        <div className="w-full h-auto bg-brand-grey2 rounded-full flex p-3 justify-between">

            <button
                onClick={() => handleClick("hypertrophy", "/hypertrophy")}
                className={`
                    ${baseClasses} mr-2
                    ${active === "hypertrophy" ? "bg-brand-purple1" : ""}
                `}
            >
                <p>Hypertrophy</p>
            </button>

            <button
                onClick={() => handleClick("strength", "/strength")}
                className={`
                    ${baseClasses} mx-2
                    ${active === "strength" ? "bg-brand-purple1" : ""}
                `}
            >
                <p>Strength</p>
            </button>

            <button
                onClick={() => handleClick("consistency", "/consistency")}
                className={`
                    ${baseClasses} ml-2
                    ${active === "consistency" ? "bg-brand-purple1" : ""}
                `}
            >
                <p>Consistency</p>
            </button>
        </div>
    );
}
