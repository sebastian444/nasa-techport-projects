<template>
  <v-btn
    class="mb-4"
    to="/"
    icon="mdi-backburger"
    size="small"
    variant="tonal"
    color="blue-lighten-1"
  ></v-btn>
  <div v-if="project" class="d-flex flex-column">
    <h1 class="text-h5 text-blue-darken-3">{{ project.title }}</h1>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-expansion-panels>
            <v-expansion-panel title="Description">
              <v-expansion-panel-text>
                <div
                  class="text-justify mt-2 text-body-1"
                  v-html="project.description"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel title="Benefits">
              <v-expansion-panel-text>
                <div
                  class="text-justify mt-2 text-body-1"
                  v-html="project.benefits"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
            <v-expansion-panel v-if="project.program" title="Program">
              <v-expansion-panel-text>
                <h3 class="text-h6 text-blue-darken-1">
                  {{ project.program.title }}
                </h3>
                <div
                  class="text-justify mt-2 text-body-1"
                  v-html="project.program?.description"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12" md="6">
          <v-card
            v-if="project.leadOrganization?.organizationName"
            variant="tonal"
            color="primary"
          >
            <v-card-item>
              <div>
                <div class="text-overline mb-1">Lead Organization</div>
                <div class="text-h6 mb-1">
                  {{ project.leadOrganization?.organizationName }}
                </div>
                <div class="text-caption">
                  {{ project.leadOrganization?.organizationTypePretty }}
                </div>
              </div>
            </v-card-item>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" align-self="stretch">
          <v-card
            v-if="project.responsibleMd?.organizationName"
            variant="outlined"
            color="primary"
          >
            <v-card-item>
              <div>
                <div class="text-overline mb-1">Supportive Organization</div>
                <div class="text-h6 mb-1">
                  {{ project.responsibleMd?.organizationName }}
                </div>
                <div class="text-caption">
                  {{ project.responsibleMd?.organizationTypePretty }}
                </div>
              </div>
            </v-card-item>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col col="auto" v-if="project.projectManagers">
          <contacts-list
            title="Project Managers"
            :contacts="project.projectManagers"
          ></contacts-list>
        </v-col>
        <v-col col="auto" v-if="project.programManagers">
          <contacts-list
            title="Program Managers"
            :contacts="project.programManagers"
          ></contacts-list>
        </v-col>
        <v-col col="auto" v-if="project.principalInvestigators">
          <contacts-list
            title="Principal Investigators"
            :contacts="project.principalInvestigators"
          ></contacts-list>
        </v-col>
        <v-col col="auto" v-if="project.coInvestigators">
          <contacts-list
            title="Co-Investigators"
            :contacts="project.coInvestigators"
          ></contacts-list>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      v-if="project.website"
      class="mt-4 align-self-end"
      :href="project.website"
      target="_blank"
      >website</v-btn
    >
  </div>
  <div v-else>
    <v-alert
      icon="mdi-alert"
      text="Project not found"
      type="warning"
      variant="tonal"
    />
  </div>
</template>

<script setup>
// COMPOSABLES
const route = useRoute();
const debugMode = useDebugMode();
const projectsCollection = useProjectsCollection();
const projectsDetails = useProjectsDetails();

// LOCAL
const logger = new Logger("index", debugMode.value);

const project = ref();

const match = projectsDetails.value.find((p) => {
  return p.projectId === parseInt(route.params.id);
});

if (match) {
  logger.info("match found!", match);
  /**
   * This is when user navigated from index page
   * and details is already available
   */
  project.value = match;
} else {
  await useAsyncData(
    "projectsDetails",
    async () => {
      logger.info("will fetch details");
      let response;
      try {
        response = await $fetch(`/api/projects/${route.params.id}`);
      } catch (error) {
        const msg = `Could not fetch project details`;

        logger.error(msg, project.projectId, error);

        throw new Error(msg);
      }

      if (response?.project) {
        const alreadyExists = projectsDetails.value.find(
          (p) => p.projectId === project.projectId
        );

        if (alreadyExists) {
          logger.info(
            "already existing! not updating projectsDetails",
            project.projectId
          );
          return true;
        }

        if (response.project) {
          /**
           * Save to projectsCollection and projectsDetails
           *  In case user go to index page, then is in the state already
           *
           * Also update local project, so page load.
           */
          const alreadyExistsInCollection = projectsCollection.value.find(
            (p) => p.projectId === project.projectId
          );

          if (!alreadyExistsInCollection) {
            projectsCollection.value.push(response.project);
          }

          projectsDetails.value.push(response.project);
          project.value = response.project;
        }
      }

      return true;
    },
    {
      watch: [route.params.id]
    }
  );
}
</script>
