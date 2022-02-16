exports.handle404 = (req, res, next) => {
  console.log("still here");
  res.status(404).send({ msg: "Path not found" });
};
