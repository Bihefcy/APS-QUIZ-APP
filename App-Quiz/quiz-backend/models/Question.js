const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: { 
    type: String, 
    enum: ['category', 'time-challenge'], required: true 
},
  category: { 
    type: String, 
    required: function() { return this.type === 'category'; } 
},
  question: { 
    type: String, 
    required: true 
},
  options: {
    type: [String],
    default: [],
  },
  timer: { 
    type: Number, 
}, // Timer in seconds
  image: {
    type: String,
  },
  imageType: {
    type: String
  },
  answer: { 
    type: String, 
    required: true 
},
  isApproved: { 
    type: Boolean, 
    default: false },
});

module.exports = mongoose.model('Quizquestion', QuestionSchema);
