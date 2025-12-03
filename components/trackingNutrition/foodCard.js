import { useState } from "react";
import { Egg, Flame, Plus, Check } from "lucide-react";

export default function FoodCard({
  Icon = Egg,
  name = "Egg",
  calories = 0,
  protein = 0,
  carbs = 0,
  fat = 0,
  grams = "",
  onGramsChange,
  onToggleAdd,
}) {
  const [isAdded, setIsAdded] = useState(false);

  function handleToggle() {
    const next = !isAdded;
    setIsAdded(next);
    if (onToggleAdd) {
      onToggleAdd(next);
    }
  }

  function handleGramsChange(e) {
    const raw = e.target.value;

    if (raw === "") {
      if (onGramsChange) onGramsChange("");
      return;
    }

    const value = parseInt(raw, 10);
    if (Number.isNaN(value) || value < 0) {

      return;
    }

    if (onGramsChange) onGramsChange(value);
  }

  const inputValue =
    grams === null || grams === undefined ? "" : grams;

  return (
    <div className="w-full h-20 bg-brand-grey2 flex p-3 rounded-4xl">

      <div className="w-auto h-full flex items-center justify-start mr-4">
        <Icon size={28} />
      </div>

      <div className="w-full h-full flex flex-col justify-between text-xs py-1 gap-1">
        <div className="text-lg font-bold">
          <p>{name}</p>
        </div>

        <div className="w-auto h-auto flex gap-1">

          <div className="w-auto h-auto flex gap-[2px]">
            <Flame size={16} />
            <p>{calories}</p>
          </div>

          <div className="w-1 h-1 rounded-full bg-brand-purple1 self-center" />

          <div className="w-auto h-auto flex gap-[2px]">
            <p>{protein}</p>
            <p>P</p>
          </div>

          <div className="w-1 h-1 rounded-full bg-brand-purple1 self-center" />

          <div className="w-auto h-auto flex gap-[2px]">
            <p>{carbs}</p>
            <p>C</p>
          </div>

          <div className="w-1 h-1 rounded-full bg-brand-purple1 self-center" />

          <div className="w-auto h-auto flex gap-[2px]">
            <p>{fat}</p>
            <p>F</p>
          </div>
        </div>
      </div>

      <div className="h-10 flex items-center rounded-full bg-transparent border-2 border-brand-purple1 pl-3 self-center">

        <div className="w-12 flex items-center mr-2 relative text-sm">
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min="0"
            className="bg-transparent outline-none w-full text-white font-medium"
            value={inputValue}
            onChange={handleGramsChange}
          />
          <span className="absolute right-0 text-white font-medium">g</span>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className="h-full aspect-square rounded-full bg-brand-purple1 flex items-center justify-center text-white"
        >
          {isAdded ? (
            <Check size={20} strokeWidth={3} />
          ) : (
            <Plus size={20} strokeWidth={3} />
          )}
        </button>
      </div>
      
    </div>
  );
}