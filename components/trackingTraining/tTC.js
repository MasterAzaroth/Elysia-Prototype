"use client";

import SetCard from "@/components/trackingTraining/setCard.js";
import { Trash2, Plus } from "lucide-react";

export default function TrackingTrainingCard({
  title,
  muscle,
  imageSrc = "/Muscle/Upper%20Body/Chest.png",
  sets = [],
  onDeleteExercise,
  onAddSet,
  onDeleteSet,
  onChangeSetType,
  onChangeSetWeight,
  onChangeSetReps,
}) {
  return (
    <div className="w-full h-auto bg-brand-grey2 p-3 rounded-2xl flex flex-col gap-3">

      <div className="flex mb-1 items-center gap-3">
        <img
          src={imageSrc}
          alt={muscle}
          className="w-20 h-20 mr-1 object-contain"
        />

        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-xl mb-1">{title}</h1>
          <h2 className="text-brand-grey4 text-lg">{muscle}</h2>
        </div>

        <button
          type="button"
          onClick={onDeleteExercise}
          className="w-10 h-10 bg-brand-purple1 rounded-full p-2 flex items-center justify-center active:scale-95"
        >
          <Trash2 className="text-white" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {sets.map((set, index) => (
          <SetCard
            key={set.id}
            setCount={index + 1}
            type={set.type}
            weight={set.weight}
            reps={set.reps}
            isDeletable={index !== 0}
            onDelete={() => onDeleteSet(set.id)}
            onChangeType={(val) => onChangeSetType(set.id, val)}
            onChangeWeight={(val) => onChangeSetWeight(set.id, val)}
            onChangeReps={(val) => onChangeSetReps(set.id, val)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onAddSet}
        className="w-full py-2 mt-1 rounded-full border border-dashed border-brand-grey4 text-brand-grey4 text-xs hover:border-brand-purple1 hover:text-brand-purple1 transition flex items-center justify-center gap-1"
      >
        <Plus size={14} /> Add Set
      </button>
    </div>
  );
}