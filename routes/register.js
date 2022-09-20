const router = require("express").Router();
const bcrypt = require("bcrypt");
const { SQL } = require("../dbconfig");

router.post("/", async (req, res) => {
  const { name, lastName, username, password } = req.body;

  if (!name || !lastName || !username || !password) {
    return res
      .status(500)
      .send({ err: "missing some info, pls fill all inputs" });
  }

  try {
    // checks if username allready exists
    const users = await SQL(`SELECT * FROM obser_vacation.users;`);
    if (users.find((u) => u.username == username)) {
      return res.status(500).send({ err: "username allready taken" });
    }

    // creating a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    await SQL(`INSERT INTO users (
                  name,
                  lastName,
                  username,
                  password,
                  role)
              VALUES
                  ("${name}", "${lastName}", "${username}", "${hashedPassword}", 0);`);

    res.send({ msg: "user added successfully" });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
