require('dotenv').config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Import database dengan error handling
let db;
try {
  db = require("./src/config/db");
  console.log("Database module loaded successfully");
} catch (err) {
  console.error("Failed to load database module:", err.message);
}

const SECRET = "jwtsecret123";

// Test route
app.get("/test", (req, res) => {
  res.json({ message: "Server berjalan dengan baik" });
});

// LOGIN - support both /login and /auth/login
app.post("/login", (req, res) => {
  handleLogin(req, res);
});

app.post("/auth/login", (req, res) => {
  handleLogin(req, res);
});

function handleLogin(req, res) {
  console.log("Login request received:", req.body);
  const { username, password } = req.body;
  
  if (!db) {
    return res.json({ status: "error", error: "Database not available" });
  }
  
  db.query(
    "SELECT * FROM pengguna WHERE username = ?",
    [username],
    (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.json({ status: "error", error: err.message });
      }

      if (result.length === 0)
        return res.json({ status: "fail", message: "User tidak ditemukan" });

      const user = result[0];

      // Cek password
      bcrypt.compare(password, user.password, (err, valid) => {
        if (err) {
          console.error("Password compare error:", err);
          return res.json({ status: "error", error: err.message });
        }
        
        if (!valid)
          return res.json({ status: "fail", message: "Password salah" });

        const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });
        res.json({ status: "success", token });
      });
    }
  );
}

// SERIES ENDPOINTS
app.get("/api/series", (req, res) => {
  db.query("SELECT * FROM series", (err, result) => {
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", data: result });
  });
});

app.post("/api/series", (req, res) => {
  const { nama_series } = req.body;
  db.query(
    "INSERT INTO series (nama_series) VALUES (?)",
    [nama_series],
    (err, result) => {
      if (err) return res.json({ status: "error", error: err.message });
      res.json({ status: "success", message: "Series berhasil ditambahkan", id: result.insertId });
    }
  );
});

// MENU ENDPOINTS
app.get("/api/menu", (req, res) => {
  const { series } = req.query;
  let query = "SELECT m.*, s.nama_series FROM menu m LEFT JOIN series s ON m.id_series = s.id_series";
  let params = [];
  
  if (series) {
    query += " WHERE m.id_series = ?";
    params.push(series);
  }
  
  db.query(query, params, (err, result) => {
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", data: result });
  });
});

app.get("/api/menu/:id", (req, res) => {
  db.query("SELECT m.*, s.nama_series FROM menu m LEFT JOIN series s ON m.id_series = s.id_series WHERE m.id_menu = ?", [req.params.id], (err, result) => {
    if (err) return res.json({ status: "error", error: err.message });
    if (result.length === 0) return res.json({ status: "fail", message: "Menu tidak ditemukan" });
    res.json({ status: "success", data: result[0] });
  });
});

app.post("/api/menu", upload.single('gambar'), (req, res) => {
  const { nama_menu, id_series, harga } = req.body;
  const gambar = req.file ? `/uploads/${req.file.filename}` : null;
  
  console.log('Menu upload:', { nama_menu, id_series, harga, gambar, file: req.file });
  
  db.query(
    "INSERT INTO menu (nama_menu, id_series, harga, gambar) VALUES (?, ?, ?, ?)",
    [nama_menu, id_series, harga, gambar],
    (err, result) => {
      if (err) return res.json({ status: "error", error: err.message });
      res.json({ status: "success", message: "Menu berhasil ditambahkan", id: result.insertId });
    }
  );
});

app.put("/api/menu/:id", upload.single('gambar'), (req, res) => {
  const { nama_menu, id_series, harga } = req.body;
  let gambar = req.body.gambar; // Keep existing image if no new file
  
  if (req.file) {
    gambar = `/uploads/${req.file.filename}`;
  }
  
  console.log('Menu update:', { nama_menu, id_series, harga, gambar, file: req.file });
  
  db.query(
    "UPDATE menu SET nama_menu = ?, id_series = ?, harga = ?, gambar = ? WHERE id_menu = ?",
    [nama_menu, id_series, harga, gambar, req.params.id],
    (err, result) => {
      if (err) return res.json({ status: "error", error: err.message });
      res.json({ status: "success", message: "Menu berhasil diupdate" });
    }
  );
});

app.delete("/api/menu/:id", (req, res) => {
  db.query(
    "DELETE FROM menu WHERE id_menu = ?",
    [req.params.id],
    (err, result) => {
      if (err) return res.json({ status: "error", error: err.message });
      if (result.affectedRows === 0) return res.json({ status: "fail", message: "Menu tidak ditemukan" });
      res.json({ status: "success", message: "Menu berhasil dihapus" });
    }
  );
});

