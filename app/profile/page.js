"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ProfileStat = ({ label, value, highlight = false, subUnit = "" }) => (
  <div className="flex flex-col p-2">
    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
      {label}
    </span>
    <p className={`text-xl font-semibold ${highlight ? "text-[#8B5CF6]" : "text-white"}`}>
      {value} <span className="text-sm font-normal text-gray-400">{subUnit}</span>
    </p>
  </div>
);

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

  const getInitials = (name) => name ? name.charAt(0).toUpperCase() : "?";

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black text-white">
        <div className="animate-pulse text-brand-purple1">Loading Profile...</div>
      </div>
    );
  }

  if (!userData) return null;

  return (

    <div className="flex min-h-screen w-full flex-col text-white px-6 pt-10 pb-32"> 

      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      </div>

      <div className="w-full max-w-md mx-auto rounded-3xl bg-[#1A1A1A] border border-white/5 overflow-hidden">

        <div className="flex flex-col items-center border-b border-white/5 bg-white/5 p-8">

          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-[#8B5CF6] to-purple-900 text-3xl font-bold shadow-lg shadow-purple-900/20">
            {getInitials(userData.user_name)}
          </div>
          <h2 className="text-2xl font-bold">{userData.user_name}</h2>
          <p className="text-gray-400">{userData.email}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-6 p-8">
          <ProfileStat 
            label="Age" 
            value={userData.age} 
          />
          <ProfileStat 
            label="Gender" 
            value={userData.gender} 
            className="capitalize"
          />
          <ProfileStat 
            label="Height" 
            value={userData.height} 
            subUnit="cm" 
          />
          <ProfileStat 
            label="Weight" 
            value={userData.weight} 
            subUnit="kg" 
          />
          
          <div className="col-span-2">
            <ProfileStat 
              label="Nutritional Goal" 
              value={userData.nutritional_goal} 
              highlight={true}
            />
          </div>
          
          <div className="col-span-2">
            <ProfileStat 
              label="Dietary Preference" 
              value={userData.nutritional_preference} 
            />
          </div>

          <div className="col-span-2">
             <div className="flex flex-col p-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Activity Level
                </span>

                <div className="flex items-center gap-3">
                   <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#8B5CF6]" 
                        style={{ width: `${(userData.activity_level / 5) * 100}%` }}
                      ></div>
                   </div>
                   <span className="text-lg font-semibold">{userData.activity_level}/5</span>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleLogout}
          className="w-full max-w-[200px] rounded-full border border-red-500/50 bg-red-500/10 py-3 text-sm font-semibold text-red-500 transition-all hover:bg-red-500 hover:text-white active:scale-95"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}