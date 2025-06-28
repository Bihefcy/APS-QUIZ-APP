<template>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
      <button
        v-for="(group, index) in groups"
        :key="index"
        @click="$emit('groupSelected', index)"
        class="p-4 bg-blue-100 rounded-lg hover:bg-blue-200"
      >
        Group {{ index + 1 }}
        <div class="text-sm text-gray-600">
          {{ group.length }} questions
        </div>
      </button>
    </div>
  </template>
  
  <script setup>
  
  const props = defineProps({
    groups: {
      type: Array,
      required: true
    }
  });
  defineEmits(['groupSelected']);
  </script>