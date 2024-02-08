const detailsCache = new MemoryCache("details");

export default defineEventHandler(async (event) => {
  const projectIdParam = event.context.params?.id;

  if (!projectIdParam) {
    throw new Error("no projectId defined");
  }

  if (detailsCache.has(projectIdParam)) {
    return detailsCache.get(projectIdParam);
  } else {
    const response: any = await $fetch(
      `https://techport.nasa.gov/api/projects/${projectIdParam}`
    );

    let prunedObject: any;

    try {
      const {
        acronym,
        projectId,
        title,
        benefits,
        description,
        website,
        program,
        leadOrganization,
        responsibleMd,
        projectManagers,
        programManagers,
        principalInvestigators,
        coInvestigators
      } = (response as any).project || {};

      prunedObject = {
        project: {
          acronym,
          projectId,
          title,
          benefits,
          description,
          website
        }
      };

      if (program) {
        prunedObject.project.program = {
          title: program.title,
          description: program.description
        };
      }

      if (leadOrganization) {
        prunedObject.project.leadOrganization = {
          organizationName: leadOrganization.organizationName,
          organizationTypePretty: leadOrganization.organizationTypePretty
        };
      }

      if (responsibleMd) {
        prunedObject.project.responsibleMd = {
          organizationName: responsibleMd.organizationName,
          organizationTypePretty: responsibleMd.organizationTypePretty
        };
      }

      if (projectManagers) {
        prunedObject.project.projectManagers = projectManagers.map(
          ({ contactId, fullName, primaryEmail }: any) => ({
            contactId,
            fullName,
            primaryEmail
          })
        );
      }

      if (programManagers) {
        prunedObject.project.programManagers = programManagers.map(
          ({ contactId, fullName, primaryEmail }: any) => ({
            contactId,
            fullName,
            primaryEmail
          })
        );
      }

      if (principalInvestigators) {
        prunedObject.project.principalInvestigators =
          principalInvestigators.map(
            ({ contactId, fullName, primaryEmail }: any) => ({
              contactId,
              fullName,
              primaryEmail
            })
          );
      }

      if (coInvestigators) {
        prunedObject.project.coInvestigators = coInvestigators.map(
          ({ contactId, fullName, primaryEmail }: any) => ({
            contactId,
            fullName,
            primaryEmail
          })
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error("Could not build prune object");
    }

    detailsCache.set(projectIdParam, prunedObject);

    return prunedObject;
  }
});
