import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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
    <div className="min-h-screen" style={{backgroundColor: '#5CBFEA'}}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '32px'
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
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
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
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #1f2937, #4b5563)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '-0.025em'
            }}>Penjualan</h1>
            <p style={{fontSize: '16px', color: '#6b7280', margin: '4px 0 0 0'}}>Kelola transaksi penjualan</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 flex gap-6">
        {/* Menu Section */}
        <div className="flex-1">
          {/* Filter Series */}
          <div style={{marginBottom: '40px'}}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#374151',
                marginBottom: '16px'
              }}>Filter Kategori</label>
              <select
                value={selectedSeries}
                onChange={(e) => handleSeriesChange(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  padding: '16px 20px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '500',
                  backgroundColor: 'rgba(255, 255, 255, 0.8)',
                  transition: 'all 0.3s ease',
                  outline: 'none',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="">Semua Series</option>
                {series.map(s => (
                  <option key={s.id_series} value={s.id_series}>
                    {s.nama_series}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Menu Grid */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 250px))', gap: '32px', justifyContent: 'center'}}>
            {menu.map(item => (
              <div 
                key={item.id_menu} 
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                  padding: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  minHeight: '300px'
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
                  height: '200px',
                  width: '100%',
                  background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden'
                }}>
                  {item.gambar ? (
                    <img 
                      src={item.gambar.startsWith('/uploads/') ? `http://localhost:3001${item.gambar}` : item.gambar} 
                      alt={item.nama_menu}
                      style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px'}}
                    />
                  ) : (
                    <span style={{fontSize: '48px', color: '#9ca3af'}}>📷</span>
                  )}
                </div>
                <h3 style={{fontWeight: '700', fontSize: '20px', marginBottom: '12px', color: '#1f2937'}}>{item.nama_menu}</h3>
                <p style={{color: '#2563eb', fontWeight: '700', marginBottom: '24px', fontSize: '18px'}}>
                  Rp {item.harga.toLocaleString()}
                </p>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                    <button
                      onClick={() => removeFromCart(item.id_menu)}
                      disabled={getItemCount(item.id_menu) === 0}
                      style={{
                        background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                        color: 'white',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        border: 'none',
                        cursor: getItemCount(item.id_menu) === 0 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.4)',
                        transition: 'all 0.3s ease',
                        opacity: getItemCount(item.id_menu) === 0 ? 0.5 : 1
                      }}
                      onMouseOver={(e) => {
                        if (getItemCount(item.id_menu) > 0) {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 15px 20px -3px rgba(239, 68, 68, 0.5)';
                        }
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(239, 68, 68, 0.4)';
                      }}
                    >
                      -
                    </button>
                    <span style={{
                      width: '60px',
                      textAlign: 'center',
                      fontWeight: '700',
                      fontSize: '18px',
                      backgroundColor: '#f3f4f6',
                      padding: '12px 8px',
                      borderRadius: '12px',
                      border: '2px solid #e5e7eb'
                    }}>
                      {getItemCount(item.id_menu)}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        background: 'linear-gradient(135deg, #10b981, #047857)',
                        color: 'white',
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        fontWeight: 'bold',
                        boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 15px 20px -3px rgba(16, 185, 129, 0.5)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.4)';
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div style={{
          width: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          height: 'fit-content',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px'}}>
            <span style={{fontSize: '28px'}}></span>
            <h2 style={{fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: 0}}>Keranjang</h2>
          </div>
          
          {cart.length === 0 ? (
            <div style={{textAlign: 'center', padding: '48px 0'}}>
              <div style={{fontSize: '64px', marginBottom: '20px'}}></div>
              <p style={{color: '#6b7280', fontSize: '18px', fontWeight: '500', margin: '0 0 8px 0'}}>Keranjang kosong</p>
              <p style={{fontSize: '14px', color: '#9ca3af', margin: 0}}>Pilih menu untuk memulai</p>
            </div>
          ) : (
            <>
              <div style={{marginBottom: '32px', maxHeight: '300px', overflowY: 'auto'}}>
                {cart.map(item => (
                  <div key={item.id_menu} style={{
                    background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div style={{flex: 1}}>
                        <div style={{fontWeight: '600', color: '#1f2937', fontSize: '16px', marginBottom: '4px'}}>{item.nama_menu}</div>
                        <div style={{fontSize: '14px', color: '#6b7280'}}>
                          {item.jumlah} x Rp {item.harga.toLocaleString()}
                        </div>
                      </div>
                      <div style={{fontWeight: '700', color: '#2563eb', fontSize: '16px'}}>
                        Rp {(item.harga * item.jumlah).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div style={{
                background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                padding: '24px',
                borderRadius: '16px',
                border: '1px solid #93c5fd'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                  <span style={{color: '#374151', fontWeight: '600', fontSize: '16px'}}>Total Item:</span>
                  <span style={{fontWeight: '700', color: '#2563eb', fontSize: '16px'}}>{getTotalItems()}</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
                  <span style={{color: '#374151', fontWeight: '600', fontSize: '16px'}}>Total Harga:</span>
                  <span style={{fontWeight: '800', fontSize: '20px', color: '#2563eb'}}>
                    Rp {getTotalPrice().toLocaleString()}
                  </span>
                </div>
                
                <button
                  onClick={handleCheckout}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    padding: '16px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '700',
                    boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.4)',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 25px 30px -5px rgba(59, 130, 246, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 20px 25px -5px rgba(59, 130, 246, 0.4)';
                  }}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Penjualan;