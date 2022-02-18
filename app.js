const express = require("express");
const { handle404 } = require("./controllers/error-controller.js");
const {
  getTopics,
  getArticleId,
  getArticles,
  getUsers,
  patchArticleByVote,
  deleteCommentById,
  getArticleByCommentId,
  postComment,
  getCommentCountFromId,
  getCommentCount,
} = require("./controllers/topics-controller.js");

const app = express();
app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles/:article_id/comments", getArticleByCommentId);

app.get("/api/articles", getArticles);

app.get("/api/users/username", getUsers);

app.get("/api/articles/:article_id/comment_count", getCommentCountFromId);

app.delete("/api/comments/:comment_id", deleteCommentById);

app.patch("/api/articles/:article_id", patchArticleByVote);

app.post("/api/articles/:article_id/comments", postComment);

app.all("/*", handle404);

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ msg: "Invalid input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});

module.exports = app;
