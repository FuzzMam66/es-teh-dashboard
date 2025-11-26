import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function KelolaMenu() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [series, setSeries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [formData, setFormData] = useState({
    nama_menu: "",
    id_series: "",
    harga: "",
    gambar: "",
    imageFile: null
  });

  const fetchMenu = async () => {
    try {
      const res = await api.get("/api/menu");
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
        const [menuRes, seriesRes] = await Promise.all([
          api.get("/api/menu"),
          api.get("/api/series")
        ]);
        
        if (menuRes.data.status === "success") {
          setMenu(menuRes.data.data);
        }
        
        if (seriesRes.data.status === "success") {
          setSeries(seriesRes.data.data);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };
    
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append('nama_menu', formData.nama_menu);
      submitData.append('id_series', formData.id_series);
      submitData.append('harga', formData.harga);
      
      if (formData.imageFile) {
        submitData.append('gambar', formData.imageFile);
      } else if (formData.gambar && !editingMenu) {
        // For base64 images (fallback)
        submitData.append('gambar', formData.gambar);
      }
      
      if (editingMenu) {
        // Update menu
        const res = await api.put(`/api/menu/${editingMenu.id_menu}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.status === "success") {
          alert("Menu berhasil diupdate!");
          fetchMenu();
          closeModal();
        }
      } else {
        // Add new menu
        const res = await api.post("/api/menu", submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data.status === "success") {
          alert("Menu berhasil ditambahkan!");
          fetchMenu();
          closeModal();
        }
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  const handleEdit = (menuItem) => {
    setEditingMenu(menuItem);
    setFormData({
      nama_menu: menuItem.nama_menu,
      id_series: menuItem.id_series,
      harga: menuItem.harga,
      gambar: menuItem.gambar || "",
      imageFile: null
    });
    setShowModal(true);
  };

  const handleDelete = async (menuId, namaMenu) => {
    if (confirm(`Hapus menu "${namaMenu}"?`)) {
      try {
        const res = await api.delete(`/api/menu/${menuId}`);
        if (res.data.status === "success") {
          alert("Menu berhasil dihapus!");
          fetchMenu();
        }
      } catch (err) {
        alert("Error: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const openAddModal = () => {
    setEditingMenu(null);
    setFormData({
      nama_menu: "",
      id_series: "",
      harga: "",
      gambar: "",
      imageFile: null
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMenu(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ 
          ...prev, 
          imageFile: file,
          gambar: event.target.result 
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen" style={{backgroundColor: '#5CBFEA'}}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        padding: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <button
            onClick={() => navigate("/dashboard")}
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 15px 20px -3px rgba(59, 130, 246, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.4)';
            }}
          >
            ← Kembali
          </button>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #1f2937, #4b5563)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0
          }}>Kelola Menu</h1>
        </div>
        <button
          onClick={openAddModal}
          style={{
            background: 'linear-gradient(135deg, #10b981, #047857)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = 'translateY(-2px) scale(1.05)';
            e.target.style.boxShadow = '0 15px 20px -3px rgba(16, 185, 129, 0.5)';
          }}
          onMouseOut={(e) => {
            e.target.style.transform = 'translateY(0) scale(1)';
            e.target.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.4)';
          }}
        >
          + Tambah Menu
        </button>
      </div>

      {/* Menu Grid */}
      <div style={{maxWidth: '1400px', margin: '0 auto', padding: '32px'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 250px))', gap: '32px', justifyContent: 'center'}}>
          {menu.map(item => (
            <div 
              key={item.id_menu} 
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)',
                minHeight: '350px'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                height: '220px',
                width: '100%',
                background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {item.gambar ? (
                  <img 
                    src={item.gambar.startsWith('/uploads/') ? `http://localhost:3001${item.gambar}` : item.gambar} 
                    alt={item.nama_menu}
                    style={{width: '100%', height: '100%', objectFit: 'cover'}}
                  />
                ) : (
                  <span style={{color: '#9ca3af', fontSize: '48px'}}>📷</span>
                )}
              </div>
              <div style={{padding: '16px'}}>
                <h3 style={{fontWeight: '700', fontSize: '20px', marginBottom: '8px', color: '#1f2937'}}>{item.nama_menu}</h3>
                <p style={{fontSize: '14px', color: '#6b7280', marginBottom: '12px'}}>{item.nama_series}</p>
                <p style={{
                  color: '#2563eb',
                  fontWeight: '700',
                  marginBottom: '20px',
                  fontSize: '18px'
                }}>
                  Rp {item.harga.toLocaleString()}
                </p>
                <div style={{display: 'flex', gap: '12px'}}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 8px 12px -1px rgba(59, 130, 246, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.4)';
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item.id_menu, item.nama_menu)}
                    style={{
                      flex: 1,
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 8px 12px -1px rgba(239, 68, 68, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(239, 68, 68, 0.4)';
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          margin: '30px',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '20px',
        }}>
          <div style={{display:'block', gap: '20px'}}>
            <h2 className="text-3xl font-bold mb-4 px-10">
              {editingMenu ? "Edit Menu" : "Tambah Menu"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div style={{marginBottom:'15px', display:'flex', gap:'12px', alignItems:'center'}}>
                <label style={{display: 'block', fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Nama Menu</label>
                <input
                  type="text"
                  value={formData.nama_menu}
                  onChange={(e) => setFormData({...formData, nama_menu: e.target.value})}
                  style={{
                    padding: '16px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{marginBottom:'15px', display:'flex', gap:'12px', alignItems:'center'}}>
                <label style={{display: 'block', fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Series</label>
                <select
                  value={formData.id_series}
                  onChange={(e) => setFormData({...formData, id_series: e.target.value})}
                  style={{
                    padding: '16px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  required
                >
                  <option value="">Pilih Series</option>
                  {series.map(s => (
                    <option key={s.id_series} value={s.id_series}>
                      {s.nama_series}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{marginBottom:'15px', display:'flex', gap:'12px', alignItems:'center'}}>
                <label style={{display: 'block', fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Harga</label>
                <input
                  type="number"
                  value={formData.harga}
                  onChange={(e) => setFormData({...formData, harga: e.target.value})}
                  style={{
                    padding: '16px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{marginBottom:'15px', display:'flex', gap:'12px', alignItems:'center'}}>
                <label style={{display: 'block', fontSize: '16px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Gambar</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{
                    padding: '16px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                />
                {formData.gambar && (
                  <div style={{marginTop: '8px'}}>
                    <img 
                      src={formData.gambar} 
                      alt="Preview" 
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #e5e7eb'
                      }}
                    />
                  </div>
                )}
              </div>

              <div style={{marginTop:'15px', display:'flex', gap:'10px'}}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      padding: '12px 64px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 8px 12px -1px rgba(239, 68, 68, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(239, 68, 68, 0.4)';
                    }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  style={{
                      background: 'linear-gradient(135deg, #10b981, #047857)',
                      color: 'white',
                      padding: '12px 64px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.4)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 8px 12px -1px rgba(239, 68, 68, 0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 6px -1px rgba(239, 68, 68, 0.4)';
                    }}
                >
                  {editingMenu ? "Update" : "Simpan"}
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