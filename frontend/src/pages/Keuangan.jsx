import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar.jsx";
import {
  MdAdd,
  MdBarChart,
  MdRefresh,
  MdAttachMoney,
  MdTrendingDown,
  MdTrendingUp,
  MdShoppingCart,
  MdCalendarToday,
  MdDescription,
  MdClose,
  MdSave,
  MdReceiptLong,
} from "react-icons/md";
import { FiClock } from "react-icons/fi";

function Keuangan() {
  const [financialData, setFinancialData] = useState({
    pemasukan: [],
    pengeluaran: [],
  });
  const [summary, setSummary] = useState({
    total_pemasukan: 0,
    total_pengeluaran: 0,
    keuntungan: 0,
    total_transaksi: 0,
    days: 30,
  });
  const [selectedDays, setSelectedDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    deskripsi: "",
    jumlah: "",
    tanggal: new Date().toISOString().split("T")[0],
  });

  const fetchFinancialData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/reports/financial?days=${selectedDays}`);
      if (res.data.status === "success") {
        setFinancialData(res.data.data);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.error("Error fetching financial data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/pengeluaran", expenseForm);
      if (res.data.status === "success") {
        alert("Pengeluaran berhasil ditambahkan!");
        setExpenseForm({
          deskripsi: "",
          jumlah: "",
          tanggal: new Date().toISOString().split("T")[0],
        });
        setShowAddExpense(false);
        fetchFinancialData();
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await api.get(
          `/api/reports/financial?days=${selectedDays}`,
        );
        if (res.data.status === "success") {
          setFinancialData(res.data.data);
          setSummary(res.data.summary);
        }
      } catch (err) {
        console.error("Error loading financial data:", err);
      }
    };

    loadData();
  }, [selectedDays]);

  return (
    <div className="bg-[#f6f7f8] min-h-screen font-sans">
      <Navbar />
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Laporan Keuangan
            </h1>
            <p className="text-slate-500 mt-1">
              Analisis pemasukan, pengeluaran, dan keuntungan bisnis Anda.
            </p>
          </div>
          <button
            onClick={() => setShowAddExpense(true)}
            className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all cursor-pointer"
          >
            <MdAdd className="text-lg" />
            <span>Tambah Pengeluaran</span>
          </button>
        </div>

        {/* Period Filter */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <MdBarChart /> Periode Laporan:
            </label>
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none"
            >
              <option value={7}>7 Hari Terakhir</option>
              <option value={30}>30 Hari Terakhir</option>
              <option value={90}>90 Hari Terakhir</option>
            </select>
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
                <p className="text-slate-500 text-sm font-medium">
                  Total Pemasukan
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Rp {summary.total_pemasukan.toLocaleString()}
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
                  Total Pengeluaran
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Rp {summary.total_pengeluaran.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div
                className={`p-3 rounded-xl ${summary.keuntungan >= 0 ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"}`}
              >
                {summary.keuntungan >= 0 ? (
                  <MdTrendingUp className="text-2xl" />
                ) : (
                  <MdTrendingDown className="text-2xl" />
                )}
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Keuntungan Bersih
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Rp {summary.keuntungan.toLocaleString()}
                </h3>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <MdReceiptLong className="text-2xl" />
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium">
                  Total Transaksi
                </p>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  {summary.total_transaksi}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pemasukan Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-emerald-50">
              <MdAttachMoney className="text-2xl text-emerald-600" />
              <h3 className="font-bold text-emerald-800">Rincian Pemasukan</h3>
            </div>
            {loading ? (
              <div className="p-10 text-center text-slate-500">
                Memuat data...
              </div>
            ) : financialData.pemasukan.length === 0 ? (
              <div className="p-10 text-center text-slate-500 italic">
                Tidak ada data pemasukan
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider sticky top-0">
                    <tr>
                      <th className="px-6 py-3">Tanggal</th>
                      <th className="px-6 py-3 text-center">Transaksi</th>
                      <th className="px-6 py-3 text-right">Pemasukan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {financialData.pemasukan.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          {new Date(item.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 text-center">
                          {item.total_transaksi}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-600 text-right">
                          Rp {parseFloat(item.total_pemasukan).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pengeluaran Table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-red-50">
              <MdTrendingDown className="text-2xl text-red-600" />
              <h3 className="font-bold text-red-800">Rincian Pengeluaran</h3>
            </div>
            {loading ? (
              <div className="p-10 text-center text-slate-500">
                Memuat data...
              </div>
            ) : financialData.pengeluaran.length === 0 ? (
              <div className="p-10 text-center text-slate-500 italic">
                Tidak ada data pengeluaran
              </div>
            ) : (
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider sticky top-0">
                    <tr>
                      <th className="px-6 py-3">Tanggal</th>
                      <th className="px-6 py-3 text-right">Pengeluaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {financialData.pengeluaran.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          {new Date(item.tanggal).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-red-600 text-right">
                          Rp{" "}
                          {parseFloat(item.total_pengeluaran).toLocaleString()}
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

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">
                Tambah Pengeluaran
              </h2>
              <button
                onClick={() => setShowAddExpense(false)}
                className="p-2 rounded-full hover:bg-slate-100"
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
                  placeholder="Contoh: Beli bahan baku"
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

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={expenseForm.tanggal}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, tanggal: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/25 hover:bg-emerald-600 transition-all cursor-pointer"
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

export default Keuangan;
