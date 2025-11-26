import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Penjualan from "./pages/Penjualan";
import Checkout from "./pages/Checkout";
import QRPayment from "./pages/QRPayment";
import CashPayment from "./pages/CashPayment";
import KelolaMenu from "./pages/KelolaMenu";
import LaporanHarian from "./pages/LaporanHarian";
import Keuangan from "./pages/Keuangan";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/penjualan" element={<Penjualan />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/qr-payment" element={<QRPayment />} />
      <Route path="/cash-payment" element={<CashPayment />} />
      <Route path="/kelola-menu" element={<KelolaMenu />} />
      <Route path="/laporan-harian" element={<LaporanHarian />} />
      <Route path="/keuangan" element={<Keuangan />} />
    </Routes>
  );
}
