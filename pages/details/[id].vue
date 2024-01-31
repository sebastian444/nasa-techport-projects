<template>
  <div v-if="project">
    <h1>{{ project.title }}</h1>
    <div v-html="project.description" />
    <v-btn v-if="project.website" :href="project.website" target="_blank"
      >website</v-btn
    >
  </div>
  <div v-else>Project not found</div>

  <NuxtLink to="/">go back</NuxtLink>
</template>

<script setup>
const route = useRoute();

const projects = useProjects();

const match = projects.value.find((p) => {
  return p.projectId === parseInt(route.params.id);
});

const project = ref(match);
</script>
