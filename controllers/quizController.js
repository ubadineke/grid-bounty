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
        console.log(reply);
        // return;
        const prompt = `Generate 5 questions from the text below, inclined to web 3. The response should be a JSON object with the following structure, ADD NO OTHER TEXT JUST THIS STRUCTURE! in particular the one denoting json,  just the json object:
{
  "question": "Your question here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "The correct answer here"
}
Text: ${reply}, also make it an array of objects following the json specification,`;
        const result = await model.generateContent(prompt);
        const response1 = result.response;
        const text = response1.text();

        const questionsData = JSON.parse(text);
        console.log(questionsData);

        // Transform data to fit the schema
        const questions = questionsData.map((item) => ({
            question: item.question,
            options: item.options,
            correctAnswer: item.correctAnswer,
        }));

        // const quiz = new Quiz({ questions });
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

exports.checkAnswer = async (req, res, next) => {};
