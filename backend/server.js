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
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use("/uploads", express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

const SECRET = "jwtsecret123";

// --- MOCK DATA (DATA PALSU UNTUK DEMO) ---
console.log("⚠️  RUNNING IN DEMO MODE (NO DATABASE) ⚠️");

// 1. Users
const users = [
  {
    id_user: 1,
    username: "admin",
    password: "", // Will be hashed below
  },
];
(async () => {
  users[0].password = await bcrypt.hash("admin123", 10);
})();

// 2. Series
let seriesData = [
  { id_series: 1, nama_series: "Tea Series" },
  { id_series: 2, nama_series: "Milk Series" },
  { id_series: 3, nama_series: "Coffee Series" },
];

// 3. Menu
let menuData = [
  {
    id_menu: 1,
    id_series: 1,
    nama_menu: "Es Teh Original",
    harga: 3000,
    gambar: "/uploads/esteh.jpg",
  },
  {
    id_menu: 2,
    id_series: 1,
    nama_menu: "Es Teh Manis",
    harga: 4000,
    gambar: "/uploads/lemon.jpg",
  },
  {
    id_menu: 3,
    id_series: 2,
    nama_menu: "Milk Tea Brown Sugar",
    harga: 12000,
    gambar: "/uploads/milk.jpg",
  },
  {
    id_menu: 4,
    id_series: 3,
    nama_menu: "Americano",
    harga: 6000,
    gambar: "/uploads/ameri.jpg",
  },
];

// 4. Transaksi & Detail
let transaksiData = [];
let detailTransaksiData = [];
let pengeluaranData = [];

// Helper untuk generate ID
const getNextId = (arr, idField) => {
  if (arr.length === 0) return 1;
  return Math.max(...arr.map((item) => item[idField])) + 1;
};

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
  const user = users.find((u) => u.username === username);

  if (!user)
    return res.json({ status: "fail", message: "User tidak ditemukan" });

  bcrypt.compare(password, user.password, (err, valid) => {
    if (valid) {
      const token = jwt.sign({ id: user.id_user }, SECRET, { expiresIn: "1d" });
      res.json({ status: "success", token });
    } else {
      res.json({ status: "fail", message: "Password salah" });
    }
  });
}

// SERIES ENDPOINTS
app.get("/api/series", (req, res) => {
  res.json({ status: "success", data: seriesData });
});

app.post("/api/series", (req, res) => {
  const newItem = {
    id_series: getNextId(seriesData, "id_series"),
    nama_series: req.body.nama_series,
  };
  seriesData.push(newItem);
  res.json({
    status: "success",
    message: "Series berhasil ditambahkan",
    id: newItem.id_series,
  });
});

// MENU ENDPOINTS
app.get("/api/menu", (req, res) => {
  const { series } = req.query;
  let result = menuData.map((m) => {
    const s = seriesData.find((ser) => ser.id_series == m.id_series);
    return { ...m, nama_series: s ? s.nama_series : null };
  });

  if (series) {
    result = result.filter((m) => m.id_series == series);
  }
  res.json({ status: "success", data: result });
});

app.get("/api/menu/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const menu = menuData.find((m) => m.id_menu === id);
  if (!menu)
    return res.json({ status: "fail", message: "Menu tidak ditemukan" });

  const s = seriesData.find((ser) => ser.id_series == menu.id_series);
  res.json({
    status: "success",
    data: { ...menu, nama_series: s ? s.nama_series : null },
  });
});

app.post("/api/menu", upload.single("gambar"), (req, res) => {
  const { nama_menu, id_series, harga } = req.body;
  const newItem = {
    id_menu: getNextId(menuData, "id_menu"),
    nama_menu,
    id_series: parseInt(id_series),
    harga: parseFloat(harga),
    gambar: req.file ? `/uploads/${req.file.filename}` : null,
  };
  menuData.push(newItem);
  res.json({
    status: "success",
    message: "Menu berhasil ditambahkan",
    id: newItem.id_menu,
  });
});

