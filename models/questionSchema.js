const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: String,
    options: [String],
    correctAnswer: String,
});

const quizSchema = new mongoose.Schema({
    questions: { type: [questionSchema], required: 'true' },
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
