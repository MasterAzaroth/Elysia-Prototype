"use client";

import { useState } from "react";
import { Plus, Check } from "lucide-react";

export default function ExerciseCard({
  title = "Exercise Name",
  muscle = "",
  imageSrc = "/Muscle/Upper%20Body/Chest.png",
  onConfirm,
}) {
  const [sets, setSets] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  function handleSetsChange(e) {
    let val = e.target.value;

    if (val === "") {
      setSets("");
      return;
    }

    val = val.replace(/\D/g, "");

    if (val.length > 2) val = val.slice(0, 2);
    if (Number(val) > 99) val = "99";

    setSets(val);
  }

  function handleConfirm() {
    if (sets === "") return;

    const setsCount = Number(sets);
    if (!setsCount || setsCount <= 0) return;

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

      <div className="w-auto h-10 flex items-center rounded-full ml-auto bg-transparent border-2 border-brand-purple1 self-center gap-2">
        <div className="w-auto flex justify-between items-center text-sm font-medium text-white">
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max="99"
            value={sets}
            onChange={handleSetsChange}
            className="w-10 bg-transparent text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="ml-2">Sets</span>
        </div>

        <button
          type="button"
          onClick={handleConfirm}
          className="h-full aspect-square rounded-full bg-brand-purple1 flex items-center justify-center text-white cursor-pointer transition active:scale-95"
        >
          {confirmed ? (
            <Check size={18} strokeWidth={2.5} />
          ) : (
            <Plus size={18} strokeWidth={2.5} />
          )}
        </button>
      </div>
    </div>
  );
}
