"use client";

import { Landmark } from "lucide-react";

export default function WelcomeCard({ onContinue }) {
  return (
    <div className="flex h-full w-full flex-col bg-brand-grey1 text-white">

      <div className="px-8 pt-8">
        <div className="flex h-[3px] w-full gap-1">
          <div className="h-full flex-1 rounded-full bg-brand-purple1" />
          <div className="h-full flex-1 rounded-full bg-brand-grey3" />
          <div className="h-full flex-1 rounded-full bg-brand-grey3" />
          <div className="h-full flex-1 rounded-full bg-brand-grey3" />
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4">

        <p className="mb-20 text-center text-lg leading-relaxed">
          Discipline shapes the body.
          <br />
          Purpose shapes the mind.
        </p>

        <div className="mb-12 flex h-32 w-32 items-center justify-center">
          <Landmark size={110} />
        </div>

        <div className="space-y-2 text-center text-[18px] leading-relaxed">
          <p>Welcome to Elysia</p>
          <p className="text-[22px] text-brand-grey5">—</p>
          <p>your space for growth.</p>
        </div>
      </div>

      <div className="px-8 pb-12 pt-4">
        <button
          type="button"
          onClick={onContinue}
          className="mx-auto block w-full max-w-[360px] rounded-full bg-brand-purple1 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg transition-transform active:scale-95"
        >
          Tap to continue
        </button>
      </div>
    </div>
  );
}