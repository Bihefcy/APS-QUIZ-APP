<template>
  <div class="p-4">
    <!-- Initial Group Selection -->
    <TimeChallengeSelector
      v-if="currentView === 'groups'"
      :groups="store.questionGroups"
      @groupSelected="handleGroupSelect"
    />

    <!-- Challenge View -->
    <div v-if="currentView === 'challenge'" class="space-y-4">
      <!-- Timer and Score Section -->
      <div class="flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <div class="text-2xl font-bold">
          Group {{ selectedGroup + 1 }}
          <button
            @click="goBack"
            class="ml-4 px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Back to Groups
          </button>
        </div>
        <div class="flex items-center gap-4">
          <div class="text-xl">
            Correct: {{ correctAnswers.size }}/{{
              currentGroupQuestions.length
            }}
          </div>
          <div
            class="text-2xl font-mono"
            :class="{ 'text-red-600': timeRemaining <= 10 }"
          >
            {{ formatTime(timeRemaining) }}
          </div>
          <button
            v-if="!isTimerRunning && timeRemaining === TIMER_DURATION"
            @click="startTimer"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Start Timer
          </button>
          <button
            v-if="isTimerRunning"
            @click="stopTimer"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop Timer
          </button>
        </div>
      </div>

      <!-- Question Viewer -->
      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <button
            :disabled="currentQuestionIndex === 0"
            @click="navigateQuestion(-1)"
            class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Previous <span class="text-xs ml-1 opacity-70">←</span>
          </button>
          <span class="text-lg font-medium">
            Question {{ currentQuestionIndex + 1 }}/{{
              currentGroupQuestions.length
            }}
          </span>
          <button
            :disabled="
              currentQuestionIndex === currentGroupQuestions.length - 1
            "
            @click="navigateQuestion(1)"
            class="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Next <span class="text-xs ml-1 opacity-70">→</span>
          </button>
        </div>

        <h3 class="text-2xl mb-4">{{ currentQuestion.question }}</h3>

        <!-- Add image display -->
        <div v-if="currentQuestion.image" class="image-container">
          <img
            :src="`data:${currentQuestion.imageType};base64,${currentQuestion.image}`"
            :alt="currentQuestion.question"
            class="question-image"
            @error="handleImageError"
          />
        </div>

        <!-- Quick Answer Selection -->
        <div v-if="showAnswer" class="bg-green-100 p-3 rounded-lg text-2xl">
          <strong>Correct Answer:</strong> {{ currentQuestion.answer }}
        </div>

        <button
          @click="toggleAnswer()"
          class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 mt-4"
        >
          {{ showAnswer ? "Hide Answer" : "Show Answer" }}
          <span class="text-xs ml-1 opacity-70">[Space]</span>
        </button>
      </div>

      <!-- Question Grid -->
      <div class="grid grid-cols-8 gap-2">
        <button
          v-for="(question, index) in currentGroupQuestions"
          :key="question._id"
          @click="jumpToQuestion(index)"
          :class="['p-2 rounded', getQuestionStatusClass(question._id)]"
        >
          {{ index + 1 }}
        </button>
      </div>

      <!-- Keyboard Shortcuts Help -->
      <div class="mt-4 text-sm text-gray-600 bg-gray-100 p-3 rounded-lg">
        <p class="font-medium">Keyboard Shortcuts:</p>
        <ul class="list-disc pl-5 mt-1">
          <li>← / → Arrow keys: Navigate between questions</li>
          <li>Space: Show/hide answer</li>
        </ul>
      </div>
    </div>

    <!-- Results Modal -->
    <div
      v-if="showResults"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded-lg max-w-md">
        <h2 class="text-2xl font-bold mb-4">Time's Up!</h2>
        <p class="text-lg mb-4">
          You answered {{ correctAnswers.size }} out of
          {{ currentGroupQuestions.length }} questions correctly!
        </p>
        <button
          @click="resetChallenge"
          class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Groups
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from "vue";
import TimeChallengeSelector from "../components/TimeChallengeSelector.vue";
import { getQuestions } from "../services/api";
import { useQuizStore } from "../stores/quiz";

// Constants
const TIMER_DURATION = 180; //
//const GROUPS_COUNT = 7;
const showAnswer = ref(false);

// State
const store = useQuizStore();
//const questions = ref([]); // All time challenge questions from MongoDB
//const questionGroups = ref([]); // Questions divided into groups
const selectedGroup = ref(null);
const currentView = ref("groups");
const currentQuestionIndex = ref(0);
const timeRemaining = ref(TIMER_DURATION);
const isTimerRunning = ref(false);
const showResults = ref(false);
const userAnswers = ref(new Map()); // Map of questionId -> user's answer
const correctAnswers = ref(new Set()); // Set of correctly answered questionIds

// Fetch and prepare data
const fetchQuestions = async () => {
  try {
    //const allQuestions = await getQuestions();
    //questions.value = allQuestions.filter(question => question.type === 'time-challenge');
    //questions.value = await response.json();
    //createRandomGroups();
    const allQuestions = await getQuestions();
    const timeQuestions = allQuestions.filter(
      (question) => question.type === "time-challenge"
    );
    store.setQuestions(timeQuestions);
  } catch (error) {
    console.error("Failed to fetch questions:", error);
  }
};

