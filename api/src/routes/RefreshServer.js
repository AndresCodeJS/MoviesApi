const router = require("express").Router();
const axios = require("axios");

router.get("/server", async function (req, res) {
    console.log('refresh')
  res.json({ refresh: "successful" });
});

module.exports = router;
