const express = require('express');
const router = express.Router();
const { getQuestions, ping, calculateScore } = require('../controllers/quizController');

router.get('/quiz', getQuestions);
router.get('/check/:id', calculateScore);
router.post('/ping', ping);

module.exports = router;
