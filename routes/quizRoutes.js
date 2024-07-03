const express = require('express');
const router = express.Router();
const { getQuestions, ping } = require('../controllers/quizController');

router.get('/quiz', getQuestions);
router.get('/ping', ping);

module.exports = router;
