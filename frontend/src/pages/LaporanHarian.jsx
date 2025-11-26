import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { MdArrowBack, MdCalendarToday, MdBarChart, MdShoppingCart, MdAttachMoney, MdAssignment } from "react-icons/md";
import { FiPackage } from "react-icons/fi";

function LaporanHarian() {
  const navigate = useNavigate();
  const [laporan, setLaporan] = useState([]);
  const [selectedDate, setSelectedDate] = useState('2025-11-20'); // Data exists in 2025
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLaporan();
  }, [selectedDate]);

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const url = selectedDate ? `/api/reports/daily?date=${selectedDate}` : "/api/reports/daily";
      const res = await api.get(url);
      if (res.data.status === "success") {
        setLaporan(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching laporan:", err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalPendapatan = () => {
    return laporan.reduce((total, item) => total + parseFloat(item.total_pendapatan || 0), 0);
  };

  const getTotalItem = () => {
    return laporan.reduce((total, item) => total + parseInt(item.total_jumlah || 0), 0);
  };

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
            <MdArrowBack size={16} style={{marginRight: '8px'}} /> Kembali
          </button>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #1f2937, #4b5563)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>Laporan Penjualan Harian</h1>
            <p style={{fontSize: '16px', color: '#6b7280', margin: '4px 0 0 0'}}>Analisis penjualan per hari</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Date Filter */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap'}}>
            <label style={{fontWeight: '600', fontSize: '16px', color: '#374151'}}>Pilih Tanggal:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                border: '2px solid #e5e7eb',
                borderRadius: '12px',
                padding: '12px 16px',
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
            <button
              onClick={() => setSelectedDate('2025-11-20')}
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
              <MdCalendarToday size={16} style={{marginRight: '8px'}} /> Data Tersedia
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '48px'}}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}><MdBarChart size={48} /></div>
            <div style={{fontSize: '36px', fontWeight: '800', color: '#2563eb', marginBottom: '12px'}}>{laporan.length}</div>
            <div style={{color: '#374151', fontWeight: '600', fontSize: '16px'}}>Jenis Menu Terjual</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}><FiPackage size={48} /></div>
            <div style={{fontSize: '36px', fontWeight: '800', color: '#059669', marginBottom: '12px'}}>{getTotalItem()}</div>
            <div style={{color: '#374151', fontWeight: '600', fontSize: '16px'}}>Total Item Terjual</div>
          </div>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            transition: 'all 0.3s ease',
            transform: 'translateY(0)'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
          }}>
            <div style={{fontSize: '48px', marginBottom: '16px'}}><MdAttachMoney size={48} /></div>
            <div style={{fontSize: '36px', fontWeight: '800', color: '#7c3aed', marginBottom: '12px'}}>
              Rp {getTotalPendapatan().toLocaleString()}
            </div>
            <div style={{color: '#374151', fontWeight: '600', fontSize: '16px'}}>Total Pendapatan</div>
          </div>
        </div>

        {/* Report Table */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{
            padding: '32px',
            borderBottom: '1px solid #e5e7eb',
            background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              <div style={{fontSize: '32px'}}><MdAssignment size={32} /></div>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  background: 'linear-gradient(135deg, #1f2937, #4b5563)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: 0
                }}>Detail Penjualan</h2>
                <p style={{
                  fontSize: '16px',
                  color: '#6b7280',
                  margin: '4px 0 0 0',
                  fontWeight: '500'
                }}>
                  {new Date(selectedDate).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div style={{padding: '64px', textAlign: 'center'}}>
              <div style={{fontSize: '48px', marginBottom: '20px'}}><MdBarChart size={48} /></div>
              <div style={{color: '#6b7280', fontSize: '18px', fontWeight: '500'}}>Memuat data...</div>
            </div>
          ) : laporan.length === 0 ? (
            <div style={{padding: '64px', textAlign: 'center'}}>
              <div style={{fontSize: '64px', marginBottom: '20px'}}><MdBarChart size={64} /></div>
              <div style={{color: '#6b7280', fontSize: '18px', fontWeight: '500', marginBottom: '8px'}}>Tidak ada data penjualan</div>
              <div style={{fontSize: '14px', color: '#9ca3af'}}>untuk tanggal ini</div>
            </div>
          ) : (
            <div style={{overflowX: 'auto'}}>
              <table style={{width: '100%'}}>
                <thead style={{
                  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                  borderBottom: '2px solid #e5e7eb'
                }}>
                  <tr>
                    <th style={{
                      padding: '20px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>No</th>
                    <th style={{
                      padding: '20px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Nama Menu</th>
                    <th style={{
                      padding: '20px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Jumlah Terjual</th>
                    <th style={{
                      padding: '20px 24px',
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: '700',
                      color: '#374151',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>Total Pendapatan</th>
                  </tr>
                </thead>
                <tbody style={{backgroundColor: 'white'}}>
                  {laporan.map((item, index) => (
                    <tr key={index} style={{
                      borderBottom: '1px solid #f3f4f6',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                      e.currentTarget.style.transform = 'scale(1.01)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = 'white';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}>
                      <td style={{
                        padding: '20px 24px',
                        fontSize: '16px',
                        color: '#1f2937',
                        fontWeight: '600'
                      }}>{index + 1}</td>
                      <td style={{padding: '20px 24px'}}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#1f2937'
                        }}>{item.nama_menu}</div>
                      </td>
                      <td style={{padding: '20px 24px'}}>
                        <div style={{
                          fontSize: '16px',
                          color: '#059669',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <span style={{
                            backgroundColor: '#d1fae5',
                            color: '#047857',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '14px',
                            fontWeight: '700'
                          }}>{item.total_jumlah}</span>
                        </div>
                      </td>
                      <td style={{padding: '20px 24px'}}>
                        <div style={{
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#2563eb',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          Rp {parseFloat(item.total_pendapatan).toLocaleString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot style={{
                  background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                  borderTop: '2px solid #93c5fd'
                }}>
                  <tr>
                    <td colSpan="2" style={{
                      padding: '24px',
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#1f2937'
                    }}>TOTAL</td>
                    <td style={{
                      padding: '24px',
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#047857'
                    }}>
                      <span style={{
                        backgroundColor: '#10b981',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '20px'
                      }}>{getTotalItem()}</span>
                    </td>
                    <td style={{
                      padding: '24px',
                      fontSize: '18px',
                      fontWeight: '800',
                      color: '#2563eb'
                    }}>Rp {getTotalPendapatan().toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LaporanHarian;