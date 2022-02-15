const request = require("supertest");
const app = require("../NC-project/app.js");
const connection = require("./db/connection");
const seed = require("./db/seeds/seed");
const testData = require("./db/data/test-data");

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
    .get("/api/articles/hello?invalid_id_query")
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe("Invalid ID query");
    });
});
