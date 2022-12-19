const { onlyLoggedUsers } = require("../helpers/onlyLoggedUsers");

const router = require("express").Router();
const { SQL } = require("../dbconfig");

// returning vacations to the user after login
router.get("/", onlyLoggedUsers, async (req, res) => {
  try {
    const user_and_vac = await SQL(
      `SELECT * FROM ${process.env.DATABASE_NAME}.user_and_vac;`
    );

    const vacations = await SQL(
      `SELECT * FROM ${process.env.DATABASE_NAME}.vacations; `
    );

    const follow = [];
    const vacList = [];

    user_and_vac.map((u) => {
      if (u.user_id == req.session.user_id) {
        console.log(u);
        const v = vacations.find((v) => v.id == u.vac_id);
        v.follow = true;
        vacList.push(v);
        follow.push(v);
      }
      return;
    });

    vacations.map((v) => {
      if (!follow.includes(v)) {
        v.follow = false;
        vacList.push(v);
      }
    });

    return res.send({ vacList });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
// returning vacations to the user after login

// updating user vacation follow list removing/adding
router.put("/", onlyLoggedUsers, async (req, res) => {
  try {
    const { vac_id } = req.body;

    if (!vac_id) {
      return res.status(500).send({ err: "missing some data" });
    }

    const vacations = await SQL(
      `SELECT * FROM ${process.env.DATABASE_NAME}.vacations;`
    );

    const vac = vacations.find((v) => v.id == vac_id);

    const exsits = await SQL(
      `SELECT * FROM ${process.env.DATABASE_NAME}.user_and_vac WHERE user_id = ${req.session.user_id} AND vac_id = ${vac_id};`
    );

    if (exsits.length == 0) {
      await SQL(`INSERT INTO user_and_vac (user_id, vac_id)
      VALUES (${req.session.user_id}, ${vac_id})`);
      await SQL(`UPDATE vacations
            SET followers = "${vac.followers + 1}"
            WHERE id = ${vac.id}`);
    } else {
      await SQL(
        `DELETE FROM user_and_vac WHERE user_id = ${req.session.user_id} AND vac_id = ${vac_id};`
      );
      await SQL(`UPDATE vacations
      SET followers = "${vac.followers - 1}"
      WHERE id = ${vac.id}`);
    }
    res.send({ msg: "vaction list updated successfully :)" });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
// updating user vacation follow list removing/adding

// handling user login out
router.delete("/", onlyLoggedUsers, (req, res) => {
  req.session.destroy();
  res.send({ msg: "bye bye! hope to see you again :)" });
});
// handling user login out

module.exports = router;
