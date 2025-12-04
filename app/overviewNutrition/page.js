"use client";

import { useEffect, useMemo, useState } from "react";

import OverviewNavbar from "@/components/global/overviewNavbar";
import Pill from "@/components/overviewNutrition/weekdayPill.js";
import MacroState from "@/components/overviewNutrition/macroState.js";
import ONC from "@/components/overviewNutrition/oNC.js";
import { Flame, Egg, Wheat, Pizza, CookingPot, Play } from "lucide-react";

function resolveFoodIcon(iconName) {
  switch (iconName) {
    case "Egg":
      return Egg;
    case "Pizza":
      return Pizza;
    case "Wheat":
      return Wheat;
    default:
      return CookingPot;
  }
}

function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function OverviewNutrition() {

  const labels = ["M", "T", "W", "T", "F", "S", "S"];


  const today = new Date();
  const dayOfWeek = today.getDay();
  const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const initialMonday = new Date(today);
  initialMonday.setDate(today.getDate() + offsetToMonday);

  const [selectedDate, setSelectedDate] = useState(today);
  const [weekStart, setWeekStart] = useState(initialMonday);

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      return d;
    });
  }, [weekStart]);

  useEffect(() => {
    const ws = new Date(weekStart);
    const we = new Date(weekStart);
    we.setDate(ws.getDate() + 6);

    if (selectedDate < ws) {
      const newStart = new Date(ws);
      newStart.setDate(ws.getDate() - 7);
      setWeekStart(newStart);
    } else if (selectedDate > we) {
      const newStart = new Date(ws);
      newStart.setDate(ws.getDate() + 7);
      setWeekStart(newStart);
    }
  }, [selectedDate, weekStart]);

  const [logs, setLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [logError, setLogError] = useState("");

  useEffect(() => {
    async function fetchLogsForSelectedDay() {
      try {
        setLoadingLogs(true);
        setLogError("");

        const yyyy = selectedDate.getFullYear();
        const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
        const dd = String(selectedDate.getDate()).padStart(2, "0");
        const dayStr = `${yyyy}-${mm}-${dd}`;

        console.log("🔍 Overview querying day:", dayStr);

        const res = await fetch(`/api/foodLog?day=${dayStr}`);
        if (!res.ok) {
          const text = await res.text();
          throw new Error(
            `Failed to fetch logs: ${res.status} ${text.slice(0, 100)}`
          );
        }

        const data = await res.json();
        console.log("💾 Logs from API:", data);

        setLogs(data);
      } catch (err) {
        console.error(err);
        setLogError(err.message || "Failed to load logs");
      } finally {
        setLoadingLogs(false);
      }
    }

    fetchLogsForSelectedDay();
  }, [selectedDate]);

  const groupedLogs = useMemo(() => {
    if (!logs || logs.length === 0) return [];

    const groups = [];
    let currentGroup = null;

    logs.forEach((log) => {
      const date = new Date(log.loggedAt);
      const hour = date.getHours();
      const timeLabel = `${hour.toString().padStart(2, "0")}:00`;

      if (!currentGroup || currentGroup.time !== timeLabel) {
        currentGroup = { time: timeLabel, items: [] };
        groups.push(currentGroup);
      }
      currentGroup.items.push(log);
    });

    return groups;
  }, [logs]);

  const macros = [
    { macro: "", Icon: Flame },
    { macro: "P", Icon: null },
    { macro: "C", Icon: null },
    { macro: "F", Icon: null },
  ];

  const totalsFromLogs = useMemo(() => {
    return logs.reduce(
      (acc, log) => {
        acc.calories += log.calories || 0;
        acc.protein += log.protein || 0;
        acc.carbs += log.carbs || 0;
        acc.fat += log.fat || 0;
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [logs]);

  const trackedValues = [
    Math.round(totalsFromLogs.calories),
    +totalsFromLogs.protein.toFixed(1),
    +totalsFromLogs.carbs.toFixed(1),
    +totalsFromLogs.fat.toFixed(1),
  ];

  const totalValues = [2500, 180, 320, 70];

  async function handleRemoveLog(logId) {
    const previousLogs = [...logs];
    setLogs((prev) => prev.filter((log) => log._id !== logId));

    try {
      const res = await fetch(`/api/foodLog?id=${logId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");
    } catch (err) {
      console.error(err);
      alert("Could not delete item");
      setLogs(previousLogs);
    }
  }

  async function handleGramsChange(logId, newGrams) {
    const previousLogs = [...logs];

    setLogs((prev) =>
      prev.map((log) =>
        log._id === logId ? { ...log, grams: newGrams } : log
      )
    );

    if (newGrams === "") return;

    try {
      const res = await fetch("/api/foodLog", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: logId, grams: Number(newGrams) }),
      });

      if (!res.ok) throw new Error("Failed to update grams");

      const updatedLog = await res.json();

      setLogs((prev) =>
        prev.map((log) => (log._id === updatedLog._id ? updatedLog : log))
      );
    } catch (err) {
      console.error(err);
      alert("Could not update grams");
      setLogs(previousLogs);
    }
  }

  function handlePrevDay() {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() - 1);
      return d;
    });
  }

  function handleNextDay() {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(prev.getDate() + 1);
      return d;
    });
  }

  return (
    <div className="w-full h-full flex flex-col">

      <div className="shrink-0">
        <OverviewNavbar />

        <div className="w-full h-[2px] my-6 bg-brand-grey3" />

        <div className="w-full flex justify-between gap-2 mt-6 items-center">

          <button
            type="button"
            onClick={handlePrevDay}
            className="
              p-1 rounded-2xl
              text-brand-purple2
              hover:text-brand-purple1
              active:text-brand-purple3
              transition-colors
            "
          >
            <Play className="transform rotate-180 fill-current" />
          </button>

          {weekDays.map((dateObj, index) => (
            <Pill
              key={index}
              weekday={labels[index]}
              date={dateObj.getDate()}
              isActive={isSameDay(dateObj, selectedDate)}
              onClick={() => setSelectedDate(dateObj)}
            />
          ))}

          <button
            type="button"
            onClick={handleNextDay}
            className="
              p-1 rounded-2xl
              text-brand-purple2
              hover:text-brand-purple1
              active:text-brand-purple3
              transition-colors
            "
          >
            <Play className="fill-current" />
          </button>
        </div>

        <div className="w-full flex gap-4 mt-2 mb-6">
          {macros.map((item, index) => (
            <MacroState
              key={index}
              Icon={item.Icon}
              macro={item.macro}
              tracked={trackedValues[index]}
              total={totalValues[index]}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 bg-brand-grey2 rounded-t-[2.5rem] overflow-y-auto py-4 px-2 mt-2">
        {loadingLogs && (
          <p className="text-xs text-brand-grey4 text-center mt-4">
            Loading tracked foods…
          </p>
        )}

        {!loadingLogs && logError && (
          <p className="text-xs text-red-500 text-center mt-4">
            Error: {logError}
          </p>
        )}

        {!loadingLogs && !logError && logs.length === 0 && (
          <p className="text-xs text-brand-grey4 text-center mt-4">
            No foods tracked yet this day.
          </p>
        )}

        {!loadingLogs &&
          !logError &&
          groupedLogs.map((group) => (
            <div key={group.time} className="mb-6">
              <h3 className="text-brand-grey4 text-sm font-bold mb-3 ml-2">
                {group.time}
              </h3>

              <div className="flex flex-col gap-3">
                {group.items.map((log) => {
                  const Icon = resolveFoodIcon(log.food?.icon || "Egg");
                  return (
                    <ONC
                      key={log._id}
                      Icon={Icon}
                      name={log.foodName}
                      calories={Math.round(log.calories)}
                      protein={+log.protein.toFixed(1)}
                      carbs={+log.carbs.toFixed(1)}
                      fat={+log.fat.toFixed(1)}
                      grams={log.grams}
                      onRemove={() => handleRemoveLog(log._id)}
                      onGramsChange={(newGrams) =>
                        handleGramsChange(log._id, newGrams)
                      }
                      className="bg-brand-grey3"
                    />
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
