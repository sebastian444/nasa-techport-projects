export const useItemsPerPage = () => {
  return useState<number>("itemsPerPage", () => 10);
};
