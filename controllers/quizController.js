const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
const Quiz = require('../models/questionSchema');
const axios = require('axios');

exports.getQuestions = async (req, res, next) => {
    try {
        const { s } = req.query;
        let response;
        let reply;

        response = await axios.get(`https://search.thegrid.id/?q=${s}`);
        reply = JSON.stringify(response.data);

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

        const text1 = text.replace(/^```json\s*([\s\S]*?)\s*```$/, '$1');
        const questionsData = JSON.parse(text1);

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

exports.calculateScore = async (req, res) => {
    try {
        const { answers } = req.body;

        // Fetch all questions from the database
        const allQuestions = await Quiz.find({}, 'questions');

        // Prepare a map for quick lookup of correct answers
        const questionMap = new Map();
        allQuestions.forEach((quiz) => {
            quiz.questions.forEach((question) => {
                questionMap.set(question._id.toString(), question.correctAnswer);
            });
        });

        // Calculate the score based on submitted answers
        let score = 0;
        answers.forEach((answer) => {
            const correctAnswer = questionMap.get(answer.questionId);
            if (correctAnswer && correctAnswer === answer.answer) {
                score++;
            }
        });

        // Return the score as JSON response
        res.status(200).json({ score });
    } catch (error) {
        console.error('Error calculating score:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.ping = async (req, res, next) => {
    console.log('Evian Deyyyy');
    res.status(200).send('Chijioke');
};
