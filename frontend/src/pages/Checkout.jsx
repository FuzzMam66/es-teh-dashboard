import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

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
      <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#5CBFEA'}}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Keranjang Kosong</h2>
          <button
            onClick={() => navigate("/penjualan")}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Kembali ke Penjualan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{backgroundColor: '#5CBFEA'}}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        padding: '32px'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <button
            onClick={() => navigate("/penjualan")}
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
          }}>Checkout</h1>
        </div>
      </div>

      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '32px'}}>
          {/* Order Summary */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #1f2937, #4b5563)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Rincian Pesanan</h2>
            
            <div style={{marginBottom: '24px'}}>
              {cart.map(item => (
                <div key={item.id_menu} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #e5e7eb',
                  paddingBottom: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{fontWeight: '600', color: '#1f2937', fontSize: '16px'}}>{item.nama_menu}</div>
                    <div style={{fontSize: '14px', color: '#6b7280', marginTop: '4px'}}>
                      {item.jumlah} x Rp {item.harga.toLocaleString()}
                    </div>
                  </div>
                  <div style={{fontWeight: '700', color: '#2563eb', fontSize: '16px'}}>
                    Rp {(item.harga * item.jumlah).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            
            <div style={{
              borderTop: '2px solid #e5e7eb',
              paddingTop: '20px',
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #93c5fd'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '20px',
                fontWeight: '800'
              }}>
                <span style={{color: '#374151'}}>Total:</span>
                <span style={{color: '#2563eb'}}>Rp {getTotalHarga().toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, #1f2937, #4b5563)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Metode Pembayaran</h2>
            
            <div style={{marginBottom: '32px'}}>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                marginBottom: '16px',
                borderRadius: '12px',
                border: metodePembayaran === "Tunai" ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                backgroundColor: metodePembayaran === "Tunai" ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <input
                  type="radio"
                  name="payment"
                  value="Tunai"
                  checked={metodePembayaran === "Tunai"}
                  onChange={(e) => setMetodePembayaran(e.target.value)}
                  style={{marginRight: '12px', transform: 'scale(1.2)'}}
                />
                <span style={{fontSize: '18px', fontWeight: '600'}}>Tunai</span>
              </label>
              
              <label style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px 20px',
                borderRadius: '12px',
                border: metodePembayaran === "QRIS" ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                backgroundColor: metodePembayaran === "QRIS" ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.5)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}>
                <input
                  type="radio"
                  name="payment"
                  value="QRIS"
                  checked={metodePembayaran === "QRIS"}
                  onChange={(e) => setMetodePembayaran(e.target.value)}
                  style={{marginRight: '12px', transform: 'scale(1.2)'}}
                />
                <span style={{fontSize: '18px', fontWeight: '600'}}>QRIS</span>
              </label>
            </div>

            {metodePembayaran === "Tunai" && (
              <div style={{marginBottom: '32px'}}>
                <label style={{
                  display: 'block',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '12px'
                }}>
                  Nominal Pembayaran
                </label>
                <input
                  type="number"
                  value={nominalBayar}
                  onChange={(e) => setNominalBayar(e.target.value)}
                  placeholder="Masukkan nominal pembayaran"
                  min={getTotalHarga()}
                  style={{
                    width: '100%',
                    padding: '16px 20px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                {nominalBayar && parseFloat(nominalBayar) >= getTotalHarga() && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px 16px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid #6ee7b7',
                    borderRadius: '8px',
                    color: '#059669',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    Kembalian: Rp {getKembalian().toLocaleString()}
                  </div>
                )}
              </div>
            )}

            <div style={{display: 'flex', gap: '16px'}}>
              <button
                onClick={handleCancel}
                disabled={loading}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                  color: 'white',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                  boxShadow: '0 10px 15px -3px rgba(107, 114, 128, 0.4)',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 15px 20px -3px rgba(107, 114, 128, 0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(107, 114, 128, 0.4)';
                }}
              >
                Batal
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading || (metodePembayaran === "Tunai" && (!nominalBayar || parseFloat(nominalBayar) < getTotalHarga()))}
                style={{
                  flex: 1,
                  background: 'linear-gradient(135deg, #10b981, #047857)',
                  color: 'white',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  border: 'none',
                  cursor: (loading || (metodePembayaran === "Tunai" && (!nominalBayar || parseFloat(nominalBayar) < getTotalHarga()))) ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '700',
                  boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
                  transition: 'all 0.3s ease',
                  opacity: (loading || (metodePembayaran === "Tunai" && (!nominalBayar || parseFloat(nominalBayar) < getTotalHarga()))) ? 0.6 : 1
                }}
                onMouseOver={(e) => {
                  if (!(loading || (metodePembayaran === "Tunai" && (!nominalBayar || parseFloat(nominalBayar) < getTotalHarga())))) {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 15px 20px -3px rgba(16, 185, 129, 0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.4)';
                }}
              >
                {loading ? "Memproses..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;