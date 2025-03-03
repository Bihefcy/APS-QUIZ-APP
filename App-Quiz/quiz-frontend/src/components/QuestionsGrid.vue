<!-- QuestionsGrid Component -->
<template>
  <div class="w-full md:flex md:items-center md:justify-between md:mt-16 mt-3 md:space-x-24">
      <div class="md:w-1/3 w-full my-auto">
        <p class="md:text-6xl text-3xl text-center md:text-left font-bold">{{ questions[0].category }}</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
      <div
        v-for="(question, index) in questions"
        :key="question._id"
        @click="$emit('questionClicked', index)"
        :class="[
        'p-4 rounded-lg cursor-pointer transition-colors',
        isQuestionAnswered(question._id)
          ? 'bg-green-100 hover:bg-green-200'
          : 'bg-gray-100 hover:bg-gray-200'
      ]"
      >
      <h3 class="font-medium">{{ index + 1 }}</h3>
      <!--  -->
    </div>
  </div>
  </div>
  
</template>


<script setup>
const props = defineProps({
  questions: {
    type: Array,
    required: true
  },
  answeredQuestions: {
    type: Set,
    required: true
  }
});

const isQuestionAnswered = (questionId) => {
  return props.answeredQuestions.has(questionId)
}


defineEmits(['questionClicked']);
</script>