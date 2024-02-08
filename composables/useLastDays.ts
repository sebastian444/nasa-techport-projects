export const useLastDays = () => {
  return useState<string>("lastDays", () => "7");
};
