"use client";

import { useState } from "react";
import { Trash2, Lock } from "lucide-react";

export default function SetCard({ setCount = 1, onDelete, isDeletable = true }) {
  const [value, setValue] = useState("Working Set");
  const [reps, setReps] = useState("");

  function handleRepsChange(e) {
    let val = e.target.value;

    if (val === "") {
      setReps("");
      return;
    }

    if (val.length > 3) val = val.slice(0, 3);
    if (Number(val) < 0) val = "0";

    setReps(val);
  }

  return (
    <div className="w-full h-auto p-2 flex bg-brand-grey3 rounded-full items-center justify-between">

      <div className="w-8 h-8 rounded-full p-1 bg-brand-purple1 flex justify-center items-center">
        <p>{setCount}</p>
      </div>

      <div className="w-32 h-8 bg-brand-grey4 py-1 px-2 flex items-center gap-2 rounded-full">
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-full bg-transparent text-sm focus:outline-none"
        >
          <option value="Warm-Up Set">Warm-Up Set</option>
          <option value="Working Set">Working Set</option>
        </select>
      </div>

      <div className="flex items-center bg-brand-grey4 rounded-full px-3 gap-2 text-sm">
        <input
          type="number"
          min="0"
          value={reps}
          onChange={handleRepsChange}
          className="no-spinner w-10 bg-transparent text-center focus:outline-none"
          placeholder="0"
        />

        <div className="w-1 h-8 bg-brand-grey3" />

        <p>Reps</p>
      </div>

      {isDeletable ? (
        <button
          onClick={() => onDelete?.(setCount)}
          className="w-8 h-8 rounded-full p-1 bg-brand-purple1 flex justify-center items-center active:scale-90"
        >
          <Trash2 size={20} />
        </button>
      ) : (
        <div className="w-8 h-8 rounded-full p-1 bg-brand-grey4 flex justify-center items-center">
          <Lock size={18} />
        </div>
      )}
    </div>
  );
}