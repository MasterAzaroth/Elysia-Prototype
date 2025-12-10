"use client";

export default function PhysiologyCard({
  age, setAge,
  gender, setGender,
  height, setHeight,
  weight, setWeight,
  onContinue,
}) {
  return (
    <div className="flex h-full w-full flex-col bg-brand-grey1 text-white">

      <div className="px-8 pt-8">
        <div className="flex h-[3px] w-full gap-1">
          <div className="h-full flex-1 rounded-full bg-brand-purple1" />
          <div className="h-full flex-1 rounded-full bg-brand-purple1" />
          <div className="h-full flex-1 rounded-full bg-brand-grey3" />
          <div className="h-full flex-1 rounded-full bg-brand-grey3" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center px-4 pt-8">
        <div className="mb-8 text-center">
          <p className="text-lg font-medium text-gray-300">
            Every journey begins
            <br />
            with knowing where you stand.
          </p>
        </div>

        <div className="w-full max-w-[360px] rounded-[32px] bg-white/5 p-6 backdrop-blur-sm">
          <div className="mb-6 text-center">
            <p className="text-lg font-bold">Please tell us about yourself.</p>
          </div>

          <div className="mb-5 flex gap-4 text-xs">
            <div className="flex-1">
              <p className="mb-1 text-brand-grey5">Age</p>
              <input
                type="number"
                min={10} max={100} step={1}
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}

                className="w-full border-b border-brand-grey4 bg-transparent pb-1 text-sm outline-none focus:border-brand-purple1 transition-colors"
              />
            </div>
            <div className="flex-1">
              <p className="mb-1 text-brand-grey5">Gender</p>
              <div className="border-b border-brand-grey4 pb-1 focus-within:border-brand-purple1 transition-colors">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none [&>option]:bg-brand-grey2"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-gray-300">Height</span>
              
              <div className="flex items-center gap-1 border-b border-brand-grey4 focus-within:border-brand-purple1 transition-colors">
                <input 
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-12 bg-transparent text-right font-bold text-brand-purple1 outline-none appearance-none m-0 p-0"
                />
                <span className="font-bold text-brand-purple1">cm</span>
              </div>
            </div>
            <input
              type="range"
              min={140} max={210}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="h-1.5 w-full appearance-none rounded-full bg-brand-grey3 outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-purple1 [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>

          <div className="mb-2">
            <div className="mb-3 flex items-center justify-between text-sm">
              <span className="text-gray-300">Weight</span>

              <div className="flex items-center gap-1 border-b border-brand-grey4 focus-within:border-brand-purple1 transition-colors">
                <input 
                  type="number"
                  value={weight}
                  step={0.5}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-16 bg-transparent text-right font-bold text-brand-purple1 outline-none appearance-none m-0 p-0"
                />
                <span className="font-bold text-brand-purple1">kg</span>
              </div>
            </div>
            <input
              type="range"
              min={40} max={130} step={0.5}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="h-1.5 w-full appearance-none rounded-full bg-brand-grey3 outline-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-purple1 [&::-webkit-slider-thumb]:shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="px-8 pb-12 pt-4">
        <button
          type="button"
          onClick={onContinue}
          className="mx-auto block w-full max-w-[360px] rounded-full bg-brand-purple1 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-transform active:scale-95"
        >
          Continue
        </button>
      </div>
    </div>
  );
}