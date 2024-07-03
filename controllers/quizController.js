const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const Quiz = require('../models/questionSchema');
const axios = require('axios');

exports.getQuestions = async (req, res, next) => {
    try {
        let response;
        let reply;

        response = await axios.get('https://search.thegrid.id/?q=derivatives');
        reply = JSON.stringify(response.data);
        // console.log(reply);
        // return;
        const prompt = `Generate 5 questions from the text below that is inclined to Web 3. Also provide four possible options, with one being the correct answer. The options should be labeled as A, B, C, and D. The response should be formatted in JSON as shown below:
        It's obvious its JSON but remove the backticks and the json keyword that it's used to indicate 
  {
    "question": "Your question here",
    "options": {
      "A": "Option A",
      "B": "Option B",
      "C": "Option C",
      "D": "Option D"
    },
    "correctAnswer": "The correct answer key here (A, B, C, or D)"
  }
  Here is the text: ${reply} `;
        const result = await model.generateContent(prompt);
        const response1 = result.response;
        const text = response1.text();
        console.log(text);

        const text1 = text.replace(/^```json\s*([\s\S]*?)\s*```$/, '$1');
        const questionsData = JSON.parse(text1);
        // console.log(questionsData);

        const questions = questionsData.map((item) => ({
            question: item.question,
            options: {
                A: item.options.A,
                B: item.options.B,
                C: item.options.C,
                D: item.options.D,
            },
            correctAnswer: item.correctAnswer,
        }));
        console.log(questions);

        const quiz = new Quiz({ questions });
        await quiz.save();
        res.status(200).json({
            status: 'success',
            questions,
        });
    } catch (err) {
        res.status(500).json('Issues accessing gemini');
        console.log(err);
    }
};

exports.checkAnswers = async (req, res, next) => {
    try {
        const quizId = req.params.quizId;
        const userAnswers = req.body.answers; // [{questionId, answer}, ...]

        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).send('Quiz not found');
        }

        let score = 0;
        const totalQuestions = quiz.questions.length;

        quiz.questions.forEach((question, index) => {
            if (question.correctAnswer === userAnswers[index].answer) {
                score++;
            }
        });

        res.json({ score, totalQuestions });
    } catch (err) {
        res.status(500).json('Issues accessing gemini');
        console.log(err);
    }
};

exports.ping = async (req, res, next) => {
    console.log('Evian Deyyyy');
    res.status(200).send('Chijioke');
};
