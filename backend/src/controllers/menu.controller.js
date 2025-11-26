const db = require("../config/db");

module.exports = {
  getMenu: (req, res) => {
    db.query("SELECT * FROM menu", (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  },

  addMenu: (req, res) => {
    const { id_series, nama_menu, harga, stok } = req.body;
    const gambar = req.file?.filename || null;

    db.query(
      "INSERT INTO menu (id_series, nama_menu, harga, stok, gambar) VALUES (?,?,?,?,?)",
      [id_series, nama_menu, harga, stok, gambar],
      (err) => {
        if (err) throw err;
        res.json({ msg: "Menu berhasil ditambahkan" });
      }
    );
  }
};
