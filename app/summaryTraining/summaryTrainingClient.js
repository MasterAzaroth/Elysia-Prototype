"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Lock, Plus } from "lucide-react";

const CURRENT_KEY = "elysia_current_workout";

export default function SummaryTrainingClient({ initialLog }) {
  const router = useRouter();
  const [log, setLog] = useState(initialLog);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(CURRENT_KEY);
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);

      if (parsed.originalLogId !== initialLog._id) {
        return;
      }

      if (parsed.exercises && Array.isArray(parsed.exercises)) {
        
        const normalizedExercises = parsed.exercises.map((ex) => {
          const base = {
            ...ex,
            title: ex.title || "Untitled Exercise",
            muscle: ex.muscle || "",
            imageSrc: ex.imageSrc || "/Muscle/Upper%20Body/Chest.png",
          };

          if (Array.isArray(ex.sets) && ex.sets.length > 0) {
            const normalizedSets = ex.sets.map((s, idx) => ({
              ...s,
              type: ["Warm-Up Set", "Working Set", "Failure Set"].includes(s.type)
                ? s.type
                : "Working Set",
              weight: s.weight ?? "",
              reps: s.reps ?? "",
            }));
            return { ...base, sets: normalizedSets };
          }

          return {
            ...base,
            sets: [
              {
                type: "Working Set",
                weight: "",
                reps: "",
              },
            ],
          };
        });

        setLog((prev) => ({
          ...prev,
          workoutTitle: parsed.title || prev.workoutTitle,
          exercises: normalizedExercises,
        }));
        setIsDirty(true);
      }
    } catch (err) {
      console.error("Failed to parse draft from localStorage:", err);
    }
  }, [initialLog._id]); 

  const dateObj = log.date ? new Date(log.date) : new Date();
  const date = dateObj.toLocaleDateString("de-DE");

  async function saveChanges() {
    if (saving) return;
    const exercisesToSave = log.exercises || [];
    setSaving(true);
    setError(null);
    setIsDirty(false);

    try {
      const res = await fetch(`/api/exerciseLogs/${log._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workoutTitle: log.workoutTitle,
          exercises: exercisesToSave,
          userId: log.userId,
        }),
      });

      if (!res.ok) throw new Error("Failed to save changes");
      const updated = await res.json();

      if (typeof window !== "undefined") {
        window.localStorage.removeItem(CURRENT_KEY);
      }

      setLog((prev) => ({
        ...prev,
        workoutTitle: updated.workoutTitle ?? prev.workoutTitle,
        exercises: updated.exercises ?? exercisesToSave,
      }));
    } catch (err) {
      console.error(err);
      setIsDirty(true);
      setError("Fehler beim Speichern.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteWorkout() {
    if (!window.confirm("Delete this entire workout? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/exerciseLogs/${log._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete workout");
      
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(CURRENT_KEY);
      }

      router.push("/overviewTraining");
      router.refresh();
    } catch (err) {
      console.error(err);
      setError("Could not delete workout.");
      setDeleting(false);
    }
  }

  function openExerciseSearch(insertIndex) {
    if (typeof window !== "undefined") {
      const payload = {
        title: log.workoutTitle,
        exercises: log.exercises || [],

        originalLogId: log._id 
      };
      window.localStorage.setItem(CURRENT_KEY, JSON.stringify(payload));
    }

    const base = "/exerciseSearch";
    if (typeof insertIndex === "number" && Number.isFinite(insertIndex) && insertIndex >= 0) {
      router.push(`${base}?insertIndex=${insertIndex}`);
    } else {
      router.push(base);
    }
  }

  function updateTitle(newTitle) {
    setLog((prev) => ({ ...prev, workoutTitle: newTitle }));
    setIsDirty(true);
  }

  function updateSet(exIndex, setIndex, field, rawValue) {
    const value = (field === "weight" || field === "reps")
      ? (rawValue === "" ? "" : Number(rawValue))
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

  function handleAddSet(exIndex) {
    const updatedExercises = (log.exercises || []).map((ex, i) => {
      if (i !== exIndex) return ex;
      const newSet = { type: "Working Set", weight: "", reps: "" };
      return { ...ex, sets: [...(ex.sets || []), newSet] };
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
    if (!window.confirm("Remove this exercise?")) return;
    const updatedExercises = (log.exercises || []).filter((_, i) => i !== exIndex);
    setLog((prev) => ({ ...prev, exercises: updatedExercises }));
    setIsDirty(true);
  }

  const actionButtonBase = "px-6 py-3 rounded-full text-sm font-bold active:scale-95 transition flex items-center justify-center";
  const saveButtonState = isDirty
    ? "bg-brand-purple1 text-white shadow-lg shadow-brand-purple1/20"
    : "bg-transparent border border-brand-purple1 text-brand-purple1/60 cursor-not-allowed";

  const AddExerciseDivider = ({ index }) => (
    <div className="w-full flex items-center justify-center my-4 relative group">
      <div className="absolute w-full h-[1px] bg-brand-purple1/30 group-hover:bg-brand-purple1/60 transition-colors" />
      <button
        type="button"
        onClick={() => openExerciseSearch(index)}
        className="relative z-10 w-12 h-12 rounded-full bg-brand-purple1 flex items-center justify-center shadow-md border-4 border-[#121212] transition-colors"
        title="Search & Add Exercise Here"
      >
        <Plus size={24} className="text-white" />
      </button>
    </div>
  );

  return (
    <div className="w-full min-h-screen py-4 flex flex-col gap-4">
      
      <div className="w-full flex flex-col gap-1 px-2">
        <div className="flex items-baseline justify-between gap-4">
          <input
            type="text"
            value={log.workoutTitle || ""}
            onChange={(e) => updateTitle(e.target.value)}
            placeholder="Workout Title"
            className="flex-1 bg-transparent text-3xl font-semibold text-white outline-none placeholder:text-brand-grey4 border-b border-brand-grey4 focus:border-brand-purple1 transition-colors pb-1"
          />
          <p className="text-xs text-brand-grey4 whitespace-nowrap">{date}</p>
        </div>
        {saving && <p className="text-xs text-brand-grey4">Saving…</p>}
        {error && <p className="text-xs text-red-400">{error}</p>}
      </div>

      <div className="w-full h-[1px] bg-brand-grey3" />

      <div className="w-full flex flex-col px-2 pb-10">
        
        <AddExerciseDivider index={0} />

        {(log.exercises || []).map((ex, idx) => (
          <div key={`${ex.title || "exercise"}-${idx}`} className="flex flex-col">
            
            <div className="w-full h-auto bg-brand-grey2 p-3 rounded-2xl flex flex-col gap-3">
              
              <div className="flex mb-1 items-center gap-3">
                <img
                  src={ex.imageSrc || "/Muscle/Upper%20Body/Chest.png"}
                  alt={ex.muscle || "exercise"}
                  className="w-20 h-20 mr-1 object-contain"
                />
                <div className="flex-1 flex flex-col justify-center">
                  <h2 className="text-xl mb-1">{ex.title || "Exercise"}</h2>
                  <h3 className="text-brand-grey4 text-lg">{ex.muscle || "—"}</h3>
                </div>
                
                <button
                  type="button"
                  onClick={() => handleDeleteExercise(idx)}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-brand-purple1 hover:opacity-80 active:scale-95 transition shadow-md shadow-brand-purple1/20"
                >
                  <Trash2 size={18} className="text-white" />
                </button>


              </div>

              <div className="flex flex-col gap-2">
                {(ex.sets || []).map((set, setIndex) => (
                  <div key={setIndex} className="w-full h-auto p-2 flex items-center gap-2 bg-brand-grey3 rounded-full">
                    <div className="w-8 h-8 rounded-full bg-brand-purple1 flex justify-center items-center">
                      <p>{setIndex + 1}</p>
                    </div>

                    <div className="h-8 bg-brand-grey4 flex items-center rounded-full px-3">
                      <select
                        className="bg-transparent text-sm outline-none"
                        value={set.type || "Working Set"}
                        onChange={(e) => updateSet(idx, setIndex, "type", e.target.value)}
                      >
                        <option value="Warm-Up Set">Warm-Up Set</option>
                        <option value="Working Set">Working Set</option>
                        <option value="Failure Set">Failure Set</option>
                      </select>
                    </div>

                    <div className="h-8 flex items-center bg-brand-grey4 rounded-full text-xs px-2">
                      <div className="flex items-center gap-1 px-1">
                        <input
                          type="number"
                          className="w-9 text-center bg-transparent outline-none"
                          value={set.weight ?? ""}
                          onChange={(e) => updateSet(idx, setIndex, "weight", e.target.value)}
                          placeholder="0"
                        />
                        <p>kg</p>
                      </div>
                      <div className="w-[1px] h-6 bg-brand-grey3" />
                      <div className="flex items-center gap-1 px-1">
                        <input
                          type="number"
                          className="w-8 text-center bg-transparent outline-none"
                          value={set.reps ?? ""}
                          onChange={(e) => updateSet(idx, setIndex, "reps", e.target.value)}
                          placeholder="0"
                        />
                        <p>Reps</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`ml-auto w-8 h-8 flex items-center justify-center rounded-full ${
                        setIndex === 0 ? "bg-brand-grey3 cursor-default" : "bg-brand-purple1 hover:opacity-80 transition"
                      }`}
                      onClick={setIndex === 0 ? undefined : () => handleDeleteSet(idx, setIndex)}
                    >
                      {setIndex === 0 ? <Lock size={16} className="text-brand-grey4" /> : <Trash2 size={16} className="text-white" />}
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => handleAddSet(idx)}
                  className="w-full py-2 mt-1 rounded-full border border-dashed border-brand-grey4 text-brand-grey4 text-xs hover:border-brand-purple1 hover:text-brand-purple1 transition flex items-center justify-center gap-1"
                >
                  <Plus size={14} /> Add Set
                </button>
              </div>
            </div>

            <AddExerciseDivider index={idx + 1} />
            
          </div>
        ))}

        {(!log.exercises || log.exercises.length === 0) && (
          <p className="text-sm text-brand-grey4 text-center py-4">
            No exercises logged. Click the + button above to start.
          </p>
        )}

        <div className="w-full flex flex-col gap-10 mt-8">
          <div className="flex justify-between items-center gap-4">
            <Link
              href="/overviewTraining"
              className={`${actionButtonBase} flex-1 bg-brand-grey3 text-white hover:bg-brand-grey4`}
            >
              Cancel
            </Link>

            <button
              type="button"
              disabled={!isDirty || saving}
              onClick={saveChanges}
              className={`${actionButtonBase} flex-1 ${saveButtonState}`}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>

          <button
            onClick={handleDeleteWorkout}
            disabled={deleting}
            className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 text-base font-medium hover:bg-red-500/20 active:scale-95 transition flex items-center justify-center gap-2"
          >
            {deleting ? (
              "Deleting..."
            ) : (
              <>
                <Trash2 size={18} />
                Delete Entire Workout
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}