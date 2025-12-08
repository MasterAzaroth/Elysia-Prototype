function dateKey(dateLike) {
  if (!dateLike) return null;
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export function getTodayStats(foodLogs, targets) {
  const todayKey = dateKey(new Date());

  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;

  for (const log of foodLogs || []) {

    const logKey =
      log.day ||
      dateKey(log.loggedAt || log.date || log.createdAt);

    if (!logKey || logKey !== todayKey) continue;

    calories += Number(
      log.totalCalories ??
        log.calories ??
        log.kcal ??
        log.total_kcal ??
        0
    );
    protein += Number(log.totalProtein ?? log.protein ?? 0);
    carbs += Number(log.totalCarbs ?? log.carbs ?? 0);
    fat += Number(log.totalFat ?? log.fat ?? 0);
  }

  const calorieTarget = targets?.calorieTarget || 0;
  const diff = calories - calorieTarget;

  let status = "On track";
  if (calorieTarget > 0) {
    const deviation = Math.abs(diff) / calorieTarget;
    if (deviation > 0.2 && diff > 0) status = "Over target";
    else if (deviation > 0.2 && diff < 0) status = "Under target";
  }

  return {
    calories,
    protein,
    carbs,
    fat,
    calorieTarget,
    diff,
    status,
  };
}

export function getLastMealInfo(foodLogs) {
  if (!foodLogs || foodLogs.length === 0) return null;

  let latest = null;

  for (const log of foodLogs) {
    const raw = log.loggedAt || log.createdAt || log.date || log.day;
    if (!raw) continue;

    const time = new Date(raw);
    if (Number.isNaN(time.getTime())) continue;

    if (!latest || time > latest.time) {
      latest = { ...log, time };
    }
  }

  if (!latest) return null;

  return {
    time: latest.time,
  };
}

export function computeWeeklyCaloriesByWeekday(foodLogs, calorieTarget) {
  const now = new Date();

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const eightWeeksAgo = new Date(now);
  eightWeeksAgo.setDate(now.getDate() - 56);

  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const sumByWeekday = Array(7).fill(0);
  const daysByWeekday = Array(7).fill(0);
  const lastWeekCalories = Array(7).fill(0);
  const seenDays = new Set();

  for (const log of foodLogs || []) {
    const rawDate =
      log.day ||
      log.loggedAt ||
      log.date ||
      log.createdAt;

    if (!rawDate) continue;

    const d = new Date(rawDate);
    if (Number.isNaN(d.getTime())) continue;

    const calories =
      Number(
        log.totalCalories ??
          log.calories ??
          log.kcal ??
          log.total_kcal ??
          0
      ) || 0;

    if (!calories) continue;

    const idx = getWeekdayIndex(d);

    if (d >= eightWeeksAgo && d <= now) {
      sumByWeekday[idx] += calories;

      const dk = dateKey(d);
      if (dk) {
        const key = `${idx}-${dk}`;
        if (!seenDays.has(key)) {
          seenDays.add(key);
          daysByWeekday[idx] += 1;
        }
      }
    }

    if (d >= sevenDaysAgo && d <= now) {
      lastWeekCalories[idx] += calories;
    }
  }

  const data = [];

  for (let i = 0; i < 7; i++) {
    const avg =
      daysByWeekday[i] > 0 ? sumByWeekday[i] / daysByWeekday[i] : 0;
    const last = lastWeekCalories[i];

    data.push({
      weekday: weekdayLabels[i],
      avgCalories: Math.round(avg),
      lastWeekCalories: Math.round(last),
    });
  }

  return data;
}

function getWeekdayIndex(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return 0;
  let day = d.getDay();
  if (day === 0) return 6;
  return day - 1;
}

export function computeMacroAdherence(foodLogs, targets) {
  const targetP = Number(targets?.protein) || 0;
  const targetC = Number(targets?.carbs) || 0;
  const targetF = Number(targets?.fat) || 0;

  if (!targetP || !targetC || !targetF) {
    return {
      score: 0,
      protein: { actual: 0, score: 0 },
      carbs: { actual: 0, score: 0 },
      fat: { actual: 0, score: 0 },
    };
  }

  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  let sumP = 0;
  let sumC = 0;
  let sumF = 0;
  let daysCount = 0;

  const totalsByDay = new Map();

  for (const log of foodLogs || []) {
    const rawDate =
      log.day ||
      log.loggedAt ||
      log.date ||
      log.createdAt;

    if (!rawDate) continue;

    const d = new Date(rawDate);
    if (Number.isNaN(d.getTime())) continue;
    if (d < sevenDaysAgo || d > now) continue;

    const key = dateKey(d);
    if (!key) continue;

    if (!totalsByDay.has(key)) {
      totalsByDay.set(key, { p: 0, c: 0, f: 0 });
    }
    const t = totalsByDay.get(key);

    t.p += Number(
      log.totalProtein ??
        log.protein ??
        log.prot ??
        0
    );
    t.c += Number(
      log.totalCarbs ??
        log.carbs ??
        log.carb ??
        0
    );
    t.f += Number(
      log.totalFat ??
        log.fat ??
        log.fats ??
        0
    );
  }

  for (const [, t] of totalsByDay.entries()) {
    sumP += t.p;
    sumC += t.c;
    sumF += t.f;
    daysCount += 1;
  }

  if (daysCount === 0) {
    return {
      score: 0,
      protein: { actual: 0, score: 0 },
      carbs: { actual: 0, score: 0 },
      fat: { actual: 0, score: 0 },
    };
  }

  const avgP = sumP / daysCount;
  const avgC = sumC / daysCount;
  const avgF = sumF / daysCount;

  const scoreP = macroScore(avgP, targetP);
  const scoreC = macroScore(avgC, targetC);
  const scoreF = macroScore(avgF, targetF);

  const overall = Math.round(((scoreP + scoreC + scoreF) / 3) * 100);

  return {
    score: overall,
    protein: { actual: Math.round(avgP), score: Math.round(scoreP * 100) },
    carbs: { actual: Math.round(avgC), score: Math.round(scoreC * 100) },
    fat: { actual: Math.round(avgF), score: Math.round(scoreF * 100) },
  };
}

function macroScore(actual, target) {
  if (!target) return 0;
  const diff = Math.abs(actual - target);
  const ratio = diff / target;
  if (ratio >= 0.5) return 0;
  return 1 - ratio * 2;
}
