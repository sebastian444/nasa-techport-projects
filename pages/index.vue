<template>
  <v-container>
    <div v-if="debugMode">
      <p>projectsCollectionResponse {{ projectsCollectionResponse?.length }}</p>
      <p>projectsCollection {{ projectsCollection.length }}</p>
      <p>projectsDetails {{ projectsDetails.length }}</p>
      <p>projectsUpdatedSince {{ projectsUpdatedSince.length }}</p>
      <p>itemsPerPage {{ itemsPerPage }}</p>
      <p>lastDays {{ lastDays }}</p>
      <p>updatedSince {{ updatedSince }}</p>
    </div>
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
          type="number"
          min="0"
          class="flex-grow-0"
          label="Last days"
          v-model.number="lastDaysLocal"
          :rules="[rules.required, rules.noNegative]"
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
import debounce from "lodash.debounce";
import { DateTime } from "luxon";

// COMPOSABLES
const projectsUpdatedSince = useProjectsUpdatedSince();
const projectsCollection = useProjectsCollection();
const projectsDetails = useProjectsDetails();
const lastDays = useLastDays();
const apiStatus = useApiStatus();
const page = usePage();
const itemsPerPage = useItemsPerPage();
const debugMode = useDebugMode();
const router = useRouter();
const route = useRoute();

// LOCAL DATA
const logger = new Logger("index", debugMode.value);
const dateFormat = "yyyy-MM-dd";
const todayDate = DateTime.now();
const items = [10, 25, 50];

const lastDaysLocal = ref(lastDays);
const lastDaysIsValid = ref(true);

const rules = reactive({
  required: (value) => {
    if (!value && value !== 0) {
      return "Field is required!";
    }

    return true;
  },
  noNegative: (value) => {
    if (value < 0) {
      lastDaysIsValid.value = false;
      return "No negative values allowed!";
    }

    lastDaysIsValid.value = true;
    return true;
  }
});

watch(
  lastDaysLocal,
  debounce((newValue) => {
    lastDays.value = newValue;
  }, 1000)
);

// COMPUTEDS
const paginationLength = computed(() => {
  const value =
    Math.ceil(projectsUpdatedSince.value.length / itemsPerPage.value) || 1;

  return value;
});

const pageItems = computed(() => {
  const start = itemsPerPage.value * (page.value - 1);
  return projectsUpdatedSince.value.slice(start, start + itemsPerPage.value);
});

const updatedSince = computed(() => {
  let days = 0;

  const lastDaysParsed = parseInt(lastDays.value);

  if (
    lastDaysIsValid.value === true &&
    Number.isInteger(lastDaysParsed) &&
    lastDaysParsed > 0
  ) {
    days = lastDaysParsed;
  }

  return todayDate.minus({ days }).toFormat(dateFormat);
});

watch(
  paginationLength,
  (newPaginationLength) => {
    if (page.value > newPaginationLength) {
      page.value = newPaginationLength;
    }
  },
  { immediate: true }
);

const { data: projectsCollectionResponse, status: projectsCollectionStatus } =
  await useAsyncData(
    "projectsCollection",
    async () => {
      let response;
      if (!lastDaysIsValid.value) {
        return [];
      }

      try {
        response = await $fetch("/api/projects", {
          query: {
            updatedSince: updatedSince.value
          }
        });
      } catch (error) {
        const msg = `Could not fetch projects`;

        logger.error(msg, error);

        throw new Error(msg);
      }

      return (
        response.projects?.map((p) => ({
          projectId: p.projectId,
          lastUpdated: p.lastUpdated
        })) || []
      );
    },
    { watch: [updatedSince] }
  );

watch(
  projectsCollectionStatus,
  (newStatus) => {
    apiStatus.value = newStatus;
  },
  { immediate: true }
);

watch(
  projectsCollectionResponse,
  (projectsCollectionResponse) => {
    // This is the actual list to be shown and paginated
    projectsUpdatedSince.value = projectsCollectionResponse;

    try {
      for (const project of projectsCollectionResponse) {
        const alreadyExists = projectsCollection.value.find(
          (p) => p.projectId === project.projectId
        );

        if (alreadyExists) {
          continue;
        }

        projectsCollection.value.push(project);
      }

      if (route.query.page) {
        page.value = parseInt(route.query.page);
      }

      if (route.query.itemsPerPage) {
        itemsPerPage.value = parseInt(route.query.itemsPerPage);
      }
    } catch (error) {
      logger.error(error);
    }
  },
  { immediate: true }
);

await useAsyncData(
  "projectsDetails",
  async () => {
    for (const project of pageItems.value) {
      const alreadyExists = projectsDetails.value.find(
        (p) => p.projectId === project.projectId
      );

      if (alreadyExists) {
        logger.info(
          "already existing! not fetching details",
          project.projectId
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
          (p) => p.projectId === project.projectId
        );

        if (alreadyExists) {
          logger.info(
            "already existing! not updating projectsDetails",
            project.projectId
          );
          continue;
        }

        if (response.project) {
          projectsDetails.value.push(response.project);
        }
      }
    }

    return true;
  },
  {
    lazy: true,
    watch: [pageItems]
  }
);

watch(
  [lastDaysLocal, page, itemsPerPage],
  debounce(([newLastDaysLocal, newPage, newItemsPerPage]) => {
    if (lastDaysIsValid.value) {
      router.replace({
        query: {
          page: newPage,
          itemsPerPage: newItemsPerPage,
          lastDays: newLastDaysLocal
        }
      });
    }
  }, 1500)
);
</script>
