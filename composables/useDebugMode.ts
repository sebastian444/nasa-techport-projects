export const useDebugMode = () => {
  return useState<any>(
    "debugMode",
    () => process.env.NODE_ENV !== "production"
  );
};
