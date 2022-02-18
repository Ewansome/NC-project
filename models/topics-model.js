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

exports.fetchArticleByCommentId = (commentId) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE article_id = $1
    `,
      [commentId]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist",
        });
      }
      return rows;
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
  return db.query(
    `
  DELETE FROM comments WHERE comment_id = $1
  `,
    [id]
  );
};

exports.insertComment = (newComment, article_id) => {
  const { author, body } = newComment;
  return db
    .query(
      `
      INSERT INTO comments(article_id, author, body)
      VALUES
      ($1, $2, $3)
      RETURNING *

    `,
      [article_id, author, body]
    )
    .then(({ rows: [comment] }) => {
      return comment;
    });
};

exports.grabCommentCount = () => {
  console.log("Hello!");
};

exports.fetchCommentCount = (id) => {
  return db
    .query(
      `
        SELECT * FROM comments
        WHERE article_id = $1
      `,
      [id]
    )
    .then(({ rows }) => {
      console.log(rows);
      const commentCount = rows.length;
      return db
        .query(
          `
        ALTER TABLE articles
        ADD comment_count INT
        `
        )
        .then(() => {
          return db
            .query(
              `
          UPDATE articles
          SET comment_count = $1
          WHERE article_id = $2
          `,
              [commentCount, id]
            )
            .then(() => {
              return db
                .query(
                  `
              SELECT * FROM articles 
              WHERE article_id = $1
              `,
                  [id]
                )
                .then(({ rows }) => {
                  return rows;
                });
            });
        });
    });
};