// TRANSACTION ENDPOINTS
app.post("/api/transactions", (req, res) => {
  console.log("Transaction request:", req.body);
  const { items, metode_pembayaran, nominal_bayar } = req.body;
  
  const total_harga = items.reduce((sum, item) => sum + (item.harga * item.jumlah), 0);
  const kembalian = metode_pembayaran === 'Tunai' ? nominal_bayar - total_harga : 0;
  
  console.log("Transaction data:", { total_harga, metode_pembayaran, nominal_bayar, kembalian });
  
  db.query(
    "INSERT INTO transaksi (total_harga, metode_pembayaran, nominal_bayar, kembalian) VALUES (?, ?, ?, ?)",
    [total_harga, metode_pembayaran, nominal_bayar, kembalian],
    (err, result) => {
      if (err) {
        console.error("Transaction insert error:", err);
        return res.json({ status: "error", error: err.message });
      }
      
      const id_transaksi = result.insertId;
      console.log("Transaction inserted with ID:", id_transaksi);
      
      // Insert detail transaksi
      const itemQueries = items.map(item => {
        return new Promise((resolve, reject) => {
          console.log("Inserting detail:", { id_transaksi, id_menu: item.id_menu, jumlah: item.jumlah, subtotal: item.harga * item.jumlah });
          db.query(
            "INSERT INTO detail_transaksi (id_transaksi, id_menu, jumlah, subtotal) VALUES (?, ?, ?, ?)",
            [id_transaksi, item.id_menu, item.jumlah, item.harga * item.jumlah],
            (err, result) => {
              if (err) {
                console.error("Detail insert error:", err);
                reject(err);
              } else {
                console.log("Detail inserted:", result.insertId);
                resolve(result);
              }
            }
          );
        });
      });
      
      Promise.all(itemQueries)
        .then(() => {
          console.log("All transaction details inserted successfully");
          res.json({ status: "success", message: "Transaksi berhasil", id_transaksi, kembalian });
        })
        .catch(err => {
          console.error("Transaction details error:", err);
          res.json({ status: "error", error: err.message });
        });
    }
  );
});

// DEBUG ENDPOINT - Check database data
app.get("/api/debug/transactions", (req, res) => {
  db.query("SELECT * FROM transaksi ORDER BY tanggal DESC LIMIT 10", (err, transactions) => {
    if (err) return res.json({ status: "error", error: err.message });
    
    db.query("SELECT * FROM detail_transaksi ORDER BY id_detail_transaksi DESC LIMIT 10", (err, details) => {
      if (err) return res.json({ status: "error", error: err.message });
      
      res.json({ 
        status: "success", 
        data: { 
          transactions, 
          details,
          today_utc: new Date().toISOString().split('T')[0],
          today_jakarta: new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().split('T')[0]
        } 
      });
    });
  });
});

