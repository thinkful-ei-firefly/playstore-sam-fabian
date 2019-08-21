const supertest = require('supertest');
const { expect } = require('chai');

const app = require('../app');

describe('GET /apps', () => {
  it('should return an array of movies', () => {
    return supertest(app)
      .get('/apps')
      .expect(200)
      .then(res => {
        expect(res.body).to.be.an('array');
      })
  })
  it('should return 400 if sort is not the correct value', () => {
    return supertest(app)
      .get('/apps?sort=a')
      .expect(400)
  })
  it('should return 400 if genres is not the correct value', () => {
    return supertest(app)
      .get('/apps?genres=a')
      .expect(400)
  })
  const sortOptions = ['Rating', 'App']

  sortOptions.forEach(sortBy => {

    it(`should sort by ${sortBy} correctly`, () => {
      return supertest(app)
        .get('/apps')
        .query({ sort: sortBy })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          let i = 0, sorted = true;
          while (sorted && i < res.body.length - 1) {
            sorted = sorted && res.body[i][sortBy] <= res.body[i + 1][sortBy];
            i++;
          }
          expect(sorted).to.be.true;
        })
    })

  })

  const genresOptions = ['Action', 'Puzzle', 'Strategy', 'Casual', 'Arcade', 'Card']

  genresOptions.forEach(genre => {

    it(`should include only movies of the genre ${genre})`, () => {
      return supertest(app)
        .get('/apps')
        .query({ genres: genre})
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
          let containsGenre = true;
          let i=0
          while (containsGenre && i<res.body.length) {
            if (!res.body[i].Genres.includes(genre)) {
              containsGenre = false
            }
            i++
          }
          expect(containsGenre).to.be.true
        })
    })

  })
})
