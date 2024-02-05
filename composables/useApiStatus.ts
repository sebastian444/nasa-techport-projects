export const useApiStatus = () => {
  return useState<any>("apiStatus", () => null);
};
