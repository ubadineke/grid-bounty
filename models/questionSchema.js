const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: {
        A: { type: String, required: true },
        B: { type: String, required: true },
        C: { type: String, required: true },
        D: { type: String, required: true },
    },
    correctAnswer: { type: String, required: true }, // 'A', 'B', 'C', or 'D'
});

const quizSchema = new mongoose.Schema({
    questions: { type: [questionSchema], required: true },
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
