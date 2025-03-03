import{createRouter, createWebHistory} from 'vue-router'
import AdminInput from '../views/AdminInput.vue'
import QuizPage from '../views/QuizPage.vue'
import TimeChallengePage from '../views/TimeChallengePage.vue'
import QuizMasterPanel from '../views/QuizMasterPanel.vue'


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', redirect: '/admin'},
        {path: '/admin', component: AdminInput},
        {path: '/quiz', component: QuizPage},
        {path: '/time-challenge', component: TimeChallengePage},
        {path: '/quiz-master', component: QuizMasterPanel}
    ]
})

export default router