export const useProjectsUpdatedSince = () => {
  return useState<ProjectBase[]>("projectsUpdatedSince", () => []);
};
