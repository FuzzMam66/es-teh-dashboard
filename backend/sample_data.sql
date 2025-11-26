-- Sample data untuk testing sistem kasir

-- Insert sample user (password: admin123)
INSERT INTO pengguna (username, password) VALUES 
('admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Insert sample series
INSERT INTO series (nama_series) VALUES 
('Minuman Dingin'),
('Minuman Panas'),
('Makanan Ringan'),
('Makanan Berat');

-- Insert sample menu items
INSERT INTO menu (nama_menu, id_series, harga, gambar) VALUES 
('Es Teh Manis', 1, 5000, NULL),
('Es Jeruk', 1, 7000, NULL),
('Es Kopi', 1, 8000, NULL),
('Es Campur', 1, 12000, NULL),
('Teh Panas', 2, 4000, NULL),
('Kopi Hitam', 2, 6000, NULL),
('Kopi Susu', 2, 8000, NULL),
('Coklat Panas', 2, 10000, NULL),
('Keripik Singkong', 3, 8000, NULL),
('Kerupuk', 3, 5000, NULL),
('Pisang Goreng', 3, 10000, NULL),
('Nasi Goreng', 4, 15000, NULL),
('Mie Ayam', 4, 12000, NULL),
('Bakso', 4, 13000, NULL);