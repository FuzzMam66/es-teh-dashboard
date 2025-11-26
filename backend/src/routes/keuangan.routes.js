const express = require("express");
const router = express.Router();
const controller = require("../controllers/keuangan.controller");

// Financial report endpoint
router.get("/financial", (req, res) => {
  console.log('=== KEUANGAN FINANCIAL ENDPOINT CALLED ===');
  console.log('Query params:', req.query);
  controller.getFinancialReport(req, res);
});

// Expenses endpoints
router.get("/pengeluaran", (req, res) => {
  console.log('=== KEUANGAN PENGELUARAN GET CALLED ===');
  controller.getAllExpenses(req, res);
});
router.post("/pengeluaran", (req, res) => {
  console.log('=== KEUANGAN PENGELUARAN POST CALLED ===');
  console.log('Body:', req.body);
  controller.addExpense(req, res);
});

module.exports = router;