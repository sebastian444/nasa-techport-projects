export interface ProjectBase {
  projectId: number;
  lastUpdated: string;
}

export const useProjectsCollection = () => {
  return useState<ProjectBase[]>("projectsCollection", () => []);
};
