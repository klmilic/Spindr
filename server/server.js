const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const userRouter = require('./routes/userRouter');
const playlistRouter = require('./routes/playlistRouter');

const PORT = process.env.PORT || 3000;

const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

// app.get('/home', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../dist/index.html'));
// });

app.use('/api/user', userRouter);
app.use('/api/playlist', playlistRouter);

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
