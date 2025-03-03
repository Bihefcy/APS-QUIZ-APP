<!-- QuizResultsPage.vue -->
<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Group {{ store.selectedGroup + 1 }} Questions</h1>
        <router-link 
          to="/" 
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Quiz
        </router-link>
      </div>

      <div class="space-y-8">
        <div 
          v-for="(question, index) in store.currentGroupQuestions" 
          :key="question._id"
          class="border-b pb-6 last:border-b-0"
        >
          <div class="flex items-start gap-4">
            <span class="bg-gray-100 px-3 py-1 rounded-full text-gray-600 font-medium">
              Q{{ index + 1 }}
            </span>
            <div class="flex-1">
              <h3 class="text-xl font-medium mb-4">{{ question.question }}</h3>
              
              <div v-if="question.image" class="mb-4">
                <img 
                  :src="`data:${question.imageType};base64,${question.image}`" 
                  :alt="question.question"
                  class="max-w-full h-auto rounded-lg"
                  @error="handleImageError"
                />
              </div>

              <div class="mt-4">
                <div class="bg-green-50 p-4 rounded-lg">
                  <span class="font-semibold text-green-700">Answer:</span>
                  <span class="ml-2">{{ question.answer }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuizStore } from '../stores/quiz'

const store = useQuizStore();
console.log('Selected Group:', store.selectedGroup);
console.log('Question Groups:', store.questionGroups);

const handleImageError = (e) => {
  console.error('Failed to load image')
  e.target.style.display = 'none'
}
</script>