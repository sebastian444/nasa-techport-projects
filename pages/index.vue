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
      v-for="item in projects"
      :title="item.title"
      :subtitle="item.lastUpdated"
    >
      <v-card-actions>
        <v-btn nuxt :to="`/details/${item.projectId}`"> Details </v-btn>
      </v-card-actions>
    </v-card>
  </div>

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

const items = [10, 25, 50];

const itemsPerPage = ref(10);

const paginationLength = computed(() => {
  return Math.round(projects.value.length / 10);
});

const page = ref(1);

const pageItems = computed(() => {
  return projects.value.splice();
});
</script>
