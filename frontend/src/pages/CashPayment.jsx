import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdDone, MdPointOfSale } from "react-icons/md";

function CashPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const { totalHarga, nominalBayar, kembalian, transactionId } =
    location.state || {};

  const handleFinish = () => {
    setShowToast(true);
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8] font-sans">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl w-full max-w-md flex flex-col items-center gap-6">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-white mb-2">
          <MdDone className="text-5xl" />
        </div>
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Pembayaran Berhasil
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2">
            Transaksi tunai telah selesai.
          </p>
        </div>

        <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-slate-500">Total Pesanan</span>
            <span className="font-bold text-slate-800">
              Rp {totalHarga?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-slate-500">Nominal Bayar</span>
            <span className="font-bold text-slate-800">
              Rp {nominalBayar?.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center bg-emerald-100/50 text-emerald-700 p-4 rounded-lg mt-2">
            <span className="font-bold">Kembalian</span>
            <span className="font-black text-2xl">
              Rp {kembalian?.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="text-center text-xs text-slate-400 font-medium bg-blue-50 border border-blue-100 px-4 py-2 rounded-lg">
          ID Transaksi:{" "}
          <span className="font-bold text-blue-600">{transactionId}</span>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleFinish}
            className="w-full bg-[#136dec] text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:opacity-90 transition-all"
          >
            Selesai & Kembali ke Dashboard
          </button>
          <button
            onClick={() => navigate("/penjualan")}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            <MdPointOfSale />
            Buat Transaksi Baru
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in">
          <div className="bg-white/20 p-1.5 rounded-full">
            <MdDone className="text-xl" />
          </div>
          <span className="font-bold">Transaksi Selesai!</span>
        </div>
      )}
    </div>
  );
}

export default CashPayment;
