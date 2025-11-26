const db = require("../config/db");

module.exports = {
  createTransaksi: (req, res) => {
    const { items, metode_pembayaran, nominal_bayar } = req.body;

    const total = items.reduce((a, b) => a + b.subtotal, 0);
    const kembalian = metode_pembayaran === "Tunai" ? nominal_bayar - total : 0;

    db.query(
      "INSERT INTO transaksi (total_harga, metode_pembayaran, nominal_bayar, kembalian) VALUES (?,?,?,?)",
      [total, metode_pembayaran, nominal_bayar, kembalian],
      (err, result) => {
        if (err) throw err;

        const id_transaksi = result.insertId;

        items.forEach(item => {
          db.query(
            "INSERT INTO detail_transaksi (id_transaksi, id_menu, jumlah, subtotal) VALUES (?,?,?,?)",
            [id_transaksi, item.id_menu, item.jumlah, item.subtotal]
          );
        });

        res.json({ msg: "Transaksi berhasil" });
      }
    );
  }
};
