import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar.jsx";
import { MdLocalCafe, MdShoppingCart, MdAdd, MdRemove, MdArrowBack, MdImageNotSupported, MdShoppingBag } from "react-icons/md";

function Penjualan() {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [menu, setMenu] = useState([]);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [cart, setCart] = useState([]);

  const fetchMenu = async (seriesId = "") => {
    try {
      const url = seriesId ? `/api/menu?series=${seriesId}` : "/api/menu";
      const res = await api.get(url);
      if (res.data.status === "success") {
        setMenu(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [seriesRes, menuRes] = await Promise.all([
          api.get("/api/series"),
          api.get("/api/menu")
        ]);
        
        if (seriesRes.data.status === "success") {
          setSeries(seriesRes.data.data);
        }
        
        if (menuRes.data.status === "success") {
          setMenu(menuRes.data.data);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    
    loadData();
  }, []);

  const handleSeriesChange = (seriesId) => {
    setSelectedSeries(seriesId);
    fetchMenu(seriesId);
  };

  const addToCart = (menuItem) => {
    const existingItem = cart.find(item => item.id_menu === menuItem.id_menu);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id_menu === menuItem.id_menu
          ? { ...item, jumlah: item.jumlah + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...menuItem, jumlah: 1 }]);
    }
  };

  const removeFromCart = (menuId) => {
    const existingItem = cart.find(item => item.id_menu === menuId);
    if (existingItem && existingItem.jumlah > 1) {
      setCart(cart.map(item =>
        item.id_menu === menuId
          ? { ...item, jumlah: item.jumlah - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id_menu !== menuId));
    }
  };

  const getItemCount = (menuId) => {
    const item = cart.find(item => item.id_menu === menuId);
    return item ? item.jumlah : 0;
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.jumlah, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.harga * item.jumlah), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong!");
      return;
    }
    // Navigate to checkout with cart data
    navigate("/checkout", { state: { cart } });
  };

  return (
    <div className="bg-[#f6f7f8] min-h-screen font-sans">
      <Navbar />

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Menu Section */}
        <div className="flex-1 space-y-8">
          {/* Filter Series */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <label className="block text-sm font-bold text-slate-700 mb-2">Filter Kategori</label>
            <select
              value={selectedSeries}
              onChange={(e) => handleSeriesChange(e.target.value)}
              className="w-full max-w-xs bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none"
            >
              <option value="">Semua Series</option>
              {series.map(s => (
                <option key={s.id_series} value={s.id_series}>
                  {s.nama_series}
                </option>
              ))}
            </select>
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menu.map(item => (
              <div key={item.id_menu} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col transition-all hover:-translate-y-0.5 hover:shadow-lg">
                <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-300">
                  {item.gambar ? (
                    <img
                      src={item.gambar.startsWith('/uploads/') ? `http://localhost:3001${item.gambar}` : item.gambar}
                      alt={item.nama_menu}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MdImageNotSupported size={48} />
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 text-lg mb-1 flex-grow">{item.nama_menu}</h3>
                  <p className="text-[#136dec] font-black text-xl mb-4">
                    Rp {item.harga.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => removeFromCart(item.id_menu)}
                      disabled={getItemCount(item.id_menu) === 0}
                      className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-lg font-bold text-lg hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <MdRemove />
                    </button>
                    <span className="flex-1 text-center font-bold text-slate-800 text-lg">
                      {getItemCount(item.id_menu)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="w-10 h-10 flex items-center justify-center bg-slate-100 text-slate-600 rounded-lg font-bold text-lg hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <MdAdd />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="w-full lg:w-96">
          <div className="sticky top-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <MdShoppingCart className="text-2xl text-[#136dec]" />
              <h2 className="text-xl font-bold text-slate-900">Keranjang</h2>
            </div>

            {cart.length === 0 ? (
              <div className="text-center p-10">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdShoppingBag className="text-4xl text-slate-400" />
                </div>
                <p className="text-slate-600 font-semibold">Keranjang kosong</p>
                <p className="text-slate-400 text-sm">Pilih menu untuk memulai transaksi</p>
              </div>
            ) : (
              <>
                <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
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

                <div className="p-6 bg-slate-50/50 border-t border-slate-100 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium text-sm">Total Item:</span>
                    <span className="font-bold text-slate-800 text-sm">{getTotalItems()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium text-sm">Total Harga:</span>
                    <span className="font-black text-xl text-[#136dec]">
                      Rp {getTotalPrice().toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full bg-[#136dec] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Penjualan;