"use client";

import { useState } from "react";
import SetCard from "@/components/trackingTraining/setCard.js";
import { Trash2, Plus } from "lucide-react";

export default function TrackingTrainingCard({ title, muscle }) {
  const [sets, setSets] = useState([1]);

  function handleAddSet() {
    setSets((prev) => [...prev, prev.length + 1]);
  }

  function handleDeleteSet(setNumber) {

    if (setNumber === 1) return;

    const filtered = sets.filter((n) => n !== setNumber);

    const renumbered = filtered.map((_, i) => i + 1);
    setSets(renumbered);
  }

  return (
    <div className="w-full h-auto bg-brand-grey2 p-3 rounded-2xl flex flex-col gap-3">

      <div className="flex mb-1">
        <img
          src="/Muscles/Upper Body/Chest.png"
          alt={muscle}
          className="w-20 h-20 mr-4"
        />
        <div className="w-full h-auto flex flex-col justify-center">
          <h1 className="text-xl mb-1">{title}</h1>
          <h2 className="text-brand-grey4 text-lg">{muscle}</h2>
        </div>
        <div className="w-10 h-10 bg-brand-purple1 rounded-full p-2 flex items-center justify-center">
          <Trash2 />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {sets.map((setNumber) => (
          <SetCard
            key={setNumber}
            setCount={setNumber}
            isDeletable={setNumber !== 1}
            onDelete={handleDeleteSet}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddSet}
        className="mt-1 self-start flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple1 text-sm active:scale-95"
      >
        <Plus size={16} />
        <span>Add Set</span>
      </button>
    </div>
  );
}
