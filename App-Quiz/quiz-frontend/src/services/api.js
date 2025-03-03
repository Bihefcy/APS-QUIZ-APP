import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
});

// CRUD Operations
export const getQuestions = async () => (await api.get('/questions/questions')).data;
export const addQuestion = async (data) => (await api.post('/questions', data)).data;
export const updateQuestion = async (id, data) =>
  (await api.put(`/questions/${id}`, data)).data;
export const deleteQuestion = async (id) => (await api.delete(`/questions/${id}`)).data; //Ensure the route matches