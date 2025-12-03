import { Egg, Flame, Trash2 } from "lucide-react";

export default function oNC({
  Icon = Egg,
  name = "Egg",
  calories = 0,
  protein = 0,
  carbs = 0,
  fat = 0,
  grams = 0,
  onRemove,
  onGramsChange,
  className = "bg-brand-grey2",
}) {
  function handleGramsChange(e) {
    let raw = e.target.value;

    if (raw === "") {
      onGramsChange && onGramsChange("");
      return;
    }

    raw = raw.replace(/\D/g, "").slice(0, 3);

    if (raw === "") {
      onGramsChange && onGramsChange("");
      return;
    }

    const value = parseInt(raw, 10);
    if (Number.isNaN(value) || value < 0) return;

    const clamped = Math.min(value, 999);
    onGramsChange && onGramsChange(clamped);
  }

  const inputValue =
    grams === null || grams === undefined || grams === ""
      ? ""
      : grams;

  return (
    <div className={`w-full h-20 flex p-3 rounded-4xl ${className}`}>

      <div className="w-auto h-full flex items-center justify-start mr-4">
        <Icon size={28} />
      </div>

      <div className="w-full h-full flex flex-col justify-between text-xs py-1 gap-1">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">{name}</p>
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

      <div className="w-auto h-10 flex items-center rounded-full bg-transparent border-2 border-brand-purple1 self-center gap-2">

        <div className="w-auto flex justify-between items-center text-sm font-medium text-white">
          <input
            type="number"
            inputMode="numeric"
            min="1"
            max="999"
            maxLength={3}
            value={inputValue}
            onChange={handleGramsChange}
            className="
              w-10 bg-transparent text-right outline-none
              [appearance:textfield]
              [&::-webkit-outer-spin-button]:appearance-none
              [&::-webkit-inner-spin-button]:appearance-none
            "
          />
          <span className="ml-2">g</span>
        </div>

        <button
          type="button"
          onClick={onRemove}
          className="h-full aspect-square rounded-full bg-brand-purple1 flex items-center justify-center text-white cursor-pointer hover:bg-opacity-90 transition"
        >
          <Trash2 size={18} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
