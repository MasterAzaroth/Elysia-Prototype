"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const userId = localStorage.getItem("elysia_user_id");

    if (!userId) {
      router.push("/login");
      return;
    }

    async function fetchUser() {
      try {
        const res = await fetch(`/api/user/profile?userId=${userId}`);
        const data = await res.json();

        if (data.success) {
          setUserData(data.user);
        } else {
          console.error("Failed to fetch user:", data.error);
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("elysia_user_id");

    router.push("/login");
  }

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-brand-grey2 text-white">
        Loading Profile...
      </div>
    );
  }

  if (!userData) return null;

  return (
    <div className="flex min-h-screen w-full flex-col bg-brand-grey2 text-white p-8">

      <div className="text-center mb-8">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="text-lg text-brand-grey5">Your personal details</p>
      </div>

      <div className="w-full max-w-md mx-auto rounded-3xl bg-white/5 p-8 backdrop-blur-sm">

        <div className="mb-6 border-b border-gray-700 pb-4">
          <p className="text-sm font-medium text-brand-grey5 mb-1">Username</p>
          <p className="text-xl font-bold">{userData.user_name}</p>
        </div>

        <div className="mb-6 border-b border-gray-700 pb-4">
          <p className="text-sm font-medium text-brand-grey5 mb-1">Email</p>
          <p className="text-lg">{userData.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-sm font-medium text-brand-grey5 mb-1">Age</p>
            <p className="text-xl">{userData.age}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-brand-grey5 mb-1">Gender</p>
            <p className="text-xl capitalize">{userData.gender}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-brand-grey5 mb-1">Height</p>
            <p className="text-xl">{userData.height} cm</p>
          </div>
          <div>
            <p className="text-sm font-medium text-brand-grey5 mb-1">Weight</p>
            <p className="text-xl">{userData.weight} kg</p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-brand-grey5 mb-1">Nutritional Goal</p>
          <p className="text-xl capitalize text-brand-purple1 font-bold">
            {userData.nutritional_goal}
          </p>
        </div>

        <div className="mb-6">
           <p className="text-sm font-medium text-brand-grey5 mb-1">Preference</p>
           <p className="text-xl capitalize">{userData.nutritional_preference}</p>
        </div>

        <div className="mb-2">
          <p className="text-sm font-medium text-brand-grey5 mb-1">Activity Level</p>
          <p className="text-xl">{userData.activity_level} / 5</p>
        </div>
      </div>

      <div className="mt-8 text-center pb-10">
        <button
          onClick={handleLogout}
          className="w-full max-w-xs rounded-full bg-brand-purple1 py-3 text-lg font-semibold text-white shadow-lg transition-transform active:scale-95"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}