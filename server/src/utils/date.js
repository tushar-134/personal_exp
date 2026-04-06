export const getMonthRange = (year, month) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return { start, end };
};

export const getCurrentMonthRange = () => {
  const now = new Date();
  return getMonthRange(now.getFullYear(), now.getMonth() + 1);
};

export const getWeekRange = (date = new Date()) => {
  const base = new Date(date);
  const day = base.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(base);
  start.setHours(0, 0, 0, 0);
  start.setDate(base.getDate() + diff);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return { start, end };
};

export const getMonthKey = (date) => {
  const value = new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}`;
};

export const getWeekKey = (date) => {
  const { start } = getWeekRange(date);
  return `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
};

export const buildMonthLabels = (count = 6) => {
  return Array.from({ length: count }, (_, index) => {
    const target = new Date();
    target.setMonth(target.getMonth() - (count - index - 1), 1);
    target.setHours(0, 0, 0, 0);
    return {
      year: target.getFullYear(),
      month: target.getMonth() + 1,
      key: getMonthKey(target),
      label: target.toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
      }),
    };
  });
};
