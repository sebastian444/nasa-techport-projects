<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<script setup>
import { DateTime } from "luxon";
const projects = useProjects();

const dateFormat = "yyyy-MM-dd";
const lastDaysInterval = ref(7);
var todayDate = DateTime.now();
const updatedSince = computed(() => {
  return todayDate.minus({ days: lastDaysInterval.value }).toFormat(dateFormat);
});

const { data } = await useFetch(`https://techport.nasa.gov/api/projects`, {
  query: {
    updatedSince,
  },
});

if (data?.value?.projects) {
  for (const project of data.value.projects) {
    const alreadyExists = projects.value.find(
      (p) => p.projectId === project.projectId,
    );

    if (alreadyExists) {
      continue;
    }

    const { data: projectDetails } = await useFetch(
      `https://techport.nasa.gov/api/projects/${project.projectId}`,
    );

    if (projectDetails?.value?.project) {
      Object.assign(project, projectDetails.value.project);
    }
  }
}

projects.value = data.value.projects;
</script>