// REPORTS ENDPOINTS
app.get("/api/reports/daily", (req, res) => {
  const { date } = req.query;
  const targetDate = date || new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().split('T')[0];
  
  console.log("Fetching daily report for date (Jakarta):", targetDate);
  
  // First check if there are any transactions for this date
  db.query(
    "SELECT COUNT(*) as count FROM transaksi WHERE DATE(tanggal) = ?",
    [targetDate],
    (err, countResult) => {
      if (err) {
        console.error("Count query error:", err);
        return res.json({ status: "error", error: err.message });
      }
      
      console.log("Transaction count for date:", countResult[0].count);
      
      // Debug: Check raw data first
      db.query(
        "SELECT t.id_transaksi, DATE(t.tanggal) as tanggal_only, t.tanggal FROM transaksi t WHERE DATE(t.tanggal) = ?",
        [targetDate],
        (err, debugTransaksi) => {
          console.log("Debug transaksi for", targetDate, ":", debugTransaksi);
          
          // Check all detail_transaksi first
          db.query(
            "SELECT * FROM detail_transaksi LIMIT 10",
            (err, allDetails) => {
              console.log("All detail_transaksi:", allDetails);
              
              db.query(
                "SELECT dt.*, t.tanggal FROM detail_transaksi dt JOIN transaksi t ON dt.id_transaksi = t.id_transaksi WHERE DATE(t.tanggal) = ?",
                [targetDate],
                (err, debugDetail) => {
                  console.log("Debug detail for", targetDate, ":", debugDetail);
              
              // Try to get detailed data first, fallback to transaction data
              const detailQuery = `
                SELECT 
                  COALESCE(m.nama_menu, CONCAT('Menu ID: ', dt.id_menu)) as nama_menu,
                  SUM(dt.jumlah) as total_jumlah,
                  SUM(dt.subtotal) as total_pendapatan
                FROM detail_transaksi dt
                LEFT JOIN menu m ON dt.id_menu = m.id_menu
                JOIN transaksi t ON dt.id_transaksi = t.id_transaksi
                WHERE DATE(t.tanggal) = DATE(?)
                GROUP BY dt.id_menu, m.nama_menu 
                ORDER BY total_pendapatan DESC
              `;
              
              db.query(detailQuery, [targetDate], (err, detailResult) => {
                if (err || detailResult.length === 0) {
                  // Fallback to transaction data
                  const transactionQuery = `
                    SELECT 
                      CONCAT('Transaksi #', t.id_transaksi, ' - ', t.metode_pembayaran) as nama_menu,
                      1 as total_jumlah,
                      t.total_harga as total_pendapatan
                    FROM transaksi t
                    WHERE DATE(t.tanggal) = DATE(?)
                    ORDER BY t.total_harga DESC
                  `;
                  
                  db.query(transactionQuery, [targetDate], (err, transactionResult) => {
                    if (err) {
                      console.error("Transaction fallback query error:", err);
                      return res.json({ status: "error", error: err.message });
                    }
                    console.log("Using transaction fallback data:", transactionResult);
                    res.json({ status: "success", data: transactionResult });
                  });
                } else {
                  console.log("Using detailed data:", detailResult);
                  res.json({ status: "success", data: detailResult });
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
});

app.get("/api/reports/financial", (req, res) => {
  const { days = 30 } = req.query;
  
  // Get income from transactions
  db.query(
    `SELECT 
      DATE(tanggal) as tanggal,
      COUNT(*) as total_transaksi,
      SUM(total_harga) as total_pemasukan
    FROM transaksi 
    WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY DATE(tanggal)
    ORDER BY tanggal DESC`,
    [days],
    (err, incomeResult) => {
      if (err) return res.json({ status: "error", error: err.message });
      
      // Get expenses
      db.query(
        `SELECT 
          tanggal,
          SUM(jumlah) as total_pengeluaran
        FROM pengeluaran 
        WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        GROUP BY tanggal
        ORDER BY tanggal DESC`,
        [days],
        (err, expenseResult) => {
          if (err) return res.json({ status: "error", error: err.message });
          
          const totalPemasukan = incomeResult.reduce((sum, day) => sum + parseFloat(day.total_pemasukan || 0), 0);
          const totalPengeluaran = expenseResult.reduce((sum, day) => sum + parseFloat(day.total_pengeluaran || 0), 0);
          
          res.json({ 
            status: "success", 
            data: {
              pemasukan: incomeResult,
              pengeluaran: expenseResult
            },
            summary: {
              total_pemasukan: totalPemasukan,
              total_pengeluaran: totalPengeluaran,
              keuntungan: totalPemasukan - totalPengeluaran,
              total_transaksi: incomeResult.reduce((sum, day) => sum + day.total_transaksi, 0),
              days: days
            }
          });
        }
      );
    }
  );
});

// DASHBOARD STATS ENDPOINT
app.get("/api/dashboard/stats", (req, res) => {
  const today = new Date(new Date().getTime() + (7 * 60 * 60 * 1000)).toISOString().split('T')[0];
  
  db.query(
    `SELECT 
      COUNT(*) as total_transaksi,
      COALESCE(SUM(total_harga), 0) as total_pendapatan,
      COALESCE((
        SELECT SUM(dt.jumlah) 
        FROM detail_transaksi dt 
        JOIN transaksi t2 ON dt.id_transaksi = t2.id_transaksi 
        WHERE DATE(t2.tanggal) = ?
      ), 0) as total_item
    FROM transaksi 
    WHERE DATE(tanggal) = ?`,
    [today, today],
    (err, result) => {
      if (err) return res.json({ status: "error", error: err.message });
      res.json({ status: "success", data: result[0] });
    }
  );
});

// PENGELUARAN ENDPOINTS
app.get("/api/pengeluaran", (req, res) => {
  db.query("SELECT * FROM pengeluaran ORDER BY tanggal DESC", (err, result) => {
    if (err) return res.json({ status: "error", error: err.message });
    res.json({ status: "success", data: result });
  });
});

app.post("/api/pengeluaran", (req, res) => {
  const { deskripsi, jumlah, tanggal } = req.body;
  db.query(
    "INSERT INTO pengeluaran (deskripsi, jumlah, tanggal) VALUES (?, ?, ?)",
    [deskripsi, jumlah, tanggal || new Date().toISOString().split('T')[0]],
    (err, result) => {
      if (err) return res.json({ status: "error", error: err.message });
      res.json({ status: "success", message: "Pengeluaran berhasil ditambahkan", id: result.insertId });
    }
  );
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});
