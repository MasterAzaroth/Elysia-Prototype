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

      router.push("/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (

    <div className="w-full h-auto rounded-3xl bg-brand-grey2 p-6 text-white md:p-8">
      
      <h2 className="mb-8 text-center text-3xl font-semibold">Sign Up</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-lg md:gap-10">

        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}

              className="w-full appearance-none rounded-none border-b border-brand-grey4 bg-transparent py-2 outline-none placeholder:text-brand-grey5 focus:border-brand-purple1 transition-colors"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full appearance-none rounded-none border-b border-brand-grey4 bg-transparent py-2 outline-none placeholder:text-brand-grey5 focus:border-brand-purple1 transition-colors"
            />
          </div>
        </div>

        <div>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full appearance-none rounded-none border-b border-brand-grey4 bg-transparent py-2 outline-none placeholder:text-brand-grey5 focus:border-brand-purple1 transition-colors"
          />
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full appearance-none rounded-none border-b border-brand-grey4 bg-transparent py-2 outline-none placeholder:text-brand-grey5 focus:border-brand-purple1 transition-colors"
            required
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full appearance-none rounded-none border-b border-brand-grey4 bg-transparent py-2 outline-none placeholder:text-brand-grey5 focus:border-brand-purple1 transition-colors"
            required
          />
        </div>

        {error && (
          <p className="mt-1 text-center text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-full bg-brand-purple1 py-3 text-center text-lg font-semibold uppercase tracking-wide disabled:opacity-60 hover:bg-opacity-90 transition-opacity"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-brand-grey5">
        <p>Already have an Elysia account?</p>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mt-2 text-sm font-medium text-brand-purple1 underline"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
