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
it("status:400, responds with an invalid id query", () => {
  return request(app)
    .get("/api/articles/hello")
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe("Invalid input");
    });
});

describe("GET/api/articles", () => {
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
              comment_count: expect.any(Number),
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

describe("PATCH/api/articles/:article_id", () => {
  it("status:200, request body accepts an object that increments the current articles vote", () => {
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
  it("status:400, responds with an error message when passed an incorrect article ID", () => {
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
  it("status:400, responds with an error message when passed an update without a number", () => {
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
  it("status:404, ID does not exist", () => {
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

describe("DELETE/api/comments/:comment_id", () => {
  it("Deletes the given comment by the comment_id", () => {
    return request(app).delete("/api/comments/2").expect(204);
  });
  it("status:400, responds with an invalid id query when passed an invalid comment_id", () => {
    return request(app)
      .delete("/api/comments/:comment_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  it("status:404, responds with path not found when id query does not exist", () => {
    return request(app)
      .delete("/api/comment/4")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Path not found");
      });
  });
});

describe("GET/api/articles/:article_id/comments", () => {
  it("Responds with an array of comments for the given article_id, each comment with 5 properties: comment_id, votes, created_at, author(username), body", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body).toBeInstanceOf(Array);
        body.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              article_id: expect.any(Number),
              body: expect.any(String),
              votes: expect.any(Number),
              author: expect.any(String),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
});
it("status:400, responds with an invalid id query when passed incorrect input", () => {
  return request(app)
    .get("/api/articles/invalid_id/comments")
    .expect(400)
    .then((res) => {
      expect(res.body.msg).toBe("Invalid input");
    });
});
it("status:404, responds with an error message when article does not exist", () => {
  return request(app)
    .get("/api/articles/999999/comments")
    .expect(404)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Article does not exist");
    });
});

describe("POST/api/articles/:article_id/comments", () => {
  it("status:201, responds with new comment which is an object containing a username and body", () => {
    const newComment = {
      author: "icellusedkars",
      body: "meep-morp.",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            ...newComment,
          })
        );
      });
  });
  it("status:400, responds with an invalid id query when passed an invalid input", () => {
    const badAuthor = {
      author: "uvutcutcuuvu",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(badAuthor)
      .expect(400)
      .then(({ body }) => {
        const { msg } = body;
        expect(msg).toBe("Invalid input");
      });
  });
});

describe("GET/api/articles/:article_id (comment count)", () => {
  it("Status:200, responds with an object that includes a count of all the comments with the specified article_id", () => {
    return request(app)
      .get("/api/articles/1/comment_count")
      .expect(200)
      .then(({ body }) => {
        const [obj] = body;
        expect(obj).toBeInstanceOf(Object);
        expect(obj).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  it("status:400, responds with an invalid id query when passed incorrect input", () => {
    return request(app)
      .get("/api/articles/not_a_valid_id/comment_count")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/articles (comment count)", () => {
  it("status:200, responds with an array of article objects which all include a comment count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Object);
        expect(articles).toHaveLength(12);
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              title: expect.any(String),
              topic: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
  it("Status:404, returns an error message of 'Invalid inuput' when passed an invalid request", () => {
    return request(app)
      .get("/api/not_a_valid_input")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Path not found");
      });
  });
});
