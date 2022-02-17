const db = require("../db/connection.js");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics;").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticles = () => {
  return db
    .query("SELECT * FROM articles ORDER BY created_at DESC;")
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleId = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [articleId])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateArticleByVote = (update, articleId) => {
  return db
    .query(
      `
  UPDATE articles 
  SET votes = votes + $1 
  WHERE article_id = $2
  RETURNING *;
  `,
      [update, articleId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Path not found",
        });
      }
      return rows;
    });
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users;`).then(({ rows }) => {
    return rows;
  });
};

exports.removeCommentById = (id) => {
  console.log(id);
  return db.query(
    `
  DELETE FROM comments WHERE comment_id = $1
  `,
    [id]
  );
};
