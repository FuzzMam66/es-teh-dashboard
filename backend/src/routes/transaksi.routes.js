const express = require("express");
const router = express.Router();
const controller = require("../controllers/transaksi.controller");

router.post("/", controller.createTransaksi);

module.exports = router;
