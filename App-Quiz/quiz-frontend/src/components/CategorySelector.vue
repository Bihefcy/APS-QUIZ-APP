<template>
  <div class="category-selector w-full">
    <h3 class="mb-4 text-2xl font-bold">Categories:</h3>
    <div class="categories w-full justify-between items-center md:flex">
      <button
        v-for="category in fixedCategories"
        :key="category"
        @click="selectCategory(category)"
        class="p-8 w-full m-2 border-md rounded-md bg-blue-400 text-gray-100 text-xl font-semibold hover:bg-blue-700"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<script setup>
const fixedCategories = [
  'Basic Medical Sciences',
  'Clinical Knowledge',
  'Maths and Logic',
  'General Knowledge'
];

const emit = defineEmits(['categorySelected']);

const selectCategory = (category) => {
  emit('categorySelected', category);
};
</script>