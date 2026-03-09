import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdQrCode2, MdDone, MdArrowBack } from "react-icons/md";

function QRPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalHarga, transactionId } = location.state || {};
  const [confirmed, setConfirmed] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      setShowToast(true);
      setTimeout(() => navigate("/dashboard"), 2000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8] font-sans">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl w-full max-w-md flex flex-col items-center gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Pembayaran QRIS
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-2">
            Silakan scan QR Code di bawah ini.
          </p>
        </div>

        {/* QR Code Placeholder */}
        <div className="bg-white p-4 rounded-2xl border-4 border-slate-200 shadow-inner">
          <MdQrCode2 className="text-[240px] text-slate-800" />
        </div>

        <div className="text-center w-full bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm font-medium text-slate-500">Total Pembayaran</p>
          <p className="text-4xl font-black text-[#136dec]">
            Rp {totalHarga?.toLocaleString()}
          </p>
        </div>

        <div className="text-center text-xs text-slate-400 font-medium">
          ID Transaksi:{" "}
          <span className="font-bold text-slate-600">{transactionId}</span>
        </div>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleConfirm}
            disabled={confirmed}
            className="w-full flex items-center justify-center gap-2 bg-emerald-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {confirmed ? (
              <>
                <MdDone /> Dikonfirmasi
              </>
            ) : (
              "Konfirmasi Pembayaran"
            )}
          </button>

          <button
            onClick={() => navigate("/penjualan")}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
          >
            <MdArrowBack />
            Kembali ke Penjualan
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50 animate-fade-in">
          <div className="bg-white/20 p-1.5 rounded-full">
            <MdDone className="text-xl" />
          </div>
          <span className="font-bold">Pembayaran Berhasil Dikonfirmasi!</span>
        </div>
      )}
    </div>
  );
}

export default QRPayment;
