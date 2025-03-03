<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-6">Admin Input</h2>


    <!-- Category Questions -->
    <div class="mb-8 p-4 border rounded">
      <h3 class="text-lg font-semibold mb-4">Add Category Question</h3>
      
      <div class="space-y-4">
        <div>
          <select 
            v-model="categoryQuestion.category"
            class="w-full p-2 border rounded"
          >
            <option disabled value="">Select a category</option>
            <option v-for="cat in categories" :key="cat">{{ cat }}</option>
          </select>
        </div>


        <div>
          <textarea 
            v-model="categoryQuestion.question" 
            placeholder="Enter the question"
            class="w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>


        <!-- Image Upload for Category Question -->
        <div class="border-dashed border-2 p-4 rounded">
          <input 
            type="file" 
            accept="image/*"
            @change="handleCategoryImageUpload"
            class="mb-2"
          >
          <img 
            v-if="categoryQuestion.image" 
            :src="`data:${categoryQuestion.imageType};base64,${categoryQuestion.image}`"
            alt="Question image preview"
            class="max-w-xs h-auto mt-2"
          >
        </div>


        <div>
          <input 
            v-model="newOption" 
            @keyup.enter="addOption" 
            placeholder="Add an option"
            class="w-full p-2 border rounded"
          />
        </div>


        <ul class="space-y-2">
          <li v-for="(option, index) in categoryQuestion.options" :key="index"
              class="flex items-center justify-between p-2 bg-gray-50 rounded">
            {{ option }}
            <button @click="removeOption(index)" class="text-red-500">Remove</button>
          </li>
        </ul>


        <div>
          <input 
            v-model="categoryQuestion.answer" 
            placeholder="Correct answer"
            class="w-full p-2 border rounded"
          />
        </div>


        <div>
          <input 
            v-model="categoryQuestion.timer" 
            placeholder="Insert time"
            class="w-full p-2 border rounded"
            type="number"
          />
        </div>


        <button 
          @click="addCategoryQuestion"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Question
        </button>
      </div>
    </div>


    <!-- Time-Challenge Questions -->
    <div class="mb-8 p-4 border rounded">
      <h3 class="text-lg font-semibold mb-4">Add Time-Challenge Question</h3>
      
      <div class="space-y-4">
        <div>
          <textarea 
            v-model="timeChallengeQuestion.question" 
            placeholder="Enter the question"
            class="w-full p-2 border rounded"
            rows="3"
          ></textarea>
        </div>


        <!-- Image Upload for Time Challenge Question -->
        <div class="border-dashed border-2 p-4 rounded">
          <input 
            type="file" 
            accept="image/*"
            @change="handleTimeChallengeImageUpload"
            class="mb-2"
          >
          <img 
            v-if="timeChallengeQuestion.image" 
            :src="`data:${timeChallengeQuestion.imageType};base64,${timeChallengeQuestion.image}`"
            alt="Question image preview"
            class="max-w-xs h-auto mt-2"
          >
        </div>


        <div>
          <input 
            v-model="timeChallengeQuestion.answer" 
            placeholder="Correct answer"
            class="w-full p-2 border rounded"
          />
        </div>


        <button 
          @click="addTimeChallengeQuestion"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Question
        </button>
      </div>
    </div>


    <!-- Preview Section -->
    <QuestionPreview 
    :previewQuestions="previewQuestions"
    @edit="editQuestion"
    @delete="deleteQuestionHandler"
    />
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { addQuestion, getQuestions, updateQuestion, deleteQuestion } from '../services/api';
import QuestionPreview from '../components/QuestionPreview.vue';


onMounted(() => {
  fetchQuestions();
});


const categories = ['Basic Medical Sciences', 'Clinical Knowledge', 'Maths and Logic', 'General Knowledge'];

// Form data with image fields
const categoryQuestion = ref({ 
  type: 'category', 
  category: '', 
  question: '', 
  timer: '', 
  options: [], 
  answer: '',
  image: '',
  imageType: ''
});


const timeChallengeQuestion = ref({ 
  type: 'time-challenge', 
  question: '', 
  answer: '',
  image: '',
  imageType: ''
});


const newOption = ref('');
const previewQuestions = ref([]);


// Image handling functions
const handleImageUpload = async (file, questionObj) => {
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      questionObj.image = e.target.result.split(',')[1]; // Get base64 data
      questionObj.imageType = file.type;
    };
    reader.readAsDataURL(file);
  }
};


const handleCategoryImageUpload = (event) => {
  handleImageUpload(event.target.files[0], categoryQuestion.value);
};


const handleTimeChallengeImageUpload = (event) => {
  handleImageUpload(event.target.files[0], timeChallengeQuestion.value);
};


// Existing methods
const fetchQuestions = async () => {
  try {
    const response = await getQuestions();
    previewQuestions.value = response;
    console.log(previewQuestions.value)
  } catch (error) {
    console.error('Error fetching questions:', error.response?.data || error.message);
  }
};


const addOption = () => {
  if (newOption.value) {
    categoryQuestion.value.options.push(newOption.value);
    newOption.value = '';
  }
};


const removeOption = (index) => {
  categoryQuestion.value.options.splice(index, 1);
};


const addCategoryQuestion = async () => {
  const question = { ...categoryQuestion.value };
  console.log('sending question:', question)
  await addQuestion(question);
  categoryQuestion.value = { 
    type: 'category', 
    category: '', 
    question: '', 
    timer: '', 
    options: [], 
    answer: '',
    image: null,
    imageType: null
  };
  fetchQuestions();
};


const addTimeChallengeQuestion = async () => {
  const question = { ...timeChallengeQuestion.value };
  await addQuestion(question);
  timeChallengeQuestion.value = { 
    type: 'time-challenge', 
    question: '', 
    answer: '',
    image: null,
    imageType: null
  };
  fetchQuestions();
};


const editQuestion = async (index) => {
  const question = previewQuestions.value[index];
  if (question.type === 'category') {
    categoryQuestion.value = { ...question };
  } else {
    timeChallengeQuestion.value = { ...question };
  }
  await updateQuestion(question._id, question);
  fetchQuestions();
};


const deleteQuestionHandler = async (index) => {
  try {
    const questionId = previewQuestions.value[index]._id;
    await deleteQuestion(questionId);
    previewQuestions.value = previewQuestions.value.filter(q => q._id !== questionId);
  } catch (error) {
    console.error('Error deleting question:', error.response?.data || error.message);
    alert('Could not delete the question. Please try again.');
  }
};
</script>