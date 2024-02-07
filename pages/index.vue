<template>
  <v-container>
    <v-row>
      <v-col>
        <v-select
          class="flex-grow-0"
          v-model="itemsPerPage"
          :items="items"
          label="Per Page"
        ></v-select>
      </v-col>
      <v-col>
        <v-text-field
          class="flex-grow-0"
          label="Last days"
          v-model="lastDays"
          hide-details="auto"
        ></v-text-field>
      </v-col>
    </v-row>
  </v-container>

  <div class="d-flex flex-wrap">
    <project-item
      v-for="project in pageItems"
      :key="project.projectId"
      :projectId="project.projectId"
      :lastUpdated="project.lastUpdated"
    />
  </div>

  <v-skeleton-loader
    v-if="['pending', 'error'].includes(apiStatus)"
    max-height="10"
    type="card"
    class="overflow-hidden"
  />

  <v-pagination
    class="flex-grow-1"
    v-model="page"
    :length="paginationLength"
    rounded="circle"
  ></v-pagination>
</template>

<script setup>
const projectsUpdatedSince = useProjectsUpdatedSince();
const lastDays = useLastDays();
const apiStatus = useApiStatus();
const page = usePage();

const route = useRoute();

console.log("------------------ route", route.name, route.path);

const items = [10, 25, 50];

const itemsPerPage = useItemsPerPage();

const paginationLength = computed(() => {
  const value =
    Math.ceil(projectsUpdatedSince.value.length / itemsPerPage.value) || 1;

  return value;
});

const pageItems = computed(() => {
  const start = itemsPerPage.value * (page.value - 1);
  return projectsUpdatedSince.value.slice(start, start + itemsPerPage.value);
});
</script>
