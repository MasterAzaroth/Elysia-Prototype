"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import TrackingTrainingCard from "@/components/trackingTraining/tTC.js";

const CURRENT_KEY = "elysia_current_workout";
const SAVED_KEY = "elysia_saved_workouts";

export default function TrackingTrainingPage() {
  const [workoutTitle, setWorkoutTitle] = useState("");
  const [exercises, setExercises] = useState([]);

  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(CURRENT_KEY);

    if (!stored) {
      setIsLoaded(true);
      return;
    }

    try {
      const parsed = JSON.parse(stored);

      let title = "";
      let exArray = [];

      if (Array.isArray(parsed)) {

        exArray = parsed;
      } else if (parsed && typeof parsed === "object") {

        title = parsed.title || "";
        exArray = Array.isArray(parsed.exercises) ? parsed.exercises : [];
      }

      const normalized = exArray.map((ex) => {
        const base = {
          id:
            ex.id ||
            (typeof crypto !== "undefined" && crypto.randomUUID
              ? crypto.randomUUID()
              : String(Date.now() + Math.random())),
          title: ex.title || "",
          muscle: ex.muscle || "",
          imageSrc: ex.imageSrc || "/Muscle/Upper%20Body/Chest.png",
        };

        if (Array.isArray(ex.sets) && ex.sets.length > 0) {
          const normalizedSets = ex.sets.map((s, idx) => ({
            id: s.id ?? idx + 1,
            type:
              s.type === "Warm-Up Set" || s.type === "Working Set"
                ? s.type
                : "Working Set",
            weight: s.weight ?? "",
            reps: s.reps ?? "",
          }));
          return { ...base, sets: normalizedSets };
        }

        const count =
          typeof ex.setsCount === "number" && ex.setsCount > 0
            ? ex.setsCount
            : 1;

        const sets = Array.from({ length: count }, (_, i) => ({
          id: i + 1,
          type: "Working Set",
          weight: "",
          reps: "",
        }));

        return { ...base, sets };
      });

      setWorkoutTitle(title);
      setExercises(normalized);
    } catch (err) {
      console.error("Failed to parse workout from localStorage:", err);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isLoaded) return;

    const payload = {
      title: workoutTitle,
      exercises,
    };

    window.localStorage.setItem(CURRENT_KEY, JSON.stringify(payload));
  }, [workoutTitle, exercises, isLoaded]);

  function openExerciseSearch(insertIndex) {
    const base = "/exerciseSearch";

    if (
      typeof insertIndex === "number" &&
      Number.isFinite(insertIndex) &&
      insertIndex >= 0
    ) {
      router.push(`${base}?insertIndex=${insertIndex}`);
    } else {
      router.push(base);
    }
  }

  function handleDeleteExercise(id) {
    setExercises((prev) => prev.filter((ex) => ex.id !== id));
  }

  function updateExercise(exerciseId, updater) {
    setExercises((prev) =>
      prev.map((ex) => (ex.id === exerciseId ? updater(ex) : ex))
    );
  }

  function handleAddSet(exerciseId) {
    updateExercise(exerciseId, (ex) => {
      const nextId =
        ex.sets && ex.sets.length
          ? Math.max(...ex.sets.map((s) => s.id || 0)) + 1
          : 1;

      const newSet = {
        id: nextId,
        type: "Working Set",
        weight: "",
        reps: "",
      };

      return {
        ...ex,
        sets: [...(ex.sets || []), newSet],
      };
    });
  }

  function handleDeleteSet(exerciseId, setId) {
    updateExercise(exerciseId, (ex) => {
      if (!ex.sets || ex.sets.length <= 1) return ex;
      return {
        ...ex,
        sets: ex.sets.filter((s) => s.id !== setId),
      };
    });
  }

  function handleChangeSetField(exerciseId, setId, field, value) {
    updateExercise(exerciseId, (ex) => ({
      ...ex,
      sets: (ex.sets || []).map((s) =>
        s.id === setId ? { ...s, [field]: value } : s
      ),
    }));
  }

  async function handleSaveWorkout() {
    if (exercises.length === 0) return;
    if (typeof window === "undefined") return;

    let list = [];
    const stored = window.localStorage.getItem(SAVED_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) list = parsed;
      } catch {

      }
    }

    const workout = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : String(Date.now()),
      title: workoutTitle || "Untitled Workout",
      date: new Date().toISOString(),
      exercises,
    };

    list.push(workout);
    window.localStorage.setItem(SAVED_KEY, JSON.stringify(list));

    console.log("Workout saved to localStorage:", workout);

    try {
      const res = await fetch("/api/exerciseLogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          workoutTitle: workout.title,
          date: workout.date,
          exercises: workout.exercises,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error("Failed to save workout to DB:", err);
        return;
      }

      const data = await res.json();
      console.log("Workout saved to DB:", data);

      window.localStorage.removeItem(CURRENT_KEY);
      setWorkoutTitle("");
      setExercises([]);

      router.push("/overviewTraining");
    } catch (err) {
      console.error("Error while saving workout to DB:", err);
    }
  }

  return (
    <div className="w-full min-h-screen py-4 flex flex-col gap-4 items-center">

      <div className="w-full flex flex-col gap-1 px-2">
        <input
          type="text"
          value={workoutTitle}
          onChange={(e) => setWorkoutTitle(e.target.value)}
          placeholder="Workout Title"
          className="
            w-full
            bg-transparent
            text-3xl
            font-semibold
            text-white
            pb-2
            border-b-[3px]
            border-brand-grey4
            focus:outline-none
            focus:border-brand-purple1
            placeholder:text-brand-grey4
          "
        />
      </div>

      <div className="w-full border-b border-brand-grey3" />

      <div className="w-full flex flex-col gap-4 px-2 pb-10">

        {exercises.length === 0 && (
          <div className="w-full flex flex-col items-center mt-6">
            <button
              type="button"
              onClick={() => openExerciseSearch(0)}
              className="w-16 h-16 rounded-full bg-brand-purple1 flex items-center justify-center active:scale-95"
            >
              <Plus size={28} />
            </button>
            <p className="text-xs text-brand-grey4 mt-2">
              Add your first exercise
            </p>
          </div>
        )}

        {exercises.length > 0 && (
          <div className="w-full flex flex-col gap-4">

            <div className="w-full flex items-center mb-2">
              <div className="flex-1 h-[1px] bg-brand-purple1" />
              <button
                type="button"
                onClick={() => openExerciseSearch(0)}
                className="w-8 h-8 rounded-full bg-brand-purple1 flex items-center justify-center mx-2 active:scale-95"
              >
                <Plus size={16} />
              </button>
              <div className="flex-1 h-[1px] bg-brand-purple1" />
            </div>

            {exercises.map((ex, index) => (
              <div key={ex.id} className="w-full flex flex-col gap-2">
                <TrackingTrainingCard
                  title={ex.title}
                  muscle={ex.muscle}
                  imageSrc={ex.imageSrc}
                  sets={ex.sets || []}
                  onDeleteExercise={() => handleDeleteExercise(ex.id)}
                  onAddSet={() => handleAddSet(ex.id)}
                  onDeleteSet={(setId) => handleDeleteSet(ex.id, setId)}
                  onChangeSetType={(setId, type) =>
                    handleChangeSetField(ex.id, setId, "type", type)
                  }
                  onChangeSetWeight={(setId, weight) =>
                    handleChangeSetField(ex.id, setId, "weight", weight)
                  }
                  onChangeSetReps={(setId, reps) =>
                    handleChangeSetField(ex.id, setId, "reps", reps)
                  }
                />

                <div className="w-full flex items-center my-1">
                  <div className="flex-1 h-[1px] bg-brand-purple1" />
                  <button
                    type="button"
                    onClick={() => openExerciseSearch(index + 1)}
                    className="w-8 h-8 rounded-full bg-brand-purple1 flex items-center justify-center mx-2 active:scale-95"
                  >
                    <Plus size={16} />
                  </button>
                  <div className="flex-1 h-[1px] bg-brand-purple1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {exercises.length > 0 && (
          <div className="w-full flex justify-end mt-4">
            <button
              type="button"
              onClick={handleSaveWorkout}
              className="px-4 py-2 rounded-full bg-brand-purple1 text-sm font-medium active:scale-95"
            >
              Save Workout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
