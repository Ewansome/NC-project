const { fetchgitTopics } = require("../models/topics-model.js");

exports.getTopics = (req, res) => {
  fetchTopics().then((topic) => {
    res.status(200).send({ topics: topic });
  });
};
