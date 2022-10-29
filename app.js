const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middleware/auth');
const { SERV_ERROR, errMessages } = require('./utils/utils');
const { validateLogin, validateRegister } = require('./utils/validateJoi');

// eslint-disable-next-line no-undef
const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
});

app.use(limiter);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.post('/signin', validateLogin, login);
app.post('/signup', validateRegister, createUser);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: '404' });
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res
    .status(err.statusCode !== SERV_ERROR ? err.statusCode : SERV_ERROR)
    .send({ message: err.message !== '' ? err.message : errMessages.serverError });
});
