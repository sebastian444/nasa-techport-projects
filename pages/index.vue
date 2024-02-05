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
    <v-card
      width="200"
      class="ma-2"
      v-for="item in pageItems"
      :title="item.title"
      :subtitle="item.lastUpdated"
    >
      <v-card-actions>
        <v-btn nuxt :to="`/details/${item.projectId}`"> Details </v-btn>
      </v-card-actions>
    </v-card>
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
const projects = useProjects();
const lastDays = useLastDays();
const apiStatus = useApiStatus();

const items = [10, 25, 50];

const itemsPerPage = useItemsPerPage();

const paginationLength = computed(() => {
  const value = Math.ceil(projects.value.length / itemsPerPage.value) || 1;

  return value;
});

const page = ref(1);

const pageItems = computed(() => {
  const start = itemsPerPage.value * (page.value - 1);
  return projects.value.slice(start, start + itemsPerPage.value);
});
</script>
