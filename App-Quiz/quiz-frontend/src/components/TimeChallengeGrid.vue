<template>
    <div class="grid">
      <button 
        v-for="(question, index) in questions" 
        :key="index" 
        :class="{
          unanswered: !question.isAnswered,
          correct: question.isCorrect,
        }"
        @click="$emit('navigateQuestion', index)"
      >
        {{ index + 1 }}
      </button>
    </div>
  </template>
  
  
  <script setup>
  defineProps(['questions']);
  defineEmits(['navigateQuestion']);
  </script>
  
  
  <style>
  .grid button {
    width: 40px;
    height: 40px;
    margin: 5px;
    text-align: center;
  }
  
  
  .grid button.unanswered {
    background-color: blue;
  }
  
  
  .grid button.correct {
    background-color: green;
  }
  </style>