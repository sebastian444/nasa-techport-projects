<template>
  <NuxtLayout>
    <v-app>
      <v-container>
        <p>fetched data {{ data?.totalCount }}</p>
        <p>projects {{ projects.length }}</p>
        <p>itemsPerPage {{ itemsPerPage }}</p>
        <p>lastDays {{ lastDays }}</p>
        <p>updatedSince {{ updatedSince }}</p>
        <NuxtPage />
      </v-container>
    </v-app>
  </NuxtLayout>
</template>

<script setup>
import { DateTime } from "luxon";
const projects = useProjects();
const apiStatus = useApiStatus();

const dateFormat = "yyyy-MM-dd";
const lastDays = useLastDays();
const itemsPerPage = useItemsPerPage();

const todayDate = DateTime.now();
const updatedSince = computed(() => {
  return todayDate
    .minus({ days: parseInt(lastDays.value) || 1 })
    .toFormat(dateFormat);
});

const { data, status, error } = await useAsyncData(
  "projects",
  async () => {
    let response;
    try {
      console.log("1: before fetch", updatedSince.value);
      response = await $fetch("/api/projects", {
        query: {
          updatedSince: updatedSince.value,
        },
      });
    } catch (error) {
      const msg = `Could not fetch projects`;

      console.error(msg, error);

      throw new Error(msg);
    }

    if (response.projects) {
      for (const project of response.projects) {
        const alreadyExists = projects.value.find(
          (p) => p.projectId === project.projectId,
        );

        if (alreadyExists) {
          console.log("already existing! not fetching", project.projectId);
          continue;
        }

        console.log("3.*:projectId", project.projectId);
        let projectDetails;
        try {
          projectDetails = await $fetch(`/api/projects/${project.projectId}`);
        } catch (error) {
          const msg = `Could not fetch project details`;

          console.error(msg, project.projectId, error);

          throw new Error(msg);
        }

        console.log("3.*:details response", !!projectDetails);

        if (projectDetails?.project) {
          Object.assign(project, projectDetails.project);
        }
      }
    }

    console.log("--> end");
    return response;
  },
  { watch: [updatedSince] },
);

watch(
  status,
  (newStatus) => {
    apiStatus.value = newStatus;
  },
  { immediate: true },
);

watch(
  data,
  (newData) => {
    if (!newData?.projects) {
      return;
    }

    for (const project of newData?.projects) {
      const alreadyExists = projects.value.find(
        (p) => p.projectId === project.projectId,
      );

      if (alreadyExists) {
        continue;
      }
      console.log("adding project", project.projectId);
      projects.value.push(project);
    }
  },
  { immediate: true },
);
</script>
