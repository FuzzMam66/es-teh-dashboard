import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  MdLocalCafe,
  MdSearch,
  MdLogout,
  MdCalendarToday,
  MdAdd,
  MdReceiptLong,
  MdTrendingUp,
  MdPayments,
  MdShoppingBasket,
  MdTrendingDown,
  MdPointOfSale,
  MdRestaurantMenu,
  MdBarChart,
  MdAccountBalanceWallet,
  MdIcecream,
  MdCookie,
  MdInventory,
  MdEdit,
} from "react-icons/md";
import Navbar from "../components/Navbar.jsx";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_transaksi: 0,
    total_pendapatan: 0,
    total_item: 0,
  });
  const [topProducts, setTopProducts] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/dashboard/stats");
      if (res.data.status === "success") {
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const fetchTopProducts = async () => {
    try {
      const res = await api.get("/api/dashboard/top-products");
      if (res.data.status === "success") {
        setTopProducts(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching top products:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats();
    fetchTopProducts();
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="bg-[#f6f7f8] text-slate-900 min-h-screen font-sans">
      <Navbar />

      {/* Main Content Area */}
      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
              Dashboard Kasir Es Teh
            </h1>
            <p className="text-slate-500 text-lg">
              Selamat datang kembali! Berikut adalah performa bisnis Anda hari
              ini.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all">
              <MdCalendarToday className="text-lg" />
              <span>
                {new Date().toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </button>
            <button
              onClick={() => navigate("/penjualan")}
              className="flex items-center gap-2 bg-[#136dec] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 hover:opacity-90 transition-all cursor-pointer"
            >
              <MdAdd className="text-lg" />
              <span>Transaksi Baru</span>
            </button>
          </div>
        </div>

        {/* Stats Section (Ringkasan Hari Ini) */}
        <section className="mb-12">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 px-1">
            Ringkasan Hari Ini
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stat Card 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <MdReceiptLong className="text-2xl" />
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">
                  Total Transaksi
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900">
                  {stats.total_transaksi}
                </h3>
              </div>
              <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500"></div>
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <MdPayments className="text-2xl" />
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">
                  Total Pendapatan
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900">
                  {formatRupiah(stats.total_pendapatan)}
                </h3>
              </div>
              <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500"></div>
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                  <MdShoppingBasket className="text-2xl" />
                </div>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">
                  Total Item Terjual
                </p>
                <h3 className="text-3xl font-extrabold text-slate-900">
                  {stats.total_item}
                </h3>
              </div>
              <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Secondary Row: Top Selling & Recent Activities */}
        <section className="mt-12 grid grid-cols-1 gap-8">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Produk Terlaris</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Nama Produk</th>
                    <th className="px-6 py-3">Kategori</th>
                    <th className="px-6 py-3 text-center">Terjual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {topProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="px-6 py-8 text-center text-slate-500 italic"
                      >
                        Belum ada menu
                      </td>
                    </tr>
                  ) : (
                    topProducts.map((product, index) => (
                      <tr
                        key={index}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 flex items-center gap-3">
                          <span className="font-semibold text-slate-800">
                            {product.nama_menu}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {product.nama_series || "-"}
                        </td>
                        <td className="px-6 py-4 text-center font-bold">
                          {product.total_terjual}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Meta */}
      <footer className="py-10 border-t border-slate-100 text-center">
        <p className="text-slate-400 text-xs font-medium">
          © 2026 Es Teh Kasir. Dashboard Enterprise Edition.
        </p>
      </footer>
    </div>
  );
}

export default Dashboard;