/* const createRandomGroups = () => {
  // Shuffle questions
  const shuffled = [...questions.value].sort(() => Math.random() - 0.5);
  
  // Divide into groups
  questionGroups.value = Array(GROUPS_COUNT).fill().map((_, i) => {
    const startIdx = i * Math.floor(shuffled.length / GROUPS_COUNT);
    const endIdx = i === GROUPS_COUNT - 1 
      ? shuffled.length 
      : (i + 1) * Math.floor(shuffled.length / GROUPS_COUNT);
    return shuffled.slice(startIdx, endIdx);
  });
}; */

// Computed
const questionGroups = computed(() => {
  console.log("Question Groups from Store:", store.questionGroups); // Log the question groups from the store
  return store.questionGroups;
});

const currentGroupQuestions = computed(() => {
  const groupQuestions =
    selectedGroup.value !== null
      ? questionGroups.value[selectedGroup.value]
      : [];
  return groupQuestions;
});

const currentQuestion = computed(() => {
  const question = currentGroupQuestions.value[currentQuestionIndex.value];
  console.log("Current Question Index:", currentQuestionIndex.value); // Log the current question index
  console.log("Current Question:", question); // Log the current question
  return question || {};
});

// Methods
const handleGroupSelect = (groupIndex) => {
  selectedGroup.value = groupIndex;
  store.setSelectedGroup(groupIndex);
  console.log("Selected Group Set:", store.selectedGroup); // Log the selected group
  console.log("Selected Group Set:", store.questionGroups); // Log the selected group
  currentView.value = "challenge";
  // Reset answer visibility when selecting a new group
  showAnswer.value = false;
  resetTimer();
};

const startTimer = () => {
  isTimerRunning.value = true;
  const timer = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--;
    } else {
      clearInterval(timer);
      showResults.value = true;
    }
  }, 1000);
};

const stopTimer = () => {
  isTimerRunning.value = false;
  timeRemaining.value = 0;
  const timer = setInterval(() => {
    clearInterval(timer);
    showResults.value = true;
  }, 10);
};

const resetTimer = () => {
  timeRemaining.value = TIMER_DURATION;
  isTimerRunning.value = false;
};

const toggleAnswer = () => {
  if (!isTimerRunning.value || timeRemaining.value === 0) return;

  const questionId = currentQuestion.value._id;

  // Simulate submitting an answer (marking question as seen)
  userAnswers.value.set(questionId, "seen");

  // Track if the answer was correct (for stats purposes, always true here)
  correctAnswers.value.add(questionId);

  // Toggle answer visibility
  showAnswer.value = !showAnswer.value;

  // If hiding the answer, automatically move to the next question (optional)
  if (
    !showAnswer.value &&
    currentQuestionIndex.value < currentGroupQuestions.value.length - 1
  ) {
    navigateQuestion(1);
  }
};

const navigateQuestion = (delta) => {
  const newIndex = currentQuestionIndex.value + delta;
  if (newIndex >= 0 && newIndex < currentGroupQuestions.value.length) {
    // Auto-hide answer when navigating to a new question
    showAnswer.value = false;

    currentQuestionIndex.value = newIndex;
  }
};

const jumpToQuestion = (index) => {
  if (index !== currentQuestionIndex.value) {
    // Auto-hide answer when jumping to a new question
    showAnswer.value = false;

    currentQuestionIndex.value = index;
  }
};

const getQuestionStatusClass = (questionId) => {
  if (!userAnswers.value.has(questionId)) {
    return "bg-gray-200 hover:bg-gray-300";
  }
  return correctAnswers.value.has(questionId)
    ? "bg-green-200 hover:bg-green-300"
    : "bg-red-200 hover:bg-red-300";
};

const getAnswerButtonClass = (questionId, option) => {
  if (!userAnswers.value.has(questionId)) {
    return "bg-gray-100 hover:bg-gray-200";
  }
  if (userAnswers.value.get(questionId) === option) {
    return correctAnswers.value.has(questionId) ? "bg-green-200" : "bg-red-200";
  }
  return "bg-gray-100";
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const handleImageError = (e) => {
  console.error("Failed to load image");
  e.target.style.display = "none";
};

const goBack = () => {
  if (confirm("Are you sure? Your progress will be lost.")) {
    resetChallenge();
  }
};

const resetChallenge = () => {
  currentView.value = "groups";
  selectedGroup.value = null;
  currentQuestionIndex.value = 0;
  userAnswers.value = new Map();
  correctAnswers.value = new Set();
  showResults.value = false;
  // Reset answer visibility when going back to group selection
  showAnswer.value = false;
  resetTimer();
  //createRandomGroups(); // Randomize groups again
};

// Keyboard navigation handler
const handleKeyDown = (event) => {
  // Only handle keyboard events when in challenge view and timer is running
  if (
    currentView.value !== "challenge" ||
    !isTimerRunning.value ||
    timeRemaining.value === 0
  ) {
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      // Navigate to previous question
      navigateQuestion(-1);
      break;
    case "ArrowRight":
      // Navigate to next question
      navigateQuestion(1);
      break;
    case " ":
      // Toggle answer visibility with space bar
      event.preventDefault(); // Prevent page scrolling
      toggleAnswer();
      break;
  }
};

// Setup and cleanup keyboard event listeners
onMounted(() => {
  fetchQuestions();
  window.addEventListener("keydown", handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.question-image {
  max-width: 100%;
  height: auto;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