app.put("/api/menu/:id", upload.single("gambar"), (req, res) => {
  const id = parseInt(req.params.id);
  const index = menuData.findIndex((m) => m.id_menu === id);

  if (index === -1)
    return res.json({ status: "fail", message: "Menu tidak ditemukan" });

  const { nama_menu, id_series, harga } = req.body;
  menuData[index].nama_menu = nama_menu;
  menuData[index].id_series = parseInt(id_series);
  menuData[index].harga = parseFloat(harga);
  if (req.file) {
    menuData[index].gambar = `/uploads/${req.file.filename}`;
  }
  res.json({ status: "success", message: "Menu berhasil diupdate" });
});

app.delete("/api/menu/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = menuData.length;
  menuData = menuData.filter((m) => m.id_menu !== id);

  if (menuData.length === initialLength)
    return res.json({ status: "fail", message: "Menu tidak ditemukan" });
  res.json({ status: "success", message: "Menu berhasil dihapus" });
});

// TRANSACTION ENDPOINTS
app.post("/api/transactions", (req, res) => {
  const { items, metode_pembayaran, nominal_bayar } = req.body;

  const total_harga = items.reduce(
    (sum, item) => sum + item.harga * item.jumlah,
    0,
  );
  const kembalian =
    metode_pembayaran === "Tunai" ? nominal_bayar - total_harga : 0;

  // Waktu sekarang (Jakarta Mock)
  const now = new Date();
  const jakartaTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);

  const newTrans = {
    id_transaksi: getNextId(transaksiData, "id_transaksi"),
    tanggal: jakartaTime.toISOString(),
    total_harga,
    metode_pembayaran,
    nominal_bayar,
    kembalian,
  };

  transaksiData.push(newTrans);

  items.forEach((item) => {
    detailTransaksiData.push({
      id_detail_transaksi: getNextId(
        detailTransaksiData,
        "id_detail_transaksi",
      ),
      id_transaksi: newTrans.id_transaksi,
      id_menu: item.id_menu,
      jumlah: item.jumlah,
      subtotal: item.harga * item.jumlah,
    });
  });

  res.json({
    status: "success",
    message: "Transaksi berhasil",
    id_transaksi: newTrans.id_transaksi,
    kembalian,
  });
});

// DEBUG ENDPOINT - Check database data
app.get("/api/debug/transactions", (req, res) => {
  res.json({
    status: "success",
    data: {
      transactions: transaksiData.slice(-10),
      details: detailTransaksiData.slice(-10),
    },
  });
});

// REPORTS ENDPOINTS
app.get("/api/reports/daily", (req, res) => {
  const { date } = req.query;
  const targetDate =
    date ||
    new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

  const dailyTrans = transaksiData.filter((t) =>
    t.tanggal.startsWith(targetDate),
  );

  // Simplified report for demo
  const reportData = dailyTrans.map((t) => ({
    nama_menu: `Transaksi #${t.id_transaksi} (${t.metode_pembayaran})`,
    total_jumlah: 1,
    total_pendapatan: t.total_harga,
  }));

  res.json({ status: "success", data: reportData });
});

