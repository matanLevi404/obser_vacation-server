const onlyLoggedUsers = (req, res, next) => {
  if (req.session) {
    next();
  } else {
    res.status(401).send({ err: "sensetive content for logged users only" });
  }
};

module.exports = { onlyLoggedUsers };
