function dayKey(dateLike) {
  if (!dateLike) return null;

  if (typeof dateLike === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateLike)) {
    return dateLike;
  }

  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return null;

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  
  return `${year}-${month}-${day}`;
}

function startOfWeekMonday(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return new Date();
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function computeStreakStats(daySet) {
  if (!daySet || daySet.size === 0) {
    return { current: 0, best: 0 };
  }

  const keys = Array.from(daySet).sort();

  let best = 1;
  let run = 1;

  for (let i = 1; i < keys.length; i++) {
    const prev = new Date(keys[i - 1]);
    const curr = new Date(keys[i]);
    const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);

    if (Math.round(diffDays) === 1) {
      run += 1;
    } else {
      if (run > best) best = run;
      run = 1;
    }
  }
  if (run > best) best = run;

  let current = 0;
  let cursor = new Date();

  const todayKey = dayKey(cursor);
  if (daySet.has(todayKey)) {
    current = 1;
    cursor.setDate(cursor.getDate() - 1);
  } else {
    cursor.setDate(cursor.getDate() - 1);
    if (!daySet.has(dayKey(cursor))) {
        return { current: 0, best };
    }
  }

  while (true) {
    const key = dayKey(cursor);
    if (!key || !daySet.has(key)) break;
    current += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return { current, best };
}

export function computeTrainingStreak(exerciseLogs) {
  const days = new Set();

  for (const log of exerciseLogs || []) {
    const key = dayKey(log.date);
    if (key) days.add(key);
  }

  return computeStreakStats(days);
}

export function computeNutritionStreak(foodLogs, calorieTarget) {
  if (!calorieTarget) {
    return { current: 0, best: 0 };
  }

  const totalsByDay = new Map();

  for (const log of foodLogs || []) {
    const key = log.day || dayKey(log.loggedAt || log.date || log.createdAt);
    if (!key) continue;

    if (!totalsByDay.has(key)) {
      totalsByDay.set(key, 0);
    }
    const prev = totalsByDay.get(key);
    const cals = Number(log.totalCalories ?? log.calories ?? log.kcal ?? 0);
    totalsByDay.set(key, prev + (cals || 0));
  }

  const successDays = new Set();
  const tol = 0.15;

  for (const [key, totalCals] of totalsByDay.entries()) {
    const ratio = totalCals / calorieTarget;
    if (ratio >= 1 - tol && ratio <= 1 + tol) {
      successDays.add(key);
    }
  }

  return computeStreakStats(successDays);
}

export function computeLastWeekSummary(exerciseLogs, foodLogs, targets) {
  const now = new Date();

  const endPeriod = new Date(now);
  endPeriod.setHours(23, 59, 59, 999);
  
  const startPeriod = new Date(now);
  startPeriod.setDate(now.getDate() - 6);
  startPeriod.setHours(0, 0, 0, 0);

  let workouts = 0;
  for (const log of exerciseLogs || []) {
    const d = new Date(log.date);
    if (!Number.isNaN(d.getTime()) && d >= startPeriod && d <= endPeriod) {
      workouts += 1;
    }
  }

  let weekCalories = 0;
  let weekProtein = 0;
  let weekCarbs = 0;
  let weekFat = 0;

  for (const log of foodLogs || []) {
    const raw = log.day || log.loggedAt || log.date || log.createdAt;
    if (!raw) continue;

    const d = new Date(raw);
    if (Number.isNaN(d.getTime()) || d < startPeriod || d > endPeriod) {
      continue;
    }

    weekCalories += Number(log.totalCalories ?? log.calories ?? log.kcal ?? 0);
    weekProtein += Number(log.totalProtein ?? log.protein ?? 0);
    weekCarbs += Number(log.totalCarbs ?? log.carbs ?? 0);
    weekFat += Number(log.totalFat ?? log.fat ?? 0);
  }

  const days = 7;
  const cGoal = Number(targets?.calorieTarget) || 0;
  const pGoal = Number(targets?.protein) || 0;
  const cGoalG = Number(targets?.carbs) || 0;
  const fGoal = Number(targets?.fat) || 0;

  const weekCalGoal = cGoal * days;
  const weekPGoal = pGoal * days;
  const weekCGoal = cGoalG * days;
  const weekFGoal = fGoal * days;

  const pct = (actual, goal) =>
    goal > 0 ? Math.round((actual / goal) * 100) : 0;

  return {
    workouts,
    caloriePct: pct(weekCalories, weekCalGoal),
    proteinPct: pct(weekProtein, weekPGoal),
    carbsPct: pct(weekCarbs, weekCGoal),
    fatPct: pct(weekFat, weekFGoal),
  };
}

export function computeLastWeekWorkoutTypes(exerciseLogs) {

  const now = new Date();
  
  const endPeriod = new Date(now);
  endPeriod.setHours(23, 59, 59, 999);
  
  const startPeriod = new Date(now);
  startPeriod.setDate(now.getDate() - 6);
  startPeriod.setHours(0, 0, 0, 0);

  const counts = {};

  for (const log of exerciseLogs || []) {
    const d = new Date(log.date);
    if (!Number.isNaN(d.getTime()) && d >= startPeriod && d <= endPeriod) {
      const type = log.workoutTitle || "Unknown";
      counts[type] = (counts[type] || 0) + 1;
    }
  }

  const sorted = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  return sorted.slice(0, 4);
}

export function computeMonthlyConsistencyCalendar(
  exerciseLogs,
  foodLogs,
  targets,
  year,
  month
) {
  const trainingDays = new Set();
  for (const log of exerciseLogs || []) {
    const key = dayKey(log.date);
    if (key) trainingDays.add(key);
  }

  const totalsByDay = new Map();
  for (const log of foodLogs || []) {
    const key = log.day || dayKey(log.loggedAt || log.date || log.createdAt);
    if (!key) continue;

    if (!totalsByDay.has(key)) {
      totalsByDay.set(key, 0);
    }
    const prev = totalsByDay.get(key);
    const cals = Number(log.totalCalories ?? log.calories ?? log.kcal ?? 0);
    totalsByDay.set(key, prev + (cals || 0));
  }

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const totalDays = last.getDate();

  const firstJsDay = first.getDay();

  const firstCol = firstJsDay === 0 ? 6 : firstJsDay - 1;

  const totalCells = firstCol + totalDays;
  const weeks = [];
  let week = [];

  for (let i = 0; i < totalCells; i++) {
    if (i < firstCol) {
      week.push(null);
    } else {
      const dayNumber = i - firstCol + 1;
      const d = new Date(year, month, dayNumber);
      const key = dayKey(d);

      const hasTraining = trainingDays.has(key);
      const hasNutrition = totalsByDay.has(key);

      let score = 0;
      if (hasTraining || hasNutrition) score = 1;
      if (hasTraining && hasNutrition) score = 2;

      week.push({
        key,
        date: d,
        day: dayNumber,
        score,
        training: hasTraining,
        nutrition: hasNutrition,
      });
    }

    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  return { weeks };
}

export function computeWorkoutFrequency(exerciseLogs, weeks = 8) {
  const now = new Date();
  const thisWeekStart = startOfWeekMonday(now);

  const data = [];

  for (let offset = weeks - 1; offset >= 0; offset--) {
    const start = new Date(thisWeekStart);
    start.setDate(thisWeekStart.getDate() - offset * 7);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    let count = 0;
    for (const log of exerciseLogs || []) {
      const d = new Date(log.date);
      if (!Number.isNaN(d.getTime()) && d >= start && d <= end) {
        count += 1;
      }
    }

    data.push({
      label: start.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
      }),
      workouts: count,
    });
  }

  return data;
}