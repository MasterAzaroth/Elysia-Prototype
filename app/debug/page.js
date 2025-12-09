"use client";

import { useState, useEffect } from "react";

export default function DebugPage() {
  const [storedId, setStoredId] = useState("Checking...");
  const [manualId, setManualId] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("elysia_user_id");
    setStoredId(id || "NO_ID_FOUND");
  }, []);

  const handleForceLogin = () => {
    if (!manualId) return;
    localStorage.setItem("elysia_user_id", manualId);
    setStoredId(manualId);
    alert(`Saved ID: ${manualId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("elysia_user_id");
    setStoredId("NO_ID_FOUND");
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col gap-8 items-start">
      <h1 className="text-3xl font-bold text-red-500">Auth Debugger</h1>
      
      <div className="p-6 border border-gray-700 rounded-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Current Status:</h2>
        <p className="text-lg mb-2">
          Your Local Storage ID is:
        </p>
        <div className="bg-gray-900 p-4 rounded-lg font-mono text-yellow-400 text-xl break-all">
          {storedId}
        </div>
        
        {storedId === "NO_ID_FOUND" ? (
          <p className="text-red-400 mt-4 text-sm">
             🛑 You are NOT logged in. Redirects will block you.
          </p>
        ) : (
          <p className="text-green-400 mt-4 text-sm">
             ✅ You ARE logged in. Pages should work.
          </p>
        )}
      </div>

      <div className="p-6 border border-gray-700 rounded-xl w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">Fix It Manually:</h2>
        <p className="text-sm text-gray-400 mb-2">Paste a valid MongoDB _id here:</p>
        <div className="flex gap-2">
          <input 
            className="bg-gray-800 text-white p-2 rounded flex-1"
            placeholder="e.g. 6573b..."
            value={manualId}
            onChange={(e) => setManualId(e.target.value)}
          />
          <button 
            onClick={handleForceLogin}
            className="bg-blue-600 px-4 py-2 rounded font-bold hover:bg-blue-500"
          >
            Force Login
          </button>
        </div>
        
        <button 
          onClick={handleLogout}
          className="mt-6 text-sm text-red-500 underline"
        >
          Clear / Logout
        </button>
      </div>
    </div>
  );
}