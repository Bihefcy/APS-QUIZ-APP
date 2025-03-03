<template>
    <div class="w-full">
      <nav v-if="currentView !== 'category'" class="mb-4">
      <button 
        @click="goBack" 
        class="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Back
      </button>
      </nav>
      <CategorySelector
        v-if="currentView === 'category'"
        :categories="categories"
        @categorySelected="handleCategorySelect"
      />
      <QuestionsGrid
        v-else-if="currentView === 'questions'"
        :category="selectedCategory"
        :questions="filteredQuestions"
        :answeredQuestions="answeredQuestions"
        @questionClicked="handleQuestionSelect"
      />
      <QuestionViewer
        v-if="currentView === 'viewer'"
        :question="selectedQuestion"
        @answerShown="handleAnswerShown"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import CategorySelector from '../components/CategorySelector.vue';
  import QuestionsGrid from '../components/QuestionsGrid.vue';
  import QuestionViewer from '../components/QuestionViewer.vue';
  import { getQuestions} from '../services/api';
  


  const questions = ref([]);
  const selectedCategory = ref(null);
  const selectedQuestion = ref(null);
  const currentView = ref('category');
  const answeredQuestions = ref(new Set()); // Track answered questions by ID
  
  const categories = computed(() => {
    return [...new Set(questions.value.map((q) => q.category))];
  });
  
  const filteredQuestions = computed(() => {
    return questions.value.filter((q) => q.category === selectedCategory.value);
  });
  
  // Navigation and state handlers
const handleCategorySelect = (category) => {
  selectedCategory.value = category;
  console.log(selectedCategory.value)
  currentView.value = 'questions';
};


const handleQuestionSelect = (index) => {
  selectedQuestion.value = filteredQuestions.value[index];
  currentView.value = 'viewer';
};


const handleAnswerShown = (questionId) => {
  answeredQuestions.value = new Set([...answeredQuestions.value, questionId]);
  // If you need to persist this state, you could save it to localStorage here
  localStorage.setItem('answeredQuestions', JSON.stringify([...answeredQuestions.value]));
};


const goBack = () => {
  if (currentView.value === 'viewer') {
    currentView.value = 'questions';
    selectedQuestion.value = null;
  } else if (currentView.value === 'questions') {
    currentView.value = 'category';
    selectedCategory.value = null;
  }
};

  
// Data fetching and initialization
const fetchData = async () => {
  try {
    questions.value = await getQuestions();
    // Load previously answered questions from localStorage if they exist
    const savedAnswered = localStorage.getItem('answeredQuestions');
    if (savedAnswered) {
      answeredQuestions.value = new Set(JSON.parse(savedAnswered));
    }
  } catch (error) {
    console.error('Failed to fetch questions:', error);
  }
};
  
  onMounted(fetchData);
  </script>
  