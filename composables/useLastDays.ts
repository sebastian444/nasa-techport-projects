export const useLastDays = () => {
  return useState<string>("lastDays", () => {
    const lastDaysParam = useRoute().query.lastDays;

    if (typeof lastDaysParam === "string") {
      return lastDaysParam;
    }

    return "7";
  });
};
