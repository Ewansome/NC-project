const {
  fetchTopics,
  fetchArticleId,
  fetchArticles,
  fetchUsers,
  updateArticleByVote,
  removeCommentById,
  fetchArticleByCommentId,
  insertComment,
  fetchCommentCount,
  grabCommentCount,
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

exports.getArticleByCommentId = (req, res, next) => {
  fetchArticleByCommentId(req.params.article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticleByVote = (req, res, next) => {
  updateArticleByVote(req.body.votes, req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteCommentById = (req, res, next) => {
  removeCommentById(req.params.comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  insertComment(req.body, req.params.article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentCountFromId = (req, res, next) => {
  fetchCommentCount(req.params.article_id)
    .then((article) => {
      res.status(200).send(article);
    })
    .catch((err) => {
      next(err);
    });
};
