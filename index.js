const dotenv = require('dotenv');
dotenv.config({ path: './.env' });
const mongoose = require('mongoose');
const express = require('express');
const quizRouter = require('./routes/quizRoutes');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/', quizRouter);

const PORT = process.env.PORT || 3000;
const DB = process.env.DB;

mongoose.connect(DB).then(() => {
    console.log('DATABASE CONNECTED');
});

app.listen(PORT, () => {
    console.log('App running on port', PORT);
});
