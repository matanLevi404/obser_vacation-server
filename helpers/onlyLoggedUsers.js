const onlyLoggedUsers = (req, res, next) => {
  if (req.session.user_id && req.session.user_id != 1) {
    next();
  } else {
    res.status(401).send({ err: "sensetive content for logged users only" });
  }
};

module.exports = { onlyLoggedUsers };
