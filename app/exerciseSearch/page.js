"use client";

import { useEffect, useMemo, useState } from "react";
import Search from "@/components/global/search.js";
import ExerciseCard from "@/components/trackingTraining/exerciseCard.js";

function resolveMuscleImage(muscleRaw) {
  if (!muscleRaw) return "/Muscle/Upper%20Body/Chest.png";

  const muscle = muscleRaw.toLowerCase();

  switch (muscle) {

    case "abductors":
      return "/Muscle/Lower%20Body/Abductors.png";
    case "adductors":
      return "/Muscle/Lower%20Body/Adductors.png";
    case "calves":
      return "/Muscle/Lower%20Body/Calves.png";
    case "glutes":
      return "/Muscle/Lower%20Body/Glutes.png";
    case "hamstrings":
      return "/Muscle/Lower%20Body/Hamstrings.png";
    case "quads":
      return "/Muscle/Lower%20Body/Quads.png";
    case "tear muscle":
      return "/Muscle/Lower%20Body/Tear%20Muscle.png";
    case "tibialis":
      return "/Muscle/Lower%20Body/Tibialis.png";

    case "biceps":
      return "/Muscle/Upper%20Body/Arms/biceps.png";
    case "forearm extensors":
      return "/Muscle/Upper%20Body/Arms/Forearm%20Extensors.png";
    case "forearm flexors":
      return "/Muscle/Upper%20Body/Arms/Forearm%20Flexors.png";
    case "triceps":
      return "/Muscle/Upper%20Body/Arms/Triceps.png";

    case "lats":
      return "/Muscle/Upper%20Body/Back/Lats.png";
    case "lower back":
      return "/Muscle/Upper%20Body/Back/Lower%20Back.png";
    case "lower lats":
      return "/Muscle/Upper%20Body/Back/Lower%20Lats.png";
    case "mid back":
      return "/Muscle/Upper%20Body/Back/Mid%20Back.png";

    case "core":
      return "/Muscle/Upper%20Body/Core/Core.png";
    case "lower abs":
      return "/Muscle/Upper%20Body/Core/Lower%20Abs.png";
    case "obliques":
      return "/Muscle/Upper%20Body/Core/Obliques.png";
    case "upper abs":
      return "/Muscle/Upper%20Body/Core/Upper%20Abs.png";

    case "rear delts":
      return "/Muscle/Upper%20Body/Shoulders/Rear%20Delts.png";
    case "side delts":
      return "/Muscle/Upper%20Body/Shoulders/Side%20Delts.png";
    case "front delts":
      return "/Muscle/Upper%20Body/Shoulders/Side%20Delts.png";

    case "chest":
      return "/Muscle/Upper%20Body/Chest.png";
    case "scm":
      return "/Muscle/Upper%20Body/SCM.png";

    default:
      return "/Muscle/Upper%20Body/Chest.png";
  }
}

export default function ExerciseSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchExercises() {
      try {
        const res = await fetch("/api/exercises");
        if (!res.ok) {
          throw new Error(`Failed to fetch exercises: ${res.status}`);
        }

        const data = await res.json();

        setExercises(data);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, []);

  const filteredExercises = useMemo(() => {
    if (!searchQuery) return exercises;

    const q = searchQuery.toLowerCase();

    return exercises.filter((ex) => {
      const name = (ex.Exercise || "").toLowerCase();
      const muscle = (ex.Muscle || "").toLowerCase();
      return name.includes(q) || muscle.includes(q);
    });
  }, [exercises, searchQuery]);

  return (
    <div className="w-full h-full">
      <main className="w-full h-full flex flex-col">

        <div className="flex flex-col mb-6 shrink-0">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search exercises or muscles..."
          />
          <div className="w-full h-[1px] bg-brand-grey3" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <p className="text-xs text-brand-grey4">Loading exercises…</p>
          )}

          {!loading && errorMsg && (
            <p className="text-xs text-red-500">Error: {errorMsg}</p>
          )}

          {!loading && !errorMsg && (
            <div className="flex flex-col gap-4 pb-4">
              {filteredExercises.length === 0 && exercises.length > 0 && (
                <p className="text-xs text-brand-grey4 text-center">
                  No matches found for "{searchQuery}"
                </p>
              )}

              {exercises.length === 0 && (
                <p className="text-xs text-brand-grey4">
                  No exercises found in the database.
                </p>
              )}

              {filteredExercises.map((exercise) => {
                const title = exercise.Exercise || "Unknown Exercise";
                const imageSrc = resolveMuscleImage(exercise.Muscle);

                return (
                  <ExerciseCard
                    key={exercise._id}
                    title={title}
                    imageSrc={imageSrc}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}