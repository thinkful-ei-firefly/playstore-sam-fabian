const express = require('express');
const morgan = require('morgan');
const playstore = require('./playstore.js');

const app = express();
app.use(morgan('dev'));

app.get('/apps', (req, res) => {
  const { sort, genres } = req.query;
  let results = playstore;

  if (genres) {
    const validGenres = [
      'Action',
      'Puzzle',
      'Strategy',
      'Casual',
      'Arcade',
      'Card'
    ];

    if (!validGenres.includes(genres)) {
      return res
        .status(400)
        .send(`Genres must be one of ${validGenres.join(', ')}`);
    } else {
      results = playstore.filter(app => app['Genres'].includes(genres));
    }
  }

  if (sort) {
    if (sort !== 'Rating' && sort !== 'App') {
      return res.status(400).send('Sort must be either by Rating or App');
    } else {
      results = results.sort((a, b) => {
        return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1 : 0;
      });
    }
  }

  res.json(results);
});

module.exports = app;