"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Landmark } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid credentials");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("elysia_user_id", data.userId);
      }

      router.push("/overviewNutrition");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-start px-6 pt-10">

      <div className="mb-6 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-grey2">
          <Landmark size={28} />
        </div>
        <p className="mt-3 text-sm md:text-lg">Welcome back to Elysia</p>
      </div>


      <div className="w-full max-w-md">
        <div className="w-full rounded-3xl bg-brand-grey2 px-5 py-6 text-white md:px-6 md:py-8">
          <h2 className="mb-6 text-center text-xl font-semibold md:mb-8 md:text-3xl">
            Login
          </h2>

          <form
            onSubmit={handleLogin}
            className="flex flex-col gap-6 text-sm md:gap-10 md:text-lg"
          >

            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-b border-brand-grey4 bg-transparent pb-1 outline-none placeholder:text-brand-grey5"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border-b border-brand-grey4 bg-transparent pb-1 outline-none placeholder:text-brand-grey5"
                required
              />
            </div>

            {error && (
              <p className="mt-1 text-[11px] text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-full bg-brand-purple1 py-2.5 text-center text-sm font-semibold uppercase tracking-wide md:mt-4 md:py-3 md:text-lg disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-brand-grey5 md:mt-6 md:text-sm">
            <p>Don't have an Elysia account?</p>
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="mt-1 text-xs font-medium text-brand-purple1 underline md:mt-2 md:text-sm"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}