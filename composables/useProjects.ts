export interface Project {
  acronym: string;
  projectId: number;
  title: string;
  primaryTaxonomyNodes: TaxonomyNode[];
  additionalTaxonomyNodes: TaxonomyNode[];
  startTrl: number;
  currentTrl: number;
  endTrl: number;
  benefits: string;
  description: string;
  destinations: Destination[];
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
  statusDescription: string;
  principalInvestigators: PrincipalInvestigator[];
  programDirectors: PrincipalInvestigator[];
  programExecutives: PrincipalInvestigator[];
  programManagers: PrincipalInvestigator[];
  projectManagers: PrincipalInvestigator[];
  website: string;
  libraryItems: any[];
  transitions: any[];
  responsibleMd: ResponsibleMd;
  program: Program;
  leadOrganization: LeadOrganization;
  statesWithWork: State[];
  lastUpdated: string;
  releaseStatusString: string;
  viewCount: number;
  endDateString: string;
  startDateString: string;
}

export interface TaxonomyNode {
  taxonomyNodeId: number;
  taxonomyRootId: number;
  parentNodeId: number;
  level: number;
  code: string;
  title: string;
  definition: string;
  exampleTechnologies?: string;
  hasChildren: boolean;
  hasInteriorContent: boolean;
}

export interface Destination {
  lkuCodeId: number;
  code: string;
  description: string;
  lkuCodeTypeId: number;
  lkuCodeType: LkuCodeType;
}

export interface LkuCodeType {
  codeType: string;
  description: string;
}

export interface LeadOrganization {
  acronym: string;
  canUserEdit: boolean;
  city: string;
  country: Country;
  countryId: number;
  external: boolean;
  linkCount: number;
  organizationId: number;
  organizationName: string;
  organizationType: string;
  stateTerritory: State;
  stateTerritoryId: number;
  naorganization: boolean;
  organizationTypePretty: string;
}

export interface Country {
  abbreviation: string;
  countryId: number;
  name: string;
}

export interface State {
  abbreviation: string;
  country: Country;
  countryId: number;
  name: string;
  stateTerritoryId: number;
}

export interface PrincipalInvestigator {
  contactId: number;
  canUserEdit: boolean;
  displayOrder?: number;
  firstName: string;
  lastName: string;
  fullName: string;
  fullNameInverted: string;
  middleInitial?: string;
  primaryEmail: string;
  publicEmail: boolean;
  nacontact: boolean;
}

export interface Program {
  acronym: string;
  active: boolean;
  programId: number;
  responsibleMd: ResponsibleMd;
  responsibleMdId: number;
  title: string;
}

export interface ResponsibleMd {
  acronym: string;
  canUserEdit: boolean;
  city: string;
  external: boolean;
  linkCount: number;
  organizationId: number;
  organizationName: string;
  organizationType: string;
  naorganization: boolean;
  organizationTypePretty: string;
}

export const useProjects = () => {
  return useState<Project[]>("projects", () => []);
};
