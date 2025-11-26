const db = require("../config/db");

module.exports = {
  // Get financial report
  getFinancialReport: (req, res) => {
    const { days = 30 } = req.query;
    
    console.log(`Fetching financial data for ${days} days`);
    
    // First, let's check all transactions without date filter
    db.query(
      "SELECT COUNT(*) as total_count, MIN(tanggal) as earliest_date, MAX(tanggal) as latest_date FROM transaksi",
      (err, debugResult) => {
        if (err) return res.json({ status: "error", error: err.message });
        console.log('Debug - All transactions:', debugResult[0]);
        
        // Get total income from all transactions (no date filter for now)
        db.query(
          `SELECT 
            COUNT(*) as total_transaksi,
            COALESCE(SUM(total_harga), 0) as total_pemasukan
          FROM transaksi`,
          (err, incomeResult) => {
            if (err) return res.json({ status: "error", error: err.message });
            
            console.log(`Income result (all time):`, incomeResult[0]);
        
            // Get daily income breakdown (all transactions)
            db.query(
              `SELECT 
                DATE(tanggal) as tanggal,
                COUNT(*) as total_transaksi,
                COALESCE(SUM(total_harga), 0) as total_pemasukan
              FROM transaksi 
              GROUP BY DATE(tanggal)
              ORDER BY tanggal DESC
              LIMIT 30`,
              (err, dailyIncomeResult) => {
                if (err) return res.json({ status: "error", error: err.message });
                
                console.log('Daily income result:', dailyIncomeResult);
            
                // Get all expenses (no date filter for now)
                db.query(
                  `SELECT 
                    tanggal,
                    SUM(jumlah) as total_pengeluaran
                  FROM pengeluaran 
                  GROUP BY tanggal
                  ORDER BY tanggal DESC
                  LIMIT 30`,
                  (err, expenseResult) => {
                    if (err) return res.json({ status: "error", error: err.message });
                    
                    console.log('Expense result:', expenseResult);
                    
                    const totalPemasukan = parseFloat(incomeResult[0]?.total_pemasukan || 0);
                    const totalTransaksi = parseInt(incomeResult[0]?.total_transaksi || 0);
                    const totalPengeluaran = expenseResult.reduce((sum, day) => sum + parseFloat(day.total_pengeluaran || 0), 0);
                    
                    console.log('Final summary:', {
                      totalPemasukan,
                      totalTransaksi,
                      totalPengeluaran
                    });
                
                    res.json({ 
                      status: "success", 
                      data: {
                        pemasukan: dailyIncomeResult,
                        pengeluaran: expenseResult
                      },
                      summary: {
                        total_pemasukan: totalPemasukan,
                        total_pengeluaran: totalPengeluaran,
                        keuntungan: totalPemasukan - totalPengeluaran,
                        total_transaksi: totalTransaksi,
                        days: days
                      }
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  },

  // Get all expenses
  getAllExpenses: (req, res) => {
    db.query("SELECT * FROM pengeluaran ORDER BY tanggal DESC", (err, result) => {
      if (err) return res.json({ status: "error", error: err.message });
      res.json({ status: "success", data: result });
    });
  },

  // Add new expense
  addExpense: (req, res) => {
    const { deskripsi, jumlah, tanggal } = req.body;
    db.query(
      "INSERT INTO pengeluaran (deskripsi, jumlah, tanggal) VALUES (?, ?, ?)",
      [deskripsi, jumlah, tanggal || new Date().toISOString().split('T')[0]],
      (err, result) => {
        if (err) return res.json({ status: "error", error: err.message });
        res.json({ status: "success", message: "Pengeluaran berhasil ditambahkan", id: result.insertId });
      }
    );
  }
};