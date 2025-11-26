require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'));

// routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/menu", require("./routes/menu.routes"));
app.use("/transaksi", require("./routes/transaksi.routes"));
app.use("/laporan", require("./routes/laporan.routes"));
app.use("/keuangan", require("./routes/keuangan.routes"));

app.listen(5000, () => console.log("Server running at http://localhost:5000"));
