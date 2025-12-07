"use client";

import { useState } from "react";
import Link from "next/link";
import { Trash2, Lock } from "lucide-react";

export default function SummaryTrainingClient({ initialLog }) {
  const [log, setLog] = useState(initialLog);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const dateObj = log.date ? new Date(log.date) : new Date();
  const date = dateObj.toLocaleDateString("de-DE");

  async function saveExercises() {
    if (saving) return;

    const exercisesToSave = log.exercises || [];

    setSaving(true);
    setError(null);
    setIsDirty(false);

    try {
      const res = await fetch(`/api/exerciseLogs/${log._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exercises: exercisesToSave }),
      });

      if (!res.ok) {
        let serverError = "Failed to save changes";

        try {
          const data = await res.json();
          if (data?.error) serverError = data.error;
          console.error("Save error details:", data);
        } catch {}

        setIsDirty(true);
        setError(serverError);
        return;
      }

      const updated = await res.json();

      setLog((prev) => ({
        ...prev,
        exercises: updated.exercises ?? exercisesToSave,
      }));
    } catch (err) {
      console.error(err);
      setIsDirty(true);
      setError("Fehler beim Speichern. Versuche es nochmal.");
    } finally {
      setSaving(false);
    }
  }

  function updateSet(exIndex, setIndex, field, rawValue) {
    const value =
      field === "weight"
        ? rawValue === ""
          ? ""
          : Number(rawValue)
        : field === "reps"
        ? rawValue === ""
          ? ""
          : Number(rawValue)
        : rawValue;

    const updatedExercises = (log.exercises || []).map((ex, i) => {
      if (i !== exIndex) return ex;

      const updatedSets = (ex.sets || []).map((set, j) => {
        if (j !== setIndex) return set;
        return { ...set, [field]: value };
      });

      return { ...ex, sets: updatedSets };
    });

    setLog((prev) => ({ ...prev, exercises: updatedExercises }));
    setIsDirty(true);
  }

  function handleDeleteSet(exIndex, setIndex) {
    const updatedExercises = (log.exercises || []).map((ex, i) => {
      if (i !== exIndex) return ex;

      const updatedSets = (ex.sets || []).filter((_, j) => j !== setIndex);

      return { ...ex, sets: updatedSets };
    });

    setLog((prev) => ({ ...prev, exercises: updatedExercises }));
    setIsDirty(true);
  }

  function handleDeleteExercise(exIndex) {
    const updatedExercises = (log.exercises || []).filter(
      (_, i) => i !== exIndex
    );

    setLog((prev) => ({ ...prev, exercises: updatedExercises }));
    setIsDirty(true);
  }

  const saveButtonBase =
    "px-4 py-2 rounded-full border text-sm font-medium active:scale-95 transition";

  const saveButtonState = isDirty
    ? "bg-brand-purple1 border-brand-purple1 text-white cursor-pointer"
    : "bg-transparent border-brand-purple1 text-brand-purple1/60 cursor-not-allowed";

  return (
    <div className="w-full min-h-screen py-4 flex flex-col gap-4">
      <div className="w-full flex flex-col gap-1 px-2">
        <div className="flex items-baseline justify-between">
          <h1 className="text-3xl font-semibold text-white">
            {log.workoutTitle || "Untitled Workout"}
          </h1>
          <p className="text-xs text-brand-grey4">{date}</p>
        </div>

        {saving && <p className="text-xs text-brand-grey4">Saving…</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      <div className="w-full h-[1px] bg-brand-grey3" />

      <div className="w-full flex flex-col gap-4 px-2 pb-10">
        {(log.exercises || []).map((ex, idx) => (
          <div
            key={`${ex.title || "exercise"}-${idx}`}
            className="w-full h-auto bg-brand-grey2 p-3 rounded-2xl flex flex-col gap-3"
          >

            <div className="flex mb-1 items-center gap-3">
              <img
                src={ex.imageSrc || "/Muscle/Upper%20Body/Chest.png"}
                alt={ex.muscle || ex.title || "exercise"}
                className="w-20 h-20 mr-1 object-contain"
              />

              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-xl mb-1">{ex.title || "Exercise"}</h2>
                <h3 className="text-brand-grey4 text-lg">
                  {ex.muscle || "—"}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteExercise(idx)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-grey3 hover:bg-brand-grey4 active:scale-95 transition"
              >
                <Trash2 size={18} className="text-brand-grey4" />
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {(ex.sets || []).map((set, setIndex) => (
                <div
                  key={setIndex}
                  className="w-full h-auto p-2 flex items-center gap-2 bg-brand-grey3 rounded-full"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-purple1 flex justify-center items-center">
                    <p>{setIndex + 1}</p>
                  </div>

                  <div className="h-8 bg-brand-grey4 flex items-center rounded-full px-3">
                    <select
                      className="bg-transparent text-sm outline-none"
                      value={set.type || "Working Set"}
                      onChange={(e) =>
                        updateSet(idx, setIndex, "type", e.target.value)
                      }
                    >
                      <option value="Warm-Up Set">Warm-Up Set</option>
                      <option value="Working Set">Working Set</option>
                    </select>
                  </div>

                  <div className="h-8 flex items-center bg-brand-grey4 rounded-full text-xs px-2">
                    <div className="flex items-center gap-1 px-1">
                      <input
                        type="number"
                        className="w-9 text-center bg-transparent outline-none"
                        value={set.weight ?? ""}
                        onChange={(e) =>
                          updateSet(idx, setIndex, "weight", e.target.value)
                        }
                      />
                      <p>kg</p>
                    </div>

                    <div className="w-[1px] h-6 bg-brand-grey3" />

                    <div className="flex items-center gap-1 px-1">
                      <input
                        type="number"
                        className="w-8 text-center bg-transparent outline-none"
                        value={set.reps ?? ""}
                        onChange={(e) =>
                          updateSet(idx, setIndex, "reps", e.target.value)
                        }
                      />
                      <p>Reps</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`ml-auto w-8 h-8 flex items-center justify-center rounded-full ${
                      setIndex === 0
                        ? "bg-brand-grey3 cursor-default"
                        : "bg-brand-purple1 hover:opacity-80 transition"
                    }`}
                    onClick={
                      setIndex === 0
                        ? undefined
                        : () => handleDeleteSet(idx, setIndex)
                    }
                  >
                    {setIndex === 0 ? (
                      <Lock size={16} className="text-brand-grey4" />
                    ) : (
                      <Trash2 size={16} className="text-white" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}

        {(!log.exercises || log.exercises.length === 0) && (
          <p className="text-sm text-brand-grey4">
            No exercises logged for this workout.
          </p>
        )}

        <div className="w-full flex justify-between mt-2 px-1">
          <Link
            href="/overviewTraining"
            className="px-4 py-2 rounded-full bg-brand-purple1 text-sm font-medium active:scale-95"
          >
            Back to Overview
          </Link>

          <button
            type="button"
            disabled={!isDirty || saving}
            onClick={saveExercises}
            className={`${saveButtonBase} ${saveButtonState}`}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
