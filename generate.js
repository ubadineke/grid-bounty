const Quiz = require('./models/questionSchema');
require('dotenv').config();
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

let response;
let reply;
(async () => {
    response = await axios.get('https://search.thegrid.id/?q=derivatives');
    reply = JSON.stringify(response.data);
    // console.log(reply);
    // return;
    const prompt = `Generate 5 questions from the text below, inclined to web 3. The response should be a JSON object with the following structure, ADD NO OTHER TEXT JUST THIS STRUCTURE :
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
    const quiz = new Quiz({
        question: 'What is Web3?',
        options: [
            'A new web standard',
            'A decentralized web',
            'A web browser',
            'None of the above',
        ],
        correctAnswer: 'A decentralized web',
    });
    await quiz.save();
    return console.log(quiz._id);
})();
