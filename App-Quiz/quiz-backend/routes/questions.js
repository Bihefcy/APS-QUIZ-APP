const express = require('express');
const Question = require('../models/Question');
const router = express.Router();

//add question
router.post('/', async (req, res) => {
    try {
      
        const { type, category, question, options = [], image, imageType, timer, answer } = req.body;
        console.log(req.body)
        const newQuestion = new Question({ type, category, question, options, image, imageType, timer, answer });
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


//get all questions
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find(); // Fetch all questions
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
})

//update question
router.put('/:id', async (req, res) => {
  console.log('received put request', req.body)
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedQuestion);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//delete question
router.delete('/:id', async (req, res) => {
  console.log('Received DELETE request');
  console.log('Params:', req.params);
  try {
      const id = req.params.id; // Retrieve id from params
      const deletedQuestion = await Question.findByIdAndDelete(id); // Use the id correctly
      if (!deletedQuestion) {
        return res.status(404).json({ message: 'Question not found' })
      }
      res.status(200).json({ message: 'Question deleted successfully' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});



// Get questions pending admin approval
router.get('/pending', async (req, res) => {
    try {
      const pendingQuestions = await Question.find({ isApproved: false });
      res.status(200).json(pendingQuestions);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;