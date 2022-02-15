const express = require("express");
const { handle404 } = require("./controllers/error-controller.js");
const {
  getTopics,
  getArticleId,
  getArticles,
} = require("./controllers/topics-controller.js");

const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleId);
app.get("/api/articles", getArticles);

app.all("/*", handle404);

// error handling always has 4 parametres
app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid ID query" });
  }
});

module.exports = app;
