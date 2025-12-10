"use client";

import { useState } from "react";
import { Plus, Check, AlertCircle } from "lucide-react";

export default function ExerciseCard({
  title = "Exercise Name",
  muscle = "",
  imageSrc = "/Muscle/Upper%20Body/Chest.png",
  onConfirm,
}) {
  const [sets, setSets] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const [isError, setIsError] = useState(false); 
  const [isShaking, setIsShaking] = useState(false);

  function handleSetsChange(e) {

    if (isError) setIsError(false);

    let val = e.target.value;
    val = val.replace(/\D/g, "");

    if (val === "") {
      setSets("");
      return;
    }

    if (val.length > 2) val = val.slice(0, 2);
    if (Number(val) > 99) val = "99";

    setSets(val);
  }

  function handleConfirm() {
    const setsCount = Number(sets);

    if (sets === "" || !setsCount || setsCount <= 0) {
      setIsError(true);
      
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
      return;
    }

    setConfirmed(true);

    if (onConfirm) {
      onConfirm({
        title,
        muscle,
        imageSrc,
        setsCount,
      });
    }
  }

  return (
    <div className="w-full h-full bg-brand-grey2 rounded-3xl p-2 flex items-center">
      <img
        src={imageSrc}
        alt={title}
        className="w-16 h-16 mr-4 object-contain"
      />

      <div className="flex flex-col justify-center mr-4">
        <p className="text-lg font-semibold text-white">{title}</p>
        {muscle && (
          <p className="text-xs text-brand-grey4 mt-1">{muscle}</p>
        )}
      </div>

      <div 
        className={`
          w-auto h-10 flex items-center rounded-full ml-auto bg-transparent border-2 self-center gap-2 transition-colors duration-200
          ${isError ? "border-red-500" : "border-brand-purple1"}
          ${isShaking ? "animate-shake" : ""}
        `}
      >
        <div className={`w-auto flex justify-between items-center text-sm font-medium transition-colors ${isError ? "text-red-500" : "text-white"}`}>

          <input
            type="text"
            inputMode="numeric"
            value={sets}
            onChange={handleSetsChange}
            onClick={(e) => e.stopPropagation()}
            placeholder="0"
            className={`
              w-10 bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none placeholder:text-neutral-600
              ${isError ? "text-red-500 placeholder:text-red-500/50" : ""}
            `}
          />
          
          {isError ? (
            <div className="ml-2 flex items-center justify-center w-8">
               <AlertCircle size={18} strokeWidth={2.5} />
            </div>
          ) : (
            <span className="ml-2 w-8 text-left">Sets</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className={`
            h-full aspect-square rounded-full flex items-center justify-center text-white cursor-pointer transition active:scale-95
            ${isError ? "bg-red-500" : "bg-brand-purple1"}
          `}
        >
          {confirmed ? (
            <Check size={18} strokeWidth={2.5} />
          ) : (
            <Plus size={18} strokeWidth={2.5} />
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
    </div>
  );
}