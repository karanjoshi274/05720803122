const express = require('express');
const mongoose = require('mongoose');
const logger = require('./middleware/logger');
const shortUrlsRouter = require('./routes/shortUrls');

const app = express();

app.use(express.json());
app.use(logger); // Apply logging middleware
app.use('/', shortUrlsRouter);

mongoose.connect('mongodb://localhost:27017/urlshortener')
.then(() => {
  console.log('Connected to MongoDB');
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
})
.catch(err => console.error('Could not connect to MongoDB', err));
