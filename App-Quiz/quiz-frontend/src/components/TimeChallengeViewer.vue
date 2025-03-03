<template>
    <div>
      <h2>Question Viewer</h2>
      <div class="question">
        <h3>Question {{ currentIndex + 1 }}</h3>
        <p>{{ currentQuestion.question }}</p>
        <div v-if="currentQuestion.options">
          <button 
            v-for="(option, index) in currentQuestion.options" 
            :key="index" 
            @click="submitAnswer(option)"
          >
            {{ option }}
          </button>
        </div>
      </div>
      <div class="navigation">
        <button @click="navigate(-1)" :disabled="currentIndex === 0">Previous</button>
        <button @click="navigate(1)" :disabled="currentIndex === questions.length - 1">Next</button>
      </div>
    </div>
  </template>
  
  
  <script setup>
  defineProps(['currentIndex', 'questions']);
  defineEmits(['answerSubmitted', 'navigateQuestion']);
  
  
  const currentQuestion = computed(() => questions[currentIndex]);
  
  
  const navigate = (direction) => {
    emit('navigateQuestion', currentIndex + direction);
  };
  
  
  const submitAnswer = (answer) => {
    emit('answerSubmitted', { index: currentIndex, answer });
  };
  </script>
  
  
  <style>
  .navigation button {
    margin: 10px;
  }
  </style>