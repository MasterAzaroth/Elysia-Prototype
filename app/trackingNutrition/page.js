"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Search from "../../components/global/search.js";
import FCard from "../../components/trackingNutrition/foodCard.js";
import { Egg, Wheat, Pizza, CookingPot } from "lucide-react";

export default function FoodDatabase() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const [gramsById, setGramsById] = useState({});

  useEffect(() => {
    const storedId = localStorage.getItem("elysia_user_id");
    if (!storedId) {
      router.push("/login");
      return;
    }
    setUserId(storedId);
  }, [router]);

  function resolveFoodIcon(iconName) {
    switch (iconName) {
      case "Egg": return Egg;
      case "Pizza": return Pizza;
      case "Wheat": return Wheat;
      default: return CookingPot;
    }
  }

  useEffect(() => {
    async function fetchFoods() {
      try {
        const res = await fetch("/api/foods");
        if (!res.ok) throw new Error(`Failed to fetch foods: ${res.status}`);

        const data = await res.json();
        setFoods(data);

        const initialGrams = {};
        data.forEach((food) => {
          initialGrams[food._id] = 100;
        });
        setGramsById(initialGrams);
      } catch (err) {
        console.error(err);
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFoods();
  }, []);

  const filteredFoods = useMemo(() => {
    if (!searchQuery) return foods;
    const q = searchQuery.toLowerCase();
    return foods.filter((food) => food.name?.toLowerCase().includes(q));
  }, [foods, searchQuery]);

  function handleGramsChange(id, newValue) {
    setGramsById((prev) => ({
      ...prev,
      [id]: newValue,
    }));
  }

  async function handleToggleAdd(food, isAdded) {

    if (!userId) return; 

    const gramsRaw = gramsById[food._id];
    const grams = Number(gramsRaw);

    if (!isAdded) return;

    if (!grams || Number.isNaN(grams) || grams <= 0) {
      console.warn("Invalid grams for", food.name, gramsRaw);
      return;
    }

    try {
      const res = await fetch("/api/foodLog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          foodId: food._id,
          grams,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Failed to log food:", res.status, text);
        return;
      }

      const log = await res.json();
      console.log("✅ Food logged:", log);

    } catch (err) {
      console.error("Error logging food:", err);
    }
  }

  if (!userId) return null;

  return (
    <div className="w-full h-full">
      <main className="w-full h-full flex flex-col">
        <div className="flex flex-col mb-6 shrink-0">
          <Search
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search foods..."
          />
          <div className="w-full h-[1px] bg-brand-grey3" />
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="text-xs text-brand-grey4">Loading foods…</p>}
          {!loading && errorMsg && <p className="text-xs text-red-500">Error: {errorMsg}</p>}

          {!loading && !errorMsg && (
            <div className="flex flex-col gap-4 pb-4">
              {filteredFoods.length === 0 && foods.length > 0 && (
                <p className="text-xs text-brand-grey4 text-center">No matches found for "{searchQuery}"</p>
              )}
              {foods.length === 0 && (
                <p className="text-xs text-brand-grey4">No foods found in the database.</p>
              )}

              {filteredFoods.map((food) => {
                const Icon = resolveFoodIcon(food.icon);
                const grams = gramsById[food._id] ?? "";
                const gNum = typeof grams === "number" ? grams : Number(grams) || 0;

                const caloriesScaled = Math.round((food.calories * gNum) / 100);
                const proteinScaled = +((food.protein * gNum) / 100).toFixed(1);
                const carbsScaled = +((food.carbs * gNum) / 100).toFixed(1);
                const fatScaled = +((food.fat * gNum) / 100).toFixed(1);

                return (
                  <FCard
                    key={food._id}
                    Icon={Icon}
                    name={food.name}
                    calories={caloriesScaled}
                    protein={proteinScaled}
                    carbs={carbsScaled}
                    fat={fatScaled}
                    grams={grams}
                    onGramsChange={(value) => handleGramsChange(food._id, value)}
                    onToggleAdd={(isAdded) => handleToggleAdd(food, isAdded)}
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