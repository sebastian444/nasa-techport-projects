<template>
  <v-card width="200" class="ma-2">
    <slot name="subtitle">
      <v-card-subtitle> {{ props?.lastUpdated }}</v-card-subtitle>
    </slot>

    <template v-if="projectDetailsMatch">
      <slot name="title">
        <v-card-title> {{ projectDetailsMatch?.title }}</v-card-title>
      </slot>
      <slot name="actions">
        <v-card-actions>
          <v-btn :to="`/details/${projectDetailsMatch.projectId}`">
            Details
          </v-btn>
        </v-card-actions>
      </slot>
    </template>
    <v-skeleton-loader
      v-else
      max-height="10"
      type="card"
      class="overflow-hidden"
    />
  </v-card>
</template>
<script setup>
const props = defineProps({
  projectId: Number,
  lastUpdated: String
});
const projectsDetails = useProjectsDetails();

const projectDetailsMatch = computed(() => {
  return projectsDetails.value.find((p) => {
    return p.projectId === parseInt(props.projectId);
  });
});
</script>
