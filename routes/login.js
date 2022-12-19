const router = require("express").Router();
const bcrypt = require("bcrypt");
const { SQL } = require("../dbconfig");

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(500).send({ err: "missing username or password" });
    }

    const users = await SQL(
      `SELECT * FROM ${process.env.DATABASE_NAME}.users;`
    );

    const user = users.find((u) => u.username == username);

    if (!user) {
      return res.status(500).send({ err: "user not found" });
    }

    if (user.role == 1) {
      const admin = await SQL(`
              SELECT 
              id,
              name,
              lastname,
              username,
              cast(aes_decrypt(password, "admin_key") AS CHAR(100)) AS password,
              role
              FROM ${process.env.DATABASE_NAME}.users
              WHERE username = "${username}";
        `);

      if (!admin.find((a) => a.password == password)) {
        return res.status(401).send({ err: "Wrong username or password" });
      }

      req.session.user_id = user.id;
      req.session.role = user.role;

      return res.send({ isAdmin: true, msg: "admin logged succssesfully" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      res.status(500).send({ err: `Wrong username or password` });
    }

    console.log(user.id);

    req.session.user_id = user.id;
    req.session.save();

    console.log(req.session.user_id, "let see setter");

    res.send({
      isAdmin: false,
      msg: "user logged successfully",
      session: req.session,
    });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
