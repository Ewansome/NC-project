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
        console.log(topics);
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

//need to write sad test 404

describe("GET/api/articles/:article_id", () => {
  it("status:200, responds with an article object with author, title, article_id, body, topic, created_at and votes properties", () => {
    const article_id = 1;
    return request(app)
      .get("/api/articles/:article_id")
      .expect(200)
      .then(({ body }) => {
        expect(body.park).toEqual({
          article_id: article_id,
          title: "Running a Node App",
          topic: "coding",
          author: "jessjelly",
          body: "This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.",
          created_at: "2020-11-07 06:03:00",
          votes: 0,
        });
      });
  });
});
