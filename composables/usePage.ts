export const usePage = () => {
  return useState<any>("page", () => 1);
};
