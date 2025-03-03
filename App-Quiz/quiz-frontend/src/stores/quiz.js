// store/quiz.js
import { defineStore } from 'pinia'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    questions: [],
    questionGroups: [],
    selectedGroup: null,
    GROUPS_COUNT: 7
  }),

  getters: {
    currentGroupQuestions: (state) => {
      return state.selectedGroup !== null ? state.questionGroups[state.selectedGroup] : []
    }
  },

  actions: {
    setSelectedGroup(groupIndex) {
      this.selectedGroup = groupIndex
    },

    setQuestions(questions) {
      this.questions = questions
      this.createRandomGroups()
    },

    setQuestionGroups(groups) {
      this.questionGroups = groups;
    },


    createRandomGroups() {
      const shuffled = [...this.questions].sort(() => Math.random() - 0.5);
      
      
      this.questionGroups = Array(this.GROUPS_COUNT).fill().map((_, i) => {
        const startIdx = i * Math.floor(shuffled.length / this.GROUPS_COUNT)
        const endIdx = i === this.GROUPS_COUNT - 1 
          ? shuffled.length 
          : (i + 1) * Math.floor(shuffled.length / this.GROUPS_COUNT)
        return shuffled.slice(startIdx, endIdx);
      })
    }
  }
})