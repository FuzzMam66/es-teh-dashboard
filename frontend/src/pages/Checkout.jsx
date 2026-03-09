import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar.jsx";

function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart } = location.state || { cart: [] };
  
  const [metodePembayaran, setMetodePembayaran] = useState("Tunai");
  const [nominalBayar, setNominalBayar] = useState("");
  const [loading, setLoading] = useState(false);

  const getTotalHarga = () => {
    return cart.reduce((total, item) => total + (item.harga * item.jumlah), 0);
  };

  const getKembalian = () => {
    if (metodePembayaran === "Tunai" && nominalBayar) {
      return parseFloat(nominalBayar) - getTotalHarga();
    }
    return 0;
  };

  const handleCheckout = async () => {
    if (metodePembayaran === "Tunai" && (!nominalBayar || parseFloat(nominalBayar) < getTotalHarga())) {
      alert("Nominal pembayaran tidak mencukupi!");
      return;
    }

    setLoading(true);
    try {
      const transactionData = {
        items: cart,
        metode_pembayaran: metodePembayaran,
        nominal_bayar: metodePembayaran === "Tunai" ? parseFloat(nominalBayar) : getTotalHarga()
      };

      const res = await api.post("/api/transactions", transactionData);
      
      if (res.data.status === "success") {
        if (metodePembayaran === "QRIS") {
          navigate("/qr-payment", { 
            state: { 
              totalHarga: getTotalHarga(),
              transactionId: res.data.id_transaksi 
            } 
          });
        } else {
          navigate("/cash-payment", { 
            state: { 
              totalHarga: getTotalHarga(),
              nominalBayar: parseFloat(nominalBayar),
              kembalian: res.data.kembalian,
              transactionId: res.data.id_transaksi 
            } 
          });
        }
      } else {
        alert("Gagal memproses transaksi: " + res.data.error);
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/penjualan");
  };

  if (cart.length === 0) {
    return (
      <div className="bg-[#f6f7f8] min-h-screen font-sans flex items-center justify-center">
        <Navbar />
        <div className="text-center p-10 bg-white rounded-2xl shadow-sm border">
          <h2 className="text-2xl font-bold mb-2 text-slate-800">Keranjang Kosong</h2>
          <p className="text-slate-500 mb-6">Anda belum memilih item apapun.</p>
          <button
            onClick={() => navigate("/penjualan")}
            className="bg-[#136dec] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Kembali ke Penjualan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f6f7f8] min-h-screen font-sans">
      <Navbar />
      <main className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-slate-500 mt-1">Selesaikan transaksi Anda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Rincian Pesanan</h2>
            </div>
            <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id_menu} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 text-sm">{item.nama_menu}</div>
                    <div className="text-xs text-slate-500">
                      {item.jumlah} x Rp {item.harga.toLocaleString()}
                    </div>
                  </div>
                  <div className="font-bold text-slate-800 text-sm">
                    Rp {(item.harga * item.jumlah).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 bg-blue-50 border-t border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-slate-800 font-bold text-lg">Total:</span>
                <span className="font-black text-2xl text-[#136dec]">Rp {getTotalHarga().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Metode Pembayaran</h2>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${metodePembayaran === 'Tunai' ? 'border-[#136dec] bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                  <input type="radio" name="payment" value="Tunai" checked={metodePembayaran === "Tunai"} onChange={(e) => setMetodePembayaran(e.target.value)} className="w-4 h-4 text-[#136dec] focus:ring-[#136dec]" />
                  <span className="ml-3 font-semibold text-slate-800">Tunai</span>
                </label>
                <label className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${metodePembayaran === 'QRIS' ? 'border-[#136dec] bg-blue-50' : 'border-slate-200 bg-slate-50'}`}>
                  <input type="radio" name="payment" value="QRIS" checked={metodePembayaran === "QRIS"} onChange={(e) => setMetodePembayaran(e.target.value)} className="w-4 h-4 text-[#136dec] focus:ring-[#136dec]" />
                  <span className="ml-3 font-semibold text-slate-800">QRIS</span>
                </label>
              </div>
            </div>

            {metodePembayaran === "Tunai" && (
              <div className="animate-fade-in">
                <label className="block text-sm font-bold text-slate-700 mb-2">Nominal Pembayaran</label>
                <input type="number" value={nominalBayar} onChange={(e) => setNominalBayar(e.target.value)} placeholder="Masukkan nominal pembayaran" min={getTotalHarga()} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none" />
                {nominalBayar && parseFloat(nominalBayar) >= getTotalHarga() && (
                  <div className="mt-2 p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold">
                    Kembalian: Rp {getKembalian().toLocaleString()}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="flex-1 bg-white border border-slate-200 px-5 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading || (metodePembayaran === "Tunai" && (!nominalBayar || parseFloat(nominalBayar) < getTotalHarga()))}
                className="flex-1 w-full bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Memproses..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Checkout;