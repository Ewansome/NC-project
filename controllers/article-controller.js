const fetchArticleId = require("../models/article-model");

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
