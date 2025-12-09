"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpForm() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          user_name: username || `${firstName} ${lastName}`.trim(),

          gender: "male",
          age: 21,
          height: 180,
          weight: 80,
          nutritional_goal: "maintain",
          activity_level: 3,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create account");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("elysia_user_id", data.userId);
      }

      router.push("/onboarding");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full rounded-3xl bg-brand-grey2 px-5 py-6 text-white md:px-6 md:py-8">
      <h2 className="mb-6 text-center text-xl font-semibold md:mb-8 md:text-3xl">
        Sign Up
      </h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 text-sm md:gap-10 md:text-lg"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border-b border-brand-grey4 bg-transparent pb-1 outline-none placeholder:text-brand-grey5"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border-b border-brand-grey4 bg-transparent pb-1 outline-none placeholder:text-brand-grey5"
            />
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border-b border-brand-grey4 bg-transparent pb-1 outline-none placeholder:text-brand-grey5"
          />
        </div>

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
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-5 text-center text-xs text-brand-grey5 md:mt-6 md:text-sm">
        <p>Already have an Elysia account?</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-1 text-xs font-medium text-brand-purple1 underline md:mt-2 md:text-sm"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
