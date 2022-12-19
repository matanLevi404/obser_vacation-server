const onlyLoggedUsers = (req, res, next) => {
  console.log(req.session.Session, "from middleware");
  if (req.session.user_id && req.session.user_id != 1) {
    next();
  } else {
    res.status(401).send({ err: "sensetive content for logged users only" });
  }
};

module.exports = { onlyLoggedUsers };
