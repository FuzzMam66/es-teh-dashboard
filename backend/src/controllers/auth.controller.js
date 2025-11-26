const db = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.login = (req, res) => {
    const { username, password } = req.body;

    db.query(
        "SELECT * FROM pengguna WHERE username = ?",
        [username],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Server error" });
            if (results.length === 0) {
                return res.status(401).json({ message: "Username tidak ditemukan" });
            }

            const user = results[0];

            // validasi password (password disimpan hash)
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (!isMatch) {
                    return res.status(401).json({ message: "Password salah" });
                }

                const token = jwt.sign(
                    { id_user: user.id_user, username: user.username },
                    process.env.JWT_SECRET,
                    { expiresIn: "1d" }
                );

                return res.json({
                    message: "Login berhasil",
                    token
                });
            });
        }
    );
};
