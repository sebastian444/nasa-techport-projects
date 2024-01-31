<template>
  <div class="d-flex flex-wrap">
    <v-card
      height="200"
      width="200"
      class="ma-2"
      v-for="item in projects"
      :title="item.title"
      :subtitle="item.projectId"
    >
      <v-card-actions>
        <NuxtLink :to="`/details/${item.projectId}`"> Details </NuxtLink>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup>
const projects = useProjects();
</script>
