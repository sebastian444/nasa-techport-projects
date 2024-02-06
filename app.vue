<template>
  <NuxtLayout>
    <v-app>
      <v-container>
        <div v-if="debugMode">
          <p>
            projectsCollectionResponse {{ projectsCollectionResponse?.length }}
          </p>
          <p>projectsCollection {{ projectsCollection.length }}</p>
          <p>projectsDetails {{ projectsDetails.length }}</p>
          <p>projectsUpdatedSince {{ projectsUpdatedSince.length }}</p>
          <p>itemsPerPage {{ itemsPerPage }}</p>
          <p>lastDays {{ lastDays }}</p>
          <p>updatedSince {{ updatedSince }}</p>
        </div>
        <NuxtPage />
      </v-container>
    </v-app>
  </NuxtLayout>
</template>

<script setup>
import { DateTime } from "luxon";
const debugMode = process.env.NODE_ENV !== "production";
const logger = new Logger("app", debugMode);
const projectsCollection = useProjectsCollection();
const projectsDetails = useProjectsDetails();
const projectsUpdatedSince = useProjectsUpdatedSince();
const apiStatus = useApiStatus();

const dateFormat = "yyyy-MM-dd";
const lastDays = useLastDays();
const itemsPerPage = useItemsPerPage();

const todayDate = DateTime.now();
const updatedSince = computed(() => {
  return todayDate
    .minus({ days: parseInt(lastDays.value) || 0 })
    .toFormat(dateFormat);
});

const { data: projectsCollectionResponse, status: projectsCollectionStatus } =
  await useAsyncData(
    "projectsCollection",
    async () => {
      let response;
      try {
        response = await $fetch("/api/projects", {
          query: {
            updatedSince: updatedSince.value,
          },
        });
      } catch (error) {
        const msg = `Could not fetch projects`;

        logger.error(msg, error);

        throw new Error(msg);
      }

      return (
        response.projects?.map((p) => ({
          projectId: p.projectId,
          lastUpdated: p.lastUpdated,
        })) || []
      );
    },
    { watch: [updatedSince] },
  );

watch(
  projectsCollectionStatus,
  (newStatus) => {
    apiStatus.value = newStatus;
  },
  { immediate: true },
);

watch(
  projectsCollectionResponse,
  (projectsCollectionResponse) => {
    // This is the actual list to be shown and paginated
    projectsUpdatedSince.value = projectsCollectionResponse;

    try {
      for (const project of projectsCollectionResponse) {
        const alreadyExists = projectsCollection.value.find(
          (p) => p.projectId === project.projectId,
        );

        if (alreadyExists) {
          logger.info(
            "already existing! not updating projectsCollection",
            project.projectId,
          );
          continue;
        }

        logger.info("updating projectsCollection", project.projectId);

        projectsCollection.value.push(project);
      }
    } catch (error) {
      logger.error(error);
    }
  },
  { immediate: true },
);

await useAsyncData(
  "projectsDetails",
  async () => {
    for (const project of projectsCollection.value) {
      const alreadyExists = projectsDetails.value.find(
        (p) => p.projectId === project.projectId,
      );

      if (alreadyExists) {
        logger.info(
          "already existing! not fetching details",
          project.projectId,
        );
        continue;
      }

      let response;
      try {
        response = await $fetch(`/api/projects/${project.projectId}`);
      } catch (error) {
        const msg = `Could not fetch project details`;

        logger.error(msg, project.projectId, error);

        throw new Error(msg);
      }

      if (response?.project) {
        const alreadyExists = projectsDetails.value.find(
          (p) => p.projectId === project.projectId,
        );

        if (alreadyExists) {
          logger.info(
            "already existing! not updating projectsDetails",
            project.projectId,
          );
          continue;
        }

        logger.info("updating projectsDetails", project.projectId);

        if (response.project) {
          projectsDetails.value.push(response.project);
        }
      }
    }

    return true;
  },
  {
    lazy: true,
    watch: [computed(() => projectsCollection.value.length)],
  },
);
</script>
