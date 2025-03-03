<template>
    <div class="p-4 border rounded">
      <h3 class="text-lg font-semibold mb-4">Questions Preview</h3>
  
  
      <!-- Category Questions -->
      <div v-for="(questions, category) in organizedQuestions.categories" 
           :key="category" 
           class="mb-8">
        <div class="flex justify-between items-center text-lg font-semibold mb-4 text-blue-600">
          {{ category }} Questions <h4 class="text-lg font-semibold  text-black">No of Q: {{  }}</h4>
        </div>
        
        <div v-for="(question, index) in questions" 
             :key="question._id || index"
             class="p-4 bg-gray-50 rounded mb-4">
          <p class="font-medium mb-2">{{ question.question }}</p>
          
          <!-- Question Image -->
          <img v-if="question.image" 
               :src="`data:${question.imageType};base64,${question.image}`"
               alt="Question image"
               class="max-w-xs h-auto my-2">
          
          <!-- Options List -->
          <ul v-if="question.options?.length" class="list-disc pl-6 my-2">
            <li v-for="(option, i) in question.options" 
                :key="i" 
                class="mb-1">
              {{ option }}
            </li>
          </ul>
          
          <p class="text-sm text-gray-600">
            <span class="font-medium">Answer:</span> {{ question.answer }}
          </p>
          
          <p v-if="question.timer" class="text-sm text-gray-600">
            <span class="font-medium">Timer:</span> {{ question.timer }}s
          </p>
          
          <div class="mt-3 space-x-2">
            <button @click="editQuestion(getOriginalIndex(question))"
                    class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
              Edit
            </button>
            <button @click="deleteQuestionHandler(getOriginalIndex(question))"
                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
  
  
      <!-- Time Challenge Questions -->
      <div v-if="organizedQuestions.timeChallenges.length" class="mb-8">
        <div class=" flex justify-between items-center text-lg font-semibold mb-4 text-green-600">
          Time Challenge Questions <h4 class="text-lg font-semibold text-black">No of Q: {{ organizedQuestions.timeChallenges.length }}</h4>
          </div>
        
        <div v-for="(question, index) in organizedQuestions.timeChallenges" 
             :key="question._id || index"
             class="p-4 bg-gray-50 rounded mb-4">
          <p class="font-medium mb-2">{{ question.question }}</p>
          
          <!-- Question Image -->
          <img v-if="question.image" 
               :src="`data:${question.imageType};base64,${question.image}`"
               alt="Question image"
               class="max-w-xs h-auto my-2">
          
          <p class="text-sm text-gray-600">
            <span class="font-medium">Answer:</span> {{ question.answer }}
          </p>
          
          <div class="mt-3 space-x-2">
            <button @click="editQuestion(getOriginalIndex(question))"
                    class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
              Edit
            </button>
            <button @click="deleteQuestionHandler(getOriginalIndex(question))"
                    class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup>
  import { computed } from 'vue';
  
  
  const props = defineProps({
    previewQuestions: {
      type: Array,
      required: true
    }
  });
  
  
  const emit = defineEmits(['edit', 'delete']);
  
  
  // Compute organized questions
  const organizedQuestions = computed(() => {
    console.log(organizedQuestions)
    return props.previewQuestions.reduce((acc, question, index) => {
      if (question.type === 'category') {
        if (!acc.categories[question.category]) {
          acc.categories[question.category] = [];
        }
        question.originalIndex = index;  // Store original index
        acc.categories[question.category].push(question);
      } else {
        question.originalIndex = index;  // Store original index
        acc.timeChallenges.push(question);
      }
      return acc;
    }, { categories: {}, timeChallenges: [] });
  });
  
  
  // Helper to get original index
  const getOriginalIndex = (question) => {
    return question.originalIndex;
  };
  
  
  // Handler functions
  const editQuestion = (index) => {
    emit('edit', index);
  };
  
  
  const deleteQuestionHandler = (index) => {
    emit('delete', index);
  };
  </script>