const {
  fetchTopics,
  fetchArticleId,
  fetchArticles,
} = require("../models/topics-model.js");

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topic) => {
      res.status(200).send({ topics: topic });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((article) => {
      console.log(article);
      res.status(200).send({ articles: article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleId = (req, res, next) => {
  const articleId = req.params.article_id;
  fetchArticleId(articleId)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
