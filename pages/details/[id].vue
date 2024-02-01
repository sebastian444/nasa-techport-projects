<template>
  <v-btn
    class="mb-4"
    nuxt
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
  <div v-else>Project not found</div>
</template>

<script setup>
const route = useRoute();

const projects = useProjects();

const match = projects.value.find((p) => {
  return p.projectId === parseInt(route.params.id);
});

const project = ref(match);
</script>
