// 📊 FILE: FRONTEND/src/HELPERS/attendancePrediction.js
// ✨ NEW: Helper function to calculate attendance predictions

export const calculateAttendancePrediction = (classesAttended, totalClasses, targetPercentage) => {
  if (totalClasses === 0) {
    return {
      type: 'neutral',
      classes: 0,
      message: '📊 Start tracking your attendance'
    };
  }

  const currentPercentage = (classesAttended / totalClasses) * 100;
  const requiredPercentage = targetPercentage || 75;

  // ✨ CASE 1: ON TRACK - Current percentage >= Target
  if (currentPercentage >= requiredPercentage) {
    // Calculate how many classes you can miss and still maintain target
    // Formula: (classesAttended) / (totalClasses + x) >= target/100
    // Solving: x <= (classesAttended * 100 - totalClasses * target) / target

    const classesCanMiss = Math.floor(
      (classesAttended * 100 - totalClasses * requiredPercentage) / requiredPercentage
    );

    if (classesCanMiss > 0) {
      return {
        type: 'on-track',
        classes: classesCanMiss,
        message: `You can miss ${classesCanMiss} class${classesCanMiss > 1 ? 'es' : ''} and maintain ${requiredPercentage}%`,
        color: 'green'
      };
    } else {
      return {
        type: 'on-track',
        classes: 0,
        message: `You're on track at ${currentPercentage.toFixed(1)}%! Keep attending regularly.`,
        color: 'green'
      };
    }
  }

  // ✨ CASE 2: BELOW TARGET - Current percentage < Target
  // Formula: (classesAttended + x) / (totalClasses + x) >= target/100
  // Solving: x >= (totalClasses * target - classesAttended * 100) / (100 - target)

  const classesNeeded = Math.ceil(
    (totalClasses * requiredPercentage - classesAttended * 100) / (100 - requiredPercentage)
  );

  return {
    type: 'need',
    classes: Math.max(1, classesNeeded),
    message: `Attend ${Math.max(1, classesNeeded)} more class${classesNeeded > 1 ? 'es' : ''} to reach ${requiredPercentage}%`,
    color: 'red'
  };
};

// ✨ Overall attendance prediction
export const calculateOverallPrediction = (stats) => {
  if (!stats || stats.overallPercentage === undefined) return null;

  const overallPercentage = stats.overallPercentage;
  const targetPercentage = 75;

  // Count subjects in each category
  const onTrackSubjects = stats.subjectsAbove75 || 0;
  const needAttentionSubjects = stats.subjectsBelow75 || 0;
  const totalSubjects = stats.totalSubjects || 0;

  if (overallPercentage >= targetPercentage) {
    return {
      type: 'on-track',
      status: '✅ Overall On Track',
      message: `Great! Your overall attendance is ${overallPercentage}%. Keep maintaining ${onTrackSubjects}/${totalSubjects} subjects above 75%.`,
      color: 'green'
    };
  } else {
    return {
      type: 'need-improvement',
      status: '⚠️ Needs Improvement',
      message: `Your overall attendance is ${overallPercentage}%. ${needAttentionSubjects} subject${needAttentionSubjects > 1 ? 's' : ''} need${needAttentionSubjects === 1 ? 's' : ''} attention.`,
      color: 'red'
    };
  }
};