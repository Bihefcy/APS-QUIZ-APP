<template>
  <div>
    <h2 class="text-xl text-light text-center md:text-left font-normal">{{question.category}}</h2>
  </div>
  <p class="w-full h-1 bg-slate-200"></p>
  <div class="w-full mt-8">
    <p class="text-md font-normal">Question:</p>
    <h2 class="text-3xl font-semibold mb-1">{{ question.question }}</h2>
    
    <!-- Add image display -->
    <div v-if="question.image" class="w-64 h-64 mb-2">
      <img 
        :src="`data:${question.imageType};base64,${question.image}`" 
        :alt="question.question"
        class="w-full h-full"
        @error="handleImageError"
      />
    </div>
    <p class="w-full h-1 bg-slate-200"></p>


    <div class="mt-8" v-if="question.options?.length">
      <p class="text-md font-normal">Options:</p>
      <ul>
        <li class="mb-1 text-2xl" v-for="option in question.options" :key="option">{{ option }}</li>
      </ul>
    </div>
    <p class="w-full h-1 bg-slate-200"></p>


    <button 
      @click="handleShowAnswer"
      class="mt-8 mb-4 border-md rounded-md bg-blue-400 text-gray-100 text-lg font-normal hover:bg-blue-700 p-2"
    >
      {{ showAnswer ? 'Hide' : 'Show' }} Answer
    </button>
    
    <div v-if="showAnswer" class="answer">
      <p>Answer:</p>
      <p class="text-3xl my-1">{{ question.answer }}</p>
    </div>
  </div>
</template>


<script setup>
import { defineProps, defineEmits, ref } from 'vue';


const props = defineProps({
  question: {
    type: Object,
    required: true
  }
});


const emit = defineEmits(['backClicked', 'answerShown']);
const showAnswer = ref(false);


const handleShowAnswer = () => {
  const newValue = !showAnswer.value;
  showAnswer.value = newValue;
  
  if (newValue) {
    emit('answerShown', props.question._id);
  }
};


const handleImageError = (e) => {
  console.error('Failed to load image');
  e.target.style.display = 'none';
};
</script>

