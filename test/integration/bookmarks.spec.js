/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */
const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const mongoose = require('mongoose');

describe('bookmarks', () => {
  beforeEach((done) => {
    mongoose.connection.db.dropDatabase(() => {
      done();
    });
  });

  describe('bookmarks', () => {
    describe('post /bookmarks', () => {
      it('should create a bookmark', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'a', url: 'http://www.google.com', description: 'c',
        isProtected: true, datePublished: '2016-03-15',
        stars: 3, tags: ['d', 'e'] })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(200);
          expect(rsp.body.bookmark.__v).to.not.be.null;
          expect(rsp.body.bookmark.url).to.equal('http://www.google.com');
          done();
        });
      });
      it('should not create a bookmark missing title', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ url: 'http://www.google.com', description: 'c',
        isProtected: true, datePublished: '2016-03-15',
        stars: 3, tags: ['d', 'e'] })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages).to.deep.equal(['"title" is required']);
          done();
        });
      });
      it('should not create a bookmark - date is too old', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'a', url: 'http://www.google.com', description: 'c',
        isProtected: true, datePublished: '1816-03-15',
        stars: 3, tags: ['d', 'e'] })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages).to.deep.equal(['"datePublished" must be larger than or equal to "Sat Dec 31 1994 18:00:00 GMT-0600 (CST)"']);
          done();
        });
      });
      it('should not create a bookmark - URL wrong', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'a', url: 'b', description: 'c',
        isProtected: true, datePublished: '2016-03-15',
        stars: 3, tags: ['d', 'e'] })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages).to.deep.equal(['"url" must be a valid uri']);
          done();
        });
      });
      it('should not create a bookmark - stars greater than max', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'a', url: 'http://www.google.com', description: 'c',
        isProtected: true, datePublished: '2016-03-15',
        stars: 7, tags: ['d', 'e'] })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages).to.deep.equal(['"stars" must be less than or equal to 5']);
          done();
        });
      });
      it('should not create a bookmark - Tags wrong', (done) => {
        request(app)
        .post('/bookmarks')
        .send({ title: 'a', url: 'http://www.google.com', description: 'c',
        isProtected: true, datePublished: '2016-03-15',
        stars: 3, tags: [] })
        .end((err, rsp) => {
          expect(err).to.be.null;
          expect(rsp.status).to.equal(400);
          expect(rsp.body.messages).to.deep.equal(['"tags" must contain at least 1 items']);
          done();
        });
      });
    });
  });
});
