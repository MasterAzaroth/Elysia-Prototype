export const MUSCLE_PRIORITY = {
  Back: 1,
  Chest: 2,
  Legs: 3,
  Shoulders: 4,
  Arms: 5,
  Core: 6,
  Other: 99,
};

export function categorizeMuscle(muscleRaw) {
  if (!muscleRaw) return "Other";
  const m = muscleRaw.toLowerCase();

  if (m.includes("lat") || m.includes("back") || m.includes("row")) return "Back";
  if (m.includes("chest") || m.includes("pec")) return "Chest";

  if (
    m.includes("quad") ||
    m.includes("hamstring") ||
    m.includes("glute") ||
    m.includes("calf") ||
    m.includes("adductor") ||
    m.includes("abductor") ||
    m.includes("leg")
  ) {
    return "Legs";
  }

  if (
    m.includes("shoulder") ||
    m.includes("deltoid") ||
    m.includes("delt") ||
    m.includes("overhead")
  ) {
    return "Shoulders";
  }

  if (
    m.includes("core") ||
    m.includes("abs") ||
    m.includes("abdom") ||
    m.includes("oblique")
  ) {
    return "Core";
  }

  if (m.includes("bicep") || m.includes("tricep") || m.includes("arm") || m.includes("curl")) {
    return "Arms";
  }

  return "Other";
}

export function estimate1RM(weight, reps) {
  const w = Number(weight) || 0;
  const r = Number(reps) || 0;
  if (w <= 0 || r <= 0) return 0;
  return Math.round(w * (1 + r / 30));
}

export function formatDateDE(dateLike) {
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function startOfWeekMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

const MAIN_LIFTS = {
  bench: {
    label: "Bench Press",
    match: ["bench"],
  },
  squat: {
    label: "Squat",
    match: ["squat"],
  },
  deadlift: {
    label: "Deadlift",
    match: ["deadlift"],
  },
};

export function computeMainLift1RMs(logs) {
  const result = {
    bench: null,
    squat: null,
    deadlift: null,
  };

  for (const log of logs || []) {
    const workoutDate = new Date(log.date);

    for (const ex of log.exercises || []) {
      const title = (ex.title || "").toLowerCase();

      for (const [key, cfg] of Object.entries(MAIN_LIFTS)) {
        if (!cfg.match.some((token) => title.includes(token))) continue;

        for (const set of ex.sets || []) {
          const est = estimate1RM(set.weight, set.reps);
          if (!est) continue;

          const current = result[key];
          if (!current || est > current.estimated1RM) {
            result[key] = {
              liftKey: key,
              label: cfg.label,
              estimated1RM: est,
              weight: set.weight,
              reps: set.reps,
              date: workoutDate,
            };
          }
        }
      }
    }
  }

  return result;
}

export function computeStrongestLiftLast7Days(logs) {
  const now = new Date();

  const lookbackWindow = new Date(now);
  lookbackWindow.setDate(now.getDate() - 30);

  let strongest = null;

  for (const log of logs || []) {
    const workoutDate = new Date(log.date);

    if (workoutDate < lookbackWindow) continue;

    for (const ex of log.exercises || []) {
      for (const set of ex.sets || []) {
        const est = estimate1RM(set.weight, set.reps);
        if (!est) continue;

        if (!strongest || est > strongest.estimated1RM) {
          strongest = {
            exerciseTitle: ex.title,
            estimated1RM: est,
            weight: set.weight,
            reps: set.reps,
            muscle: ex.muscle || "",
            date: workoutDate,
          };
        }
      }
    }
  }

  return strongest;
}

export function computeWeeklySetVolumeLast8Weeks(logs) {
  const now = new Date();
  const eightWeeksAgo = new Date(now);
  eightWeeksAgo.setDate(now.getDate() - 56);

  const weekly = {};

  for (const log of logs || []) {
    const workoutDate = new Date(log.date);
    if (workoutDate < eightWeeksAgo) continue;

    const weekStart = startOfWeekMonday(workoutDate);
    const key = weekStart.toISOString().slice(0, 10);

    let setCount = 0;
    for (const ex of log.exercises || []) {
      setCount += (ex.sets || []).length;
    }

    if (setCount > 0) {
      weekly[key] = (weekly[key] || 0) + setCount;
    }
  }

  const entries = Object.entries(weekly).sort(([d1], [d2]) => d1.localeCompare(d2));

  return entries.map(([weekStart, sets], idx) => ({
    weekStart,
    label: `W${idx + 1}`,
    sets,
  }));
}

export function computeMuscleSetDistributionLast8Weeks(logs) {
  const now = new Date();
  const eightWeeksAgo = new Date(now);
  eightWeeksAgo.setDate(now.getDate() - 56);

  const thisWeekStart = startOfWeekMonday(now);
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(thisWeekStart.getDate() - 7);
  const lastWeekEnd = new Date(thisWeekStart);
  lastWeekEnd.setMilliseconds(lastWeekEnd.getMilliseconds() - 1);

  const totalSetsAll = {};
  const lastWeekSets = {};

  for (const log of logs || []) {
    const workoutDate = new Date(log.date);
    if (workoutDate < eightWeeksAgo) continue;

    const inLastWeek =
      workoutDate >= lastWeekStart && workoutDate <= lastWeekEnd;

    for (const ex of log.exercises || []) {
      const muscle = categorizeMuscle(ex.muscle);
      const setsCount = (ex.sets || []).length;
      if (!setsCount) continue;

      totalSetsAll[muscle] = (totalSetsAll[muscle] || 0) + setsCount;

      if (inLastWeek) {
        lastWeekSets[muscle] = (lastWeekSets[muscle] || 0) + setsCount;
      }
    }
  }

  const weeks = 8;
  const arr = Object.entries(totalSetsAll).map(([muscle, total]) => ({
    muscle,
    avgSets: Math.round(total / weeks),
    lastWeekSets: lastWeekSets[muscle] || 0,
  }));

  arr.sort((a, b) => {
    const priA = MUSCLE_PRIORITY[a.muscle] ?? 999;
    const priB = MUSCLE_PRIORITY[b.muscle] ?? 999;
    if (priA === priB) return b.avgSets - a.avgSets;
    return priA - priB;
  });

  return arr;
}
