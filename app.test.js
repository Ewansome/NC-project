const request = require("supertest");
const app = require("../NC-project/app.js");
const connection = require("./db/connection");
const seed = require("./db/seeds/seed");
const testData = require("./db/data/test-data");
const sorted = require("jest-sorted");
const { forEach } = require("./db/data/test-data/articles.js");

beforeEach(() => seed(testData));
afterAll(() => connection.end());

describe("GET/api/topics", () => {
  it("status:200, responds with an array of topic objects, each with their slug and description properties", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
it("status:404, responds with an error message when path is not found", () => {
  return request(app)
    .get("/api/not-a-path")
    .expect(404)
    .then((res) => {
      expect(res.body.msg).toBe("Path not found");
    });
});

describe("GET/api/articles/:article_id", () => {
  it("status:200, responds with an article object with author, title, article_id, body, topic, created_at and votes properties", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: expect.any(String),
            votes: 100,
          })
        );
      });
  });
});
it("status 400, responds with an invalid id query", () => {
  return request(app)
    .get("/api/articles/hello")
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe("Invalid input");
    });
});

describe("GET /api/articles", () => {
  it("status:200, responds with an article array of objects with author, title, article_id, topic, created_at and votes properties in order descending by date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).not.toBeSortedBy({
          key: "created_at",
          descending: true,
        });
        expect(articles).toBeInstanceOf(Array);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              body: expect.any(String),
            })
          );
        });
      });
  });
});

describe("GET/api/users", () => {
  it("status:200, responds with an array of objects with a username property", () => {
    return request(app)
      .get("/api/users/username")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        expect(body).toHaveLength(4);
        body.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});

describe("Patch/api/articles/:article_id", () => {
  it("status: 200, request body accepts an object that increments the current articles vote", () => {
    const votesUpdate = {
      votes: 2,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(votesUpdate)
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toBeInstanceOf(Array);
        article.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: 1,
              votes: 102,
            })
          );
        });
      });
  });
  it("status: 400, responds with an error message when passed an incorrect article ID", () => {
    const votesUpdate = {
      votes: 2,
    };
    return request(app)
      .patch("/api/articles/notAnId")
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("status: 400, responds with an error message when passed an update without a number", () => {
    const votesUpdate = {
      votes: "two",
    };
    return request(app)
      .patch("/api/articles/1")
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("status: 400, responds with an error message when passed an update object with the wrong key", () => {
    const votesUpdate = {
      setov: 2,
    };
    return request(app)
      .patch("/api/articles/1")
      .send(votesUpdate)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("status: 404, ID does not exist", () => {
    const votesUpdate = {
      votes: 2,
    };
    return request(app)
      .patch("/api/articles/9999")
      .send(votesUpdate)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});
