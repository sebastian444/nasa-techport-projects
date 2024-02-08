export const usePage = () => {
  return useState<any>("page", () => {
    const pageParam = useRoute().query.page;

    if (typeof pageParam === "string") {
      return parseInt(pageParam);
    }

    return 1;
  });
};
