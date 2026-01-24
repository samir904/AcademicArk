export const shouldShowPlannerReminder = () => {
  const lastShown = localStorage.getItem("planner_reminder_date");
  const today = new Date().toDateString();
  return lastShown !== today;
};

export const markPlannerReminderAsShown = () => {
  const today = new Date().toDateString();
  localStorage.setItem("planner_reminder_date", today);
};
