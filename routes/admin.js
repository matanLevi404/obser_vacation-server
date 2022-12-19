const { onlyAdminUsers } = require("../helpers/onlyAdminUsers");

const router = require("express").Router();
const { SQL } = require("../dbconfig");

// sending vacations to admin user
router.get("/", onlyAdminUsers, async (req, res) => {
  try {
    const vacList = await SQL(`SELECT * FROM vacations;`);

    res.send({ vacList });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
// sending vacations to admin user

// returning single vacation
router.get("/vacation/:id", onlyAdminUsers, async (req, res) => {
  try {
    const { id } = req.params;
    const vac = await SQL(`SELECT * FROM vacations WHERE id = ${id};`);

    res.send({ vac });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
// returning single vacation

// adding vacations
router.post("/add", onlyAdminUsers, async (req, res) => {
  try {
    const { description, destination, img_url, start, end, price } = req.body;

    if (!description || !destination || !img_url || !start || !end || !price) {
      return res.status(500).send({ err: "missing some data" });
    }

    await SQL(`INSERT INTO vacations (
                description,
                destination,
                img_url,
                start,
                end,
                price
            )
            VALUES
                ("${description}",
                "${destination}",
                "${img_url}",
                "${start}",
                "${end}",
                ${price});`);

    res.send({ msg: "vacation has added successfully :)" });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
// adding vacations

// remove vactions
router.delete("/", onlyAdminUsers, async (req, res) => {
  try {
    const { vac_id } = req.body;

    if (!vac_id) {
      return res.status(500).send({ msg: "missing some data about request" });
    }

    await SQL(`DELETE FROM user_and_vac WHERE vac_id = ${vac_id};`);

    await SQL(`DELETE FROM vacations WHERE id = ${vac_id}`);

    res.send({ msg: "vaction removed" });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

// updating vacations
router.put("/update", onlyAdminUsers, async (req, res) => {
  try {
    const { vac_id, start, end, price } = req.body;

    console.log(req.body);

    if (!vac_id || !start || !end || !price) {
      return res.status(500).send({ err: "missing some data" });
    }

    const vacations = await SQL(`SELECT * FROM obser_vacation.vacations; `);

    const vac = vacations.find((v) => v.id == vac_id);

    if (!vac) {
      return res.status(500).send({ err: "vacation id doesnt exists" });
    }

    await SQL(`UPDATE vacations 
                SET start = "${start}",
                end = "${end}",
                price = ${price}
                WHERE id = ${vac_id};`);

    res.send({ msg: "vaction updated successfully :)" });
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});
// updating vacations

// reports
router.get("/reports", onlyAdminUsers, async (req, res) => {
  try {
    const vacations = await SQL(
      `SELECT destination, followers FROM obser_vacation.vacations;`
    );

    const namesArr = [];
    const followersArr = [];
    vacations.map((v) => {
      const { destination, followers } = v;
      namesArr.push(destination);
      followersArr.push(followers);
    });

    res.send({ namesArr, followersArr });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
