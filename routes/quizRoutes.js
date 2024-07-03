const express = require('express');
const router = express.Router();
const { getQuestions } = require('../controllers/quizController');

router.get('/quiz', getQuestions);

module.exports = router;
