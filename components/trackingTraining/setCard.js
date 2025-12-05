"use client";

import { Trash2, Lock } from "lucide-react";

export default function SetCard({
  setCount = 1,
  type = "Working Set",
  weight = "",
  reps = "",
  isDeletable = true,
  onDelete,
  onChangeType,
  onChangeWeight,
  onChangeReps,
}) {
  function handleRepsChange(e) {
    let val = e.target.value;

    if (val === "") {
      onChangeReps?.("");
      return;
    }

    val = val.replace(/\D/g, "");
    if (val.length > 3) val = val.slice(0, 3);
    if (Number(val) < 0) val = "0";

    onChangeReps?.(val);
  }

  function handleWeightChange(e) {
    let val = e.target.value;

    if (val === "") {
      onChangeWeight?.("");
      return;
    }

    val = val.replace(/\D/g, "");
    if (val.length > 3) val = val.slice(0, 3);
    if (Number(val) < 0) val = "0";

    onChangeWeight?.(val);
  }

  function handleTypeChange(e) {
    const val = e.target.value;
    onChangeType?.(val);
  }

  return (
    <div className="w-full h-auto p-2 flex items-center gap-2 bg-brand-grey3 rounded-full">
      <div className="w-8 h-8 rounded-full bg-brand-purple1 flex justify-center items-center">
        <p>{setCount}</p>
      </div>

      <div className="h-8 bg-brand-grey4 flex items-center rounded-full px-3">
        <select
          value={type}
          onChange={handleTypeChange}
          className="w-full h-full bg-transparent text-sm focus:outline-none"
        >
          <option value="Warm-Up Set">Warm-Up Set</option>
          <option value="Working Set">Working Set</option>
        </select>
      </div>

      <div className="h-8 flex items-center bg-brand-grey4 rounded-full text-xs px-2">
        <div className="flex items-center gap-1 px-1">
          <input
            type="number"
            min="0"
            value={weight}
            onChange={handleWeightChange}
            className="no-spinner w-9 bg-transparent text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
          />
          <p>kg</p>
        </div>

        <div className="w-[1px] h-6 bg-brand-grey3" />

        <div className="flex items-center gap-1 px-1">
          <input
            type="number"
            min="0"
            value={reps}
            onChange={handleRepsChange}
            className="no-spinner w-8 bg-transparent text-center focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            placeholder="0"
          />
          <p>Reps</p>
        </div>
      </div>

      {isDeletable ? (
        <button
          onClick={onDelete}
          className="ml-auto w-8 h-8 rounded-full p-1 bg-brand-purple1 flex justify-center items-center active:scale-90"
        >
          <Trash2 size={20} />
        </button>
      ) : (
        <div className="ml-auto w-8 h-8 rounded-full p-1 bg-brand-grey4 flex justify-center items-center">
          <Lock size={18} />
        </div>
      )}
    </div>
  );
}
