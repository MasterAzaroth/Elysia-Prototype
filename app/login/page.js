"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [inputId, setInputId] = useState("");

  const handleLogin = () => {
    if (inputId) {

      if (typeof window !== "undefined") {
        localStorage.setItem("elysia_user_id", inputId);
      }
      router.push("/overviewNutrition");
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-brand-grey1 text-white gap-6 p-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Temporary Login</h1>
        <p className="text-sm text-gray-400">
          Paste your User ID from MongoDB Compass to test your data.
        </p>
      </div>

      <div className="flex w-full max-w-md gap-2">
        <input
          type="text"
          placeholder="e.g. 6573b..."
          className="flex-1 rounded-lg bg-brand-grey2 border border-brand-grey4 px-4 py-3 text-white focus:border-brand-purple1 outline-none"
          value={inputId}
          onChange={(e) => setInputId(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="rounded-lg bg-brand-purple1 px-6 py-3 font-bold text-white hover:opacity-90 transition"
        >
          Enter
        </button>
      </div>
    </div>
  );
};

export default LoginPage;