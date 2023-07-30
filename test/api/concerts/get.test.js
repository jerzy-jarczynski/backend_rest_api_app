const chai = require('chai');
const chaiHttp = require('chai-http');
const Concert = require('../../../models/concert.model');

chai.use(chaiHttp);

const expect = chai.expect;
const request = chai.request;

describe('Concert endpoints', () => {
  let server;

  before(async () => {
    server = require('../../../server');

    const testConcertOne = new Concert({
      performer: 'Performer 1',
      genre: 'Genre 1',
      price: 50,
      day: 1,
      image: 'image_1.jpg',
    });
    await testConcertOne.save();

    const testConcertTwo = new Concert({
      performer: 'Performer 2',
      genre: 'Genre 2',
      price: 70,
      day: 2,
      image: 'image_2.jpg',
    });
    await testConcertTwo.save();
  });

  it('should return concerts for a given performer', async () => {
    const performer = 'Performer 1';

    const res = await request(server).get(`/concerts/performer/${performer}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    res.body.forEach(concert => {
      expect(concert.performer).to.equal(performer);
    });
  });

  it('should return concerts for a given genre', async () => {
    const genre = 'Genre 1';

    const res = await request(server).get(`/concerts/genre/${genre}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    res.body.forEach(concert => {
      expect(concert.genre).to.equal(genre);
    });
  });

  it('should return concerts within a given price range', async () => {
    const price_min = 40;
    const price_max = 60;

    const res = await request(server).get(`/concerts/price/${price_min}/${price_max}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    res.body.forEach(concert => {
      expect(concert.price).to.be.at.least(price_min);
      expect(concert.price).to.be.at.most(price_max);
    });
  });

  it('should return concerts for a given day', async () => {
    const day = 1;

    const res = await request(server).get(`/concerts/day/${day}`);
    expect(res.status).to.be.equal(200);
    expect(res.body).to.be.an('array');
    res.body.forEach(concert => {
      expect(concert.day).to.equal(day);
    });
  });

  after(async () => {
    await Concert.deleteMany();
    server.close();
  });
});
