const express = require('express');
const router = express.Router();
const { getQuestions, ping, checkAnswers } = require('../controllers/quizController');

router.get('/quiz', getQuestions);
router.get('/check/:id', checkAnswers);
router.get('/ping', ping);

module.exports = router;
