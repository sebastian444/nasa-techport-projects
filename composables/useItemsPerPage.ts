export const useItemsPerPage = () => {
  return useState<number>("itemsPerPage", () => {
    const itemsPerPageParam = useRoute().query.itemsPerPage;

    if (typeof itemsPerPageParam === "string") {
      return parseInt(itemsPerPageParam);
    }

    return 10;
  });
};
