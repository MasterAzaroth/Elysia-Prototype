function activityFactor(level) {
  switch (Number(level)) {
    case 1:
      return 1.2;
    case 2:
      return 1.375;
    case 3:
      return 1.55;
    case 4:
      return 1.725;
    case 5:
      return 1.9;
    default:
      return 1.2;
  }
}

function calculateBMR({ gender, weight, height, age }) {
  if (!weight || !height || !age) return 0;

  const w = Number(weight);
  const h = Number(height);
  const a = Number(age);

  if (gender === "female") {
    return 10 * w + 6.25 * h - 5 * a - 161;
  }

  return 10 * w + 6.25 * h - 5 * a + 5;
}

function adjustForGoal(tdee, goalRaw) {
  const goal = (goalRaw || "").toLowerCase();

  if (goal === "bulk") {
    return tdee * 1.1;
  }
  if (goal === "cut") {
    return tdee * 0.8;
  }
  if (goal === "recomp") {
    return tdee * 0.95;
  }
  return tdee;
}

const MACRO_PRESETS = {
  "high protein": {
    bulk:   { proteinKg: 2.3, fatKg: 1.0 },
    cut:    { proteinKg: 2.5, fatKg: 0.9 },
    recomp: { proteinKg: 2.3, fatKg: 0.9 },
  },
  "high carbs": {
    bulk:   { proteinKg: 2.0, fatKg: 0.7 },
    cut:    { proteinKg: 2.2, fatKg: 0.7 },
    recomp: { proteinKg: 2.0, fatKg: 0.8 },
  },
  balanced: {
    bulk:   { proteinKg: 2.1, fatKg: 0.9 },
    cut:    { proteinKg: 2.3, fatKg: 0.8 },
    recomp: { proteinKg: 2.1, fatKg: 0.9 },
  },
};

function pickPreset(preferenceRaw, goalRaw) {
  const prefKey = (preferenceRaw || "balanced").toLowerCase();
  const goalKey = (goalRaw || "recomp").toLowerCase();

  const pref =
    MACRO_PRESETS[prefKey] || MACRO_PRESETS["balanced"];

  return (
    pref[goalKey] ||
    pref["recomp"] || { proteinKg: 2.1, fatKg: 0.9 }
  );
}

export function calculateNutritionTargets(user = {}) {
  const {
    gender = "male",
    weight,
    height,
    age,
    activity_level,
    nutritional_goal,
    nutritional_preference,
  } = user;

  if (!weight || !height || !age) {
    return {
      calorieTarget: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
  }

  const w = Number(weight);

  const bmr = calculateBMR({ gender, weight: w, height, age });
  const tdee = bmr * activityFactor(activity_level);

  const adjustedCalories = adjustForGoal(tdee, nutritional_goal);

  const { proteinKg, fatKg } = pickPreset(
    nutritional_preference,
    nutritional_goal
  );

  const protein = Math.round(w * proteinKg);

  const minFat = Math.round(w * 0.6);
  const plannedFat = Math.round(w * fatKg);
  const fat = Math.max(plannedFat, minFat);

  const caloriesFromProtein = protein * 4;
  const caloriesFromFat = fat * 9;

  let calorieTarget = Math.round(adjustedCalories);
  let remainingCalories =
    calorieTarget - caloriesFromProtein - caloriesFromFat;

  let carbs = 0;

  if (remainingCalories > 0) {

    carbs = Math.round(remainingCalories / 4);
  } else {

    const totalPF = caloriesFromProtein + caloriesFromFat;
    if (totalPF > 0 && calorieTarget > 0) {
      const scale = calorieTarget / totalPF;
      const scaledProtein = Math.round(protein * scale);
      const scaledFat = Math.round(fat * scale);

      const scaledProteinCals = scaledProtein * 4;
      const scaledFatCals = scaledFat * 9;

      calorieTarget = scaledProteinCals + scaledFatCals;
      carbs = 0;

      return {
        calorieTarget,
        protein: scaledProtein,
        carbs,
        fat: scaledFat,
      };
    }
  }

  return {
    calorieTarget,
    protein,
    carbs,
    fat,
  };
}
