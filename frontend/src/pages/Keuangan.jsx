import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { MdArrowBack, MdAdd, MdBarChart, MdRefresh, MdAttachMoney, MdTrendingDown, MdTrendingUp, MdShoppingCart, MdCalendarToday, MdDescription, MdClose, MdSave } from "react-icons/md";
import { FiClock } from "react-icons/fi";

function Keuangan() {
  const navigate = useNavigate();
  const [financialData, setFinancialData] = useState({
    pemasukan: [],
    pengeluaran: []
  });
  const [summary, setSummary] = useState({
    total_pemasukan: 0,
    total_pengeluaran: 0,
    keuntungan: 0,
    total_transaksi: 0,
    days: 30
  });
  const [selectedDays, setSelectedDays] = useState(30);
  const [loading, setLoading] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    deskripsi: "",
    jumlah: "",
    tanggal: new Date().toISOString().split('T')[0]
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
          tanggal: new Date().toISOString().split('T')[0]
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
        const res = await api.get(`/api/reports/financial?days=${selectedDays}`);
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
    <div className="min-h-screen" style={{backgroundColor: '#5CBFEA'}}>
      {/* Header */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        padding: '32px'
      }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
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
              }}>Laporan Keuangan</h1>
              <p style={{fontSize: '16px', color: '#6b7280', margin: '4px 0 0 0'}}>Analisis pemasukan dan pengeluaran</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddExpense(true)}
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
            <MdAdd size={16} style={{marginRight: '8px'}} /> Tambah Pengeluaran
          </button>
        </div>
      </div>

      <div className="container mx-auto p-6">
        {/* Period Filter */}
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
            <label style={{fontWeight: '600', fontSize: '16px', color: '#374151'}}><MdBarChart size={16} style={{marginRight: '8px'}} /> Periode Laporan:</label>
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
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
            >
              <option value={7}>7 Hari Terakhir</option>
              <option value={30}>30 Hari Terakhir</option>
              <option value={90}>90 Hari Terakhir</option>
            </select>
            <button
              onClick={fetchFinancialData}
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
              <MdRefresh size={16} style={{marginRight: '8px'}} /> Refresh
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
            <div style={{fontSize: '48px', marginBottom: '16px'}}><MdAttachMoney size={48} /></div>
            <div style={{fontSize: '32px', fontWeight: '800', color: '#059669', marginBottom: '12px'}}>
              Rp {summary.total_pemasukan.toLocaleString()}
            </div>
            <div style={{color: '#374151', fontWeight: '600', fontSize: '16px'}}>Total Pemasukan</div>
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
            <div style={{fontSize: '48px', marginBottom: '16px'}}><MdTrendingDown size={48} /></div>
            <div style={{fontSize: '32px', fontWeight: '800', color: '#dc2626', marginBottom: '12px'}}>
              Rp {summary.total_pengeluaran.toLocaleString()}
            </div>
            <div style={{color: '#374151', fontWeight: '600', fontSize: '16px'}}>Total Pengeluaran</div>
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
            <div style={{fontSize: '48px', marginBottom: '16px'}}>{summary.keuntungan >= 0 ? <MdTrendingUp size={48} /> : <MdTrendingDown size={48} />}</div>
            <div style={{fontSize: '32px', fontWeight: '800', color: summary.keuntungan >= 0 ? '#2563eb' : '#dc2626', marginBottom: '12px'}}>
              Rp {summary.keuntungan.toLocaleString()}
            </div>
            <div style={{color: '#374151', fontWeight: '600', fontSize: '16px'}}>Keuntungan Bersih</div>
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
            <div style={{fontSize: '48px', marginBottom: '16px'}}><MdShoppingCart size={48} /></div>
            <div style={{fontSize: '32px', fontWeight: '800', color: '#7c3aed', marginBottom: '12px'}}>{summary.total_transaksi}</div>
            <div style={{color: '#374151', fontWeight: '600', fontSize: '16px'}}>Total Transaksi</div>
          </div>
        </div>

        {/* Financial Tables */}
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '32px'}}>
          {/* Pemasukan Table */}
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
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <div style={{fontSize: '32px'}}><MdAttachMoney size={32} /></div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#047857',
                  margin: 0
                }}>Pemasukan Harian</h2>
              </div>
            </div>
            {loading ? (
              <div style={{padding: '64px', textAlign: 'center'}}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>⏳</div>
                <div style={{color: '#6b7280', fontSize: '18px', fontWeight: '500'}}>Memuat data...</div>
              </div>
            ) : financialData.pemasukan.length === 0 ? (
              <div style={{padding: '64px', textAlign: 'center'}}>
                <div style={{fontSize: '64px', marginBottom: '20px'}}>💰</div>
                <div style={{color: '#6b7280', fontSize: '18px', fontWeight: '500', marginBottom: '8px'}}>Tidak ada data pemasukan</div>
                <div style={{fontSize: '14px', color: '#9ca3af'}}>untuk periode ini</div>
              </div>
            ) : (
              <div style={{overflowX: 'auto', maxHeight: '400px'}}>
                <table style={{width: '100%'}}>
                  <thead style={{
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    borderBottom: '2px solid #bbf7d0'
                  }}>
                    <tr>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#047857',
                        textTransform: 'uppercase'
                      }}>📅 Tanggal</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#047857',
                        textTransform: 'uppercase'
                      }}>🛒 Transaksi</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#047857',
                        textTransform: 'uppercase'
                      }}>💰 Pemasukan</th>
                    </tr>
                  </thead>
                  <tbody style={{backgroundColor: 'white'}}>
                    {financialData.pemasukan.map((item, index) => (
                      <tr key={index} style={{
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.05)';
                        e.currentTarget.style.transform = 'scale(1.01)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}>
                        <td style={{
                          padding: '16px 20px',
                          fontSize: '14px',
                          color: '#1f2937',
                          fontWeight: '500'
                        }}>
                          {new Date(item.tanggal).toLocaleDateString('id-ID')}
                        </td>
                        <td style={{padding: '16px 20px'}}>
                          <span style={{
                            backgroundColor: '#dbeafe',
                            color: '#1d4ed8',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '700'
                          }}>{item.total_transaksi}</span>
                        </td>
                        <td style={{
                          padding: '16px 20px',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#059669'
                        }}>
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
              background: 'linear-gradient(135deg, #fecaca, #fca5a5)'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <div style={{fontSize: '32px'}}><MdTrendingDown size={32} /></div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#dc2626',
                  margin: 0
                }}>Pengeluaran Harian</h2>
              </div>
            </div>
            {loading ? (
              <div style={{padding: '64px', textAlign: 'center'}}>
                <div style={{fontSize: '48px', marginBottom: '20px'}}>⏳</div>
                <div style={{color: '#6b7280', fontSize: '18px', fontWeight: '500'}}>Memuat data...</div>
              </div>
            ) : financialData.pengeluaran.length === 0 ? (
              <div style={{padding: '64px', textAlign: 'center'}}>
                <div style={{fontSize: '64px', marginBottom: '20px'}}>💸</div>
                <div style={{color: '#6b7280', fontSize: '18px', fontWeight: '500', marginBottom: '8px'}}>Tidak ada data pengeluaran</div>
                <div style={{fontSize: '14px', color: '#9ca3af'}}>untuk periode ini</div>
              </div>
            ) : (
              <div style={{overflowX: 'auto', maxHeight: '400px'}}>
                <table style={{width: '100%'}}>
                  <thead style={{
                    background: 'linear-gradient(135deg, #fef2f2, #fecaca)',
                    borderBottom: '2px solid #fca5a5'
                  }}>
                    <tr>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#dc2626',
                        textTransform: 'uppercase'
                      }}>📅 Tanggal</th>
                      <th style={{
                        padding: '16px 20px',
                        textAlign: 'left',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#dc2626',
                        textTransform: 'uppercase'
                      }}>💸 Pengeluaran</th>
                    </tr>
                  </thead>
                  <tbody style={{backgroundColor: 'white'}}>
                    {financialData.pengeluaran.map((item, index) => (
                      <tr key={index} style={{
                        borderBottom: '1px solid #f3f4f6',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)';
                        e.currentTarget.style.transform = 'scale(1.01)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'white';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}>
                        <td style={{
                          padding: '16px 20px',
                          fontSize: '14px',
                          color: '#1f2937',
                          fontWeight: '500'
                        }}>
                          {new Date(item.tanggal).toLocaleDateString('id-ID')}
                        </td>
                        <td style={{
                          padding: '16px 20px',
                          fontSize: '14px',
                          fontWeight: '700',
                          color: '#dc2626'
                        }}>
                          Rp {parseFloat(item.total_pengeluaran).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 50
        }}>
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '32px',
            width: '100%',
            maxWidth: '500px',
            margin: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px'}}>
              <div style={{fontSize: '32px'}}><MdTrendingDown size={32} /></div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #1f2937, #4b5563)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0
              }}>Tambah Pengeluaran</h2>
            </div>
            
            <form onSubmit={handleAddExpense} style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}><MdDescription size={16} style={{marginRight: '8px'}} /> Deskripsi</label>
                <input
                  type="text"
                  value={expenseForm.deskripsi}
                  onChange={(e) => setExpenseForm({...expenseForm, deskripsi: e.target.value})}
                  style={{
                    width: '100%',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  placeholder="Contoh: Beli bahan baku"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}><MdAttachMoney size={16} style={{marginRight: '8px'}} /> Jumlah (Rp)</label>
                <input
                  type="number"
                  value={expenseForm.jumlah}
                  onChange={(e) => setExpenseForm({...expenseForm, jumlah: e.target.value})}
                  style={{
                    width: '100%',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    fontSize: '16px',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  placeholder="0"
                  min="0"
                  onFocus={(e) => {
                    e.target.style.borderColor = '#3b82f6';
                    e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#374151',
                  marginBottom: '8px'
                }}><MdCalendarToday size={16} style={{marginRight: '8px'}} /> Tanggal</label>
                <input
                  type="date"
                  value={expenseForm.tanggal}
                  onChange={(e) => setExpenseForm({...expenseForm, tanggal: e.target.value})}
                  style={{
                    width: '100%',
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
                  required
                />
              </div>

              <div style={{display: 'flex', gap: '16px', paddingTop: '16px'}}>
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: '0 10px 15px -3px rgba(107, 114, 128, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 15px 20px -3px rgba(107, 114, 128, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(107, 114, 128, 0.4)';
                  }}
                >
                  <MdClose size={16} style={{marginRight: '8px'}} /> Batal
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: 'linear-gradient(135deg, #10b981, #047857)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    e.target.style.boxShadow = '0 15px 20px -3px rgba(16, 185, 129, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.4)';
                  }}
                >
                  <MdSave size={16} style={{marginRight: '8px'}} /> Simpan
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