app.get("/api/reports/financial", (req, res) => {
  const { days = 30 } = req.query;

  // Calculate the date `days` ago
  const now = new Date();
  const startDate = new Date(
    new Date().setDate(now.getDate() - parseInt(days)),
  );

  // Filter transactions within the date range
  const relevantTransactions = transaksiData.filter(
    (t) => new Date(t.tanggal) >= startDate,
  );

  // Filter expenses within the date range
  const relevantExpenses = pengeluaranData.filter(
    (p) => new Date(p.tanggal) >= startDate,
  );

  // Group income by date
  const incomeMap = relevantTransactions.reduce((acc, t) => {
    const date = t.tanggal.split("T")[0];
    if (!acc[date]) {
      acc[date] = { tanggal: date, total_transaksi: 0, total_pemasukan: 0 };
    }
    acc[date].total_transaksi += 1;
    acc[date].total_pemasukan += t.total_harga;
    return acc;
  }, {});
  const incomeResult = Object.values(incomeMap).sort(
    (a, b) => new Date(b.tanggal) - new Date(a.tanggal),
  );

  // Group expenses by date
  const expenseMap = relevantExpenses.reduce((acc, p) => {
    const date = p.tanggal.split("T")[0];
    if (!acc[date]) {
      acc[date] = { tanggal: date, total_pengeluaran: 0 };
    }
    acc[date].total_pengeluaran += parseFloat(p.jumlah);
    return acc;
  }, {});
  const expenseResult = Object.values(expenseMap).sort(
    (a, b) => new Date(b.tanggal) - new Date(a.tanggal),
  );

  // Calculate summary
  const totalPemasukan = incomeResult.reduce(
    (sum, day) => sum + day.total_pemasukan,
    0,
  );
  const totalPengeluaran = expenseResult.reduce(
    (sum, day) => sum + day.total_pengeluaran,
    0,
  );
  const totalTransaksi = incomeResult.reduce(
    (sum, day) => sum + day.total_transaksi,
    0,
  );

  res.json({
    status: "success",
    data: {
      pemasukan: incomeResult,
      pengeluaran: expenseResult,
    },
    summary: {
      total_pemasukan: totalPemasukan,
      total_pengeluaran: totalPengeluaran,
      keuntungan: totalPemasukan - totalPengeluaran,
      total_transaksi: totalTransaksi,
      days: parseInt(days),
    },
  });
});

// DASHBOARD STATS ENDPOINT
app.get("/api/dashboard/stats", (req, res) => {
  const today = new Date(new Date().getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const todayTrans = transaksiData.filter((t) => t.tanggal.startsWith(today));

  const total_transaksi = todayTrans.length;
  const total_pendapatan = todayTrans.reduce(
    (sum, t) => sum + parseFloat(t.total_harga),
    0,
  );

  let total_item = 0;
  todayTrans.forEach((t) => {
    const details = detailTransaksiData.filter(
      (dt) => dt.id_transaksi === t.id_transaksi,
    );
    total_item += details.reduce((sum, dt) => sum + dt.jumlah, 0);
  });

  res.json({
    status: "success",
    data: { total_transaksi, total_pendapatan, total_item },
  });
});

// TOP PRODUCTS ENDPOINT
app.get("/api/dashboard/top-products", (req, res) => {
  const salesMap = {};
  detailTransaksiData.forEach((dt) => {
    if (!salesMap[dt.id_menu]) salesMap[dt.id_menu] = 0;
    salesMap[dt.id_menu] += dt.jumlah;
  });

  const sortedSales = Object.keys(salesMap)
    .map((id) => {
      const menu = menuData.find((m) => m.id_menu == id);
      const series = menu
        ? seriesData.find((s) => s.id_series == menu.id_series)
        : null;
      return {
        nama_menu: menu ? menu.nama_menu : "Unknown",
        nama_series: series ? series.nama_series : "-",
        total_terjual: salesMap[id],
      };
    })
    .sort((a, b) => b.total_terjual - a.total_terjual)
    .slice(0, 5);

  res.json({ status: "success", data: sortedSales });
});

// PENGELUARAN ENDPOINTS
app.get("/api/pengeluaran", (req, res) => {
  res.json({ status: "success", data: pengeluaranData });
});

app.post("/api/pengeluaran", (req, res) => {
  const { deskripsi, jumlah, tanggal } = req.body;
  const newItem = {
    id_pengeluaran: getNextId(pengeluaranData, "id_pengeluaran"),
    deskripsi,
    jumlah,
    tanggal: tanggal || new Date().toISOString().split("T")[0],
  };
  pengeluaranData.push(newItem);
  res.json({
    status: "success",
    message: "Pengeluaran berhasil ditambahkan",
    id: newItem.id_pengeluaran,
  });
});

// --- SERVE FRONTEND FOR HOSTING ---
const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  // Handle React Routing, return index.html untuk semua request non-API
  app.get("/*path", (req, res) => {
    if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
      return res.status(404).json({ message: "Not found" });
    }
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend Demo running on 0.0.0.0:${PORT}`);
});
