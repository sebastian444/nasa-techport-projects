<template>
  <NuxtLayout>
    <v-app>
      <v-container>
        <p>{{ status }}</p>
        <p>{{ baseProjectsData?.totalCount }}</p>
        <p>{{ projects.length }}</p>
        <NuxtPage />
      </v-container>
    </v-app>
  </NuxtLayout>
</template>

<script setup>
import { DateTime } from "luxon";
const projects = useProjects();

const dateFormat = "yyyy-MM-dd";
const lastDays = useLastDays();

var todayDate = DateTime.now();
const updatedSince = computed(() => {
  return todayDate
    .minus({ days: parseInt(lastDays.value) || 1 })
    .toFormat(dateFormat);
});

const { data: baseProjectsData, status } = await useFetch(`/api/projects`, {
  query: {
    updatedSince,
  },
});

watch(
  baseProjectsData,
  async (data) => {
    console.log("before if", data?.totalCount);

    if (data?.projects) {
      for (const project of data.projects) {
        const alreadyExists = projects.value.find(
          (p) => p.projectId === project.projectId,
        );

        if (alreadyExists) {
          continue;
        }

        const { data: projectDetails } = await useFetch(
          `/api/projects/${project.projectId}`,
        );

        if (projectDetails?.value?.project) {
          Object.assign(project, projectDetails.value.project);
        }
      }
    }

    console.log("before update of project", data?.totalCount);

    projects.value = data?.projects;
  },
  { deep: true },
);
</script>
