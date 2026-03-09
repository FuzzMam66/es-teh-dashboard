import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar.jsx";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdImageNotSupported,
  MdClose,
  MdSave,
  MdUploadFile,
} from "react-icons/md";

function KelolaMenu() {
  const [menu, setMenu] = useState([]);
  const [series, setSeries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSeries, setSelectedSeries] = useState("");
  const [editingMenu, setEditingMenu] = useState(null);
  const [menuToDelete, setMenuToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nama_menu: "",
    id_series: "",
    harga: "",
    gambar: "",
    imageFile: null,
  });

  const fetchMenu = async () => {
    try {
      const res = await api.get("/api/menu");
      if (res.data.status === "success") setMenu(res.data.data);
    } catch (err) {
      console.error("Error fetching menu:", err);
    }
  };

  const fetchSeries = async () => {
    try {
      const res = await api.get("/api/series");
      if (res.data.status === "success") setSeries(res.data.data);
    } catch (err) {
      console.error("Error fetching series:", err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMenu();
    fetchSeries();
  }, []);

  const openAddModal = () => {
    setEditingMenu(null);
    setFormData({
      nama_menu: "",
      id_series: "",
      harga: "",
      gambar: "",
      imageFile: null,
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMenu(null);
  };

  const handleEdit = (item) => {
    setEditingMenu(item);
    setFormData({
      nama_menu: item.nama_menu,
      id_series: item.id_series,
      harga: item.harga,
      gambar: item.gambar,
      imageFile: null,
    });
    setShowModal(true);
  };

  const handleDelete = (item) => {
    setMenuToDelete(item);
  };

  const confirmDelete = async () => {
    if (!menuToDelete) return;
    try {
      await api.delete(`/api/menu/${menuToDelete.id_menu}`);
      fetchMenu();
    } catch (error) {
      console.error("Error deleting menu:", error);
      alert("Gagal menghapus menu");
    } finally {
      setMenuToDelete(null);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        gambar: URL.createObjectURL(file),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("nama_menu", formData.nama_menu);
      data.append("id_series", formData.id_series);
      data.append("harga", formData.harga);
      if (formData.imageFile) {
        data.append("gambar", formData.imageFile);
      }

      if (editingMenu) {
        await api.put(`/api/menu/${editingMenu.id_menu}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/api/menu", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      closeModal();
      fetchMenu();
    } catch (err) {
      alert(
        "Gagal menyimpan menu: " + (err.response?.data?.error || err.message),
      );
    }
  };

  const getSeriesName = (id) => {
    const s = series.find((s) => s.id_series == id);
    return s ? s.nama_series : "-";
  };

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("blob:") || path.startsWith("http")) return path;
    // Jika dev mode (beda port), pakai localhost:3001. Jika prod (sama port), relative path.
    const baseUrl =
      window.location.hostname === "localhost" &&
      window.location.port !== "3001"
        ? "http://localhost:3001"
        : "";
    return `${baseUrl}${path}`;
  };

  return (
    <div className="bg-[#f6f7f8] min-h-screen font-sans">
      <Navbar />

      <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Kelola Menu
            </h1>
            <p className="text-slate-500 mt-1">
              Atur daftar menu, harga, dan kategori produk Anda.
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={selectedSeries}
              onChange={(e) => setSelectedSeries(e.target.value)}
              className="bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
            >
              <option value="">Semua Kategori</option>
              {series.map((s) => (
                <option key={s.id_series} value={s.id_series}>
                  {s.nama_series}
                </option>
              ))}
            </select>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-[#136dec] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 hover:opacity-90 transition-all cursor-pointer"
            >
              <MdAdd className="text-lg" />
              <span>Tambah Menu</span>
            </button>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {menu
            .filter(
              (item) => !selectedSeries || item.id_series == selectedSeries,
            )
            .map((item) => (
              <div
                key={item.id_menu}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col group"
              >
                <div className="h-48 w-full bg-slate-100 flex items-center justify-center text-slate-300 relative">
                  {item.gambar ? (
                    <img
                      src={getImageUrl(item.gambar)}
                      alt={item.nama_menu}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <MdImageNotSupported size={48} />
                  )}
                  <div className="absolute top-2 right-2 bg-blue-100 text-[#136dec] text-xs font-bold px-2 py-1 rounded-full">
                    {item.nama_series || getSeriesName(item.id_series)}
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-bold text-slate-800 text-base mb-1 flex-grow">
                    {item.nama_menu}
                  </h3>
                  <p className="text-[#136dec] font-black text-lg mb-4">
                    Rp {item.harga.toLocaleString()}
                  </p>
                  <div className="flex gap-2 mt-auto">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <MdEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 hover:text-red-600 transition-colors"
                    >
                      <MdDelete /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {menuToDelete && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-md">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">
                Konfirmasi Hapus
              </h2>
            </div>
            <div className="p-6">
              <p className="text-slate-600">
                Apakah Anda yakin ingin menghapus menu{" "}
                <span className="font-bold">"{menuToDelete.nama_menu}"</span>?
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMenuToDelete(null)}
                className="cursor-pointer bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-red-500/25 hover:bg-red-700 transition-all cursor-pointer"
              >
                <MdDelete /> Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">
                {editingMenu ? "Edit Menu" : "Tambah Menu"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 rounded-full hover:bg-slate-100"
              >
                <MdClose className="text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Nama Menu
                </label>
                <input
                  type="text"
                  value={formData.nama_menu}
                  onChange={(e) =>
                    setFormData({ ...formData, nama_menu: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Series
                  </label>
                  <select
                    value={formData.id_series}
                    onChange={(e) =>
                      setFormData({ ...formData, id_series: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none"
                    required
                  >
                    <option value="">Pilih Series</option>
                    {series.map((s) => (
                      <option key={s.id_series} value={s.id_series}>
                        {s.nama_series}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Harga
                  </label>
                  <input
                    type="number"
                    value={formData.harga}
                    onChange={(e) =>
                      setFormData({ ...formData, harga: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Gambar
                </label>
                <div className="flex items-center gap-4">
                  {formData.gambar && (
                    <img
                      src={getImageUrl(formData.gambar)}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-xl border-2 border-slate-200"
                    />
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center p-4 text-center border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50">
                    <MdUploadFile className="text-3xl text-slate-400" />
                    <span className="text-sm text-slate-500 font-semibold mt-1">
                      Klik untuk upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="cursor-pointer bg-white border border-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-[#136dec] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/25 hover:opacity-90 transition-all cursor-pointer"
                >
                  <MdSave />
                  {editingMenu ? "Update Menu" : "Simpan Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default KelolaMenu;
