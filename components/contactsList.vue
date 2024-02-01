<template>
  <v-card>
    <v-list lines="two">
      <v-list-subheader>{{ props.title }}</v-list-subheader>
      <template v-for="person in props.contacts">
        <v-list-item :title="person.fullName">
          <template v-slot:subtitle>
            <span class="font-weight-bold">{{ person.primaryEmail }}</span>
          </template>
        </v-list-item>
        <v-divider></v-divider>
      </template>
    </v-list>
  </v-card>
</template>
<script setup>
const props = defineProps({
  title: String,
  contacts: Array,
});
</script>
