import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar.jsx";
import {
  MdCalendarToday,
  MdAttachMoney,
  MdAssignment,
  MdTrendingDown,
  MdTrendingUp,
  MdMoneyOff,
  MdAdd,
  MdClose,
  MdSave,
  MdDone,
  MdError,
} from "react-icons/md";
import { FiPackage } from "react-icons/fi";

function LaporanHarian() {
  const [laporan, setLaporan] = useState([]);
  const [pengeluaran, setPengeluaran] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [loading, setLoading] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    deskripsi: "",
    jumlah: "",
  });
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const dateParam = selectedDate || new Date().toISOString().split("T")[0];

      const [salesRes, expenseRes] = await Promise.all([
        api.get(
          selectedDate
            ? `/api/reports/daily?date=${selectedDate}`
            : "/api/reports/daily",
        ),
        api.get("/api/pengeluaran"),
      ]);

      if (salesRes.data.status === "success") {
        setLaporan(salesRes.data.data);
      }

      if (expenseRes.data.status === "success") {
        const filteredExpenses = expenseRes.data.data.filter((item) => {
          const itemDate = new Date(item.tanggal).toISOString().split("T")[0];
          return itemDate === dateParam;
        });
        setPengeluaran(filteredExpenses);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...expenseForm, tanggal: selectedDate };
      const res = await api.post("/api/pengeluaran", payload);
      if (res.data.status === "success") {
        setToast({
          show: true,
          message: "Pengeluaran berhasil ditambahkan!",
          type: "success",
        });
        setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
        setExpenseForm({
          deskripsi: "",
          jumlah: "",
        });
        setShowAddExpense(false);
        fetchData();
      }
    } catch (err) {
      setToast({
        show: true,
        message: "Error: " + (err.response?.data?.error || err.message),
        type: "error",
      });
      setTimeout(() => setToast((prev) => ({ ...prev, show: false })), 3000);
    }
  };

  const getTotalPendapatan = () => {
    return laporan.reduce(
      (total, item) => total + parseFloat(item.total_pendapatan || 0),
      0,
    );
  };

  const getTotalItem = () => {
    return laporan.reduce(
      (total, item) => total + parseInt(item.total_jumlah || 0),
      0,
    );
  };

  const getTotalPengeluaran = () => {
    return pengeluaran.reduce(
      (total, item) => total + parseFloat(item.jumlah || 0),
      0,
    );
  };

  const getKeuntungan = () => {
    return getTotalPendapatan() - getTotalPengeluaran();
  };

  return (
    <div className="bg-[#f6f7f8] min-h-screen font-sans">
      <Navbar />
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Laporan Penjualan Harian
            </h1>
            <p className="text-slate-500 mt-1">
              Analisis detail penjualan berdasarkan tanggal yang dipilih.
            </p>
          </div>
        </div>

        {/* Date Filter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <MdCalendarToday /> Pilih Tanggal:
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none"
            />
            <button
              onClick={() => setShowAddExpense(true)}
              className="cursor-pointer flex items-center gap-2 bg-[#136dec] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
            >
              <MdAdd /> Tambah Pengeluaran
            </button>
            <div className="flex-grow"></div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                <MdAttachMoney className="text-2xl" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Pemasukan</p>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Rp {getTotalPendapatan().toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl">
                <MdTrendingDown className="text-2xl" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Pengeluaran
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Rp {getTotalPengeluaran().toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <FiPackage className="text-2xl" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Total Item Terjual
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {getTotalItem()}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${getKeuntungan() >= 0 ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"}`}
              >
                {getKeuntungan() >= 0 ? (
                  <MdTrendingUp className="text-2xl" />
                ) : (
                  <MdTrendingDown className="text-2xl" />
                )}
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">Keuntungan</p>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Rp {getKeuntungan().toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Report Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-emerald-50">
              <MdAssignment className="text-2xl text-emerald-600" />
              <div>
                <h3 className="font-bold text-emerald-800">Detail Penjualan</h3>
              </div>
            </div>

            {loading ? (
              <div className="p-10 text-center text-slate-500">
                Memuat data...
              </div>
            ) : laporan.length === 0 ? (
              <div className="p-10 text-center text-slate-500 italic">
                Tidak ada data penjualan untuk tanggal ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Nama Menu</th>
                      <th className="px-6 py-3 text-center">Qty</th>
                      <th className="px-6 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {laporan.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {item.nama_menu}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-800">
                          {item.total_jumlah}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-emerald-600">
                          Rp{" "}
                          {parseFloat(item.total_pendapatan).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Expense Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-red-50">
              <MdMoneyOff className="text-2xl text-red-600" />
              <div>
                <h3 className="font-bold text-red-800">Detail Pengeluaran</h3>
              </div>
            </div>
            {loading ? (
              <div className="p-10 text-center text-slate-500">
                Memuat data...
              </div>
            ) : pengeluaran.length === 0 ? (
              <div className="p-10 text-center text-slate-500 italic">
                Tidak ada data pengeluaran untuk tanggal ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                    <tr>
                      <th className="px-6 py-3">Deskripsi</th>
                      <th className="px-6 py-3 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pengeluaran.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-semibold text-slate-800">
                          {item.deskripsi}
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-red-600">
                          Rp {parseFloat(item.jumlah).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {toast.show && (
        <div
          className={`fixed top-10 left-1/2 -translate-x-1/2 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[60] animate-fade-in ${
            toast.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <div className="bg-white/20 p-1.5 rounded-full">
            {toast.type === "success" ? (
              <MdDone className="text-xl" />
            ) : (
              <MdError className="text-xl" />
            )}
          </div>
          <span className="font-bold">{toast.message}</span>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Tambah Pengeluaran
                </h2>
                <p className="text-sm text-slate-500">
                  Untuk tanggal:{" "}
                  {new Date(selectedDate).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <button
                onClick={() => setShowAddExpense(false)}
                className="cursor-pointer p-2 rounded-full hover:bg-slate-100"
              >
                <MdClose className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Deskripsi
                </label>
                <input
                  type="text"
                  value={expenseForm.deskripsi}
                  onChange={(e) =>
                    setExpenseForm({
                      ...expenseForm,
                      deskripsi: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none"
                  placeholder="Contoh: Beli galon air"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Jumlah (Rp)
                </label>
                <input
                  type="number"
                  value={expenseForm.jumlah}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, jumlah: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="cursor-pointer bg-red-600 border text-white border-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-red-900 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="cursor-pointer flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all"
                >
                  <MdSave /> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LaporanHarian;
