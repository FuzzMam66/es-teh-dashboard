import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { MdShoppingCart, MdRestaurantMenu, MdBarChart, MdAttachMoney, MdLogout, MdRefresh, MdArrowForward } from "react-icons/md";

function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_transaksi: 0,
    total_pendapatan: 0,
    total_item: 0
  });

  const fetchStats = async () => {
    try {
      console.log("Fetching dashboard stats...");
      const res = await api.get("/api/dashboard/stats");
      console.log("Dashboard stats response:", res.data);
      if (res.data.status === "success") {
        console.log("Setting stats:", res.data.data);
        setStats(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get("/api/dashboard/stats");
        if (res.data.status === "success") {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    loadStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const menuItems = [
    {
      title: "Penjualan",
      description: "Kelola transaksi penjualan",
      icon: <MdShoppingCart size={48} />,
      path: "/penjualan",
      color: "bg-blue-500"
    },
    {
      title: "Kelola Menu",
      description: "Tambah dan edit menu",
      icon: <MdRestaurantMenu size={48} />,
      path: "/kelola-menu",
      color: "bg-green-500"
    },
    {
      title: "Laporan Harian",
      description: "Lihat laporan penjualan harian",
      icon: <MdBarChart size={48} />,
      path: "/laporan-harian",
      color: "bg-purple-500"
    },
    {
      title: "Keuangan",
      description: "Kelola keuangan dan pengeluaran",
      icon: <MdAttachMoney size={48} />,
      path: "/keuangan",
      color: "bg-yellow-500"
    }
  ];

  return (
    <div className="min-h-screen" style={{backgroundColor: '#5CBFEA'}}>
      {/* Header */}
      <div style={{backgroundColor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.2)', padding: '32px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{fontSize: '40px', filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'}}></div>
            <div>
              <h1 style={{fontSize: '28px', fontWeight: '700', background: 'linear-gradient(135deg, #1f2937, #4b5563)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0, letterSpacing: '-0.025em'}}>Dashboard Kasir Es Teh</h1>
              <p style={{fontSize: '16px', color: '#6b7280', margin: '8px 0 0 0', fontWeight: '400'}}>Kelola bisnis es teh Anda dengan mudah</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              padding: '12px 32px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '14px',
              boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.4), 0 10px 10px -5px rgba(239, 68, 68, 0.2)',
              transition: 'all 0.3s ease',
              transform: 'translateY(0)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px) scale(1.05)';
              e.target.style.boxShadow = '0 25px 30px -5px rgba(239, 68, 68, 0.5), 0 15px 15px -5px rgba(239, 68, 68, 0.3)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 20px 25px -5px rgba(239, 68, 68, 0.4), 0 10px 10px -5px rgba(239, 68, 68, 0.2)';
            }}
          >
            <MdLogout size={16} style={{marginRight: '8px'}} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '24px'}}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px', marginBottom: '48px'}}>
          {menuItems.map((item, index) => {
            const colors = {
              'bg-blue-500': 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              'bg-green-500': 'linear-gradient(135deg, #10b981, #047857)',
              'bg-purple-500': 'linear-gradient(135deg, #8b5cf6, #5b21b6)',
              'bg-yellow-500': 'linear-gradient(135deg, #f59e0b, #d97706)'
            };
            return (
              <div
                key={index}
                onClick={() => navigate(item.path)}
                style={{
                  background: colors[item.color],
                  color: 'white',
                  padding: '32px',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 25px 50px -12px rgba(0, 0, 0, 0.25)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
              >
                <div style={{fontSize: '48px', marginBottom: '20px', filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'}}>{item.icon}</div>
                <h3 style={{fontSize: '22px', fontWeight: '700', marginBottom: '12px', letterSpacing: '-0.025em'}}>{item.title}</h3>
                <p style={{fontSize: '15px', opacity: 0.9, lineHeight: '1.6', marginBottom: '24px'}}>{item.description}</p>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: 'bold'
                  }}>
                    <MdArrowForward size={18} />
                  </div>
                </div>
              </div>
            );
          })
        }</div>

        {/* Quick Stats */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '24px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px'}}>
            <div>
              <h2 style={{
                fontSize: '28px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #1f2937, #4b5563)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                margin: 0,
                letterSpacing: '-0.025em'
              }}>Ringkasan Hari Ini</h2>
              <p style={{fontSize: '16px', color: '#6b7280', margin: '8px 0 0 0'}}>Statistik penjualan terkini</p>
            </div>
            <button
              onClick={fetchStats}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
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
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px'}}>
            <div style={{
              textAlign: 'center',
              padding: '32px 24px',
              background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
              borderRadius: '16px',
              border: '1px solid #93c5fd',
              boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.1)'
            }}>
              <div style={{fontSize: '36px', fontWeight: '800', color: '#2563eb', marginBottom: '12px'}}>{stats.total_transaksi}</div>
              <div style={{color: '#374151', fontWeight: '600', fontSize: '16px', marginBottom: '8px'}}>Transaksi</div>
              <div style={{fontSize: '12px', color: '#2563eb', fontWeight: '500'}}>Hari ini</div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '32px 24px',
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              borderRadius: '16px',
              border: '1px solid #6ee7b7',
              boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.1)'
            }}>
              <div style={{fontSize: '36px', fontWeight: '800', color: '#059669', marginBottom: '12px'}}>
                Rp {parseFloat(stats.total_pendapatan || 0).toLocaleString()}
              </div>
              <div style={{color: '#374151', fontWeight: '600', fontSize: '16px', marginBottom: '8px'}}>Pendapatan</div>
              <div style={{fontSize: '12px', color: '#059669', fontWeight: '500'}}>Total</div>
            </div>
            <div style={{
              textAlign: 'center',
              padding: '32px 24px',
              background: 'linear-gradient(135deg, #e9d5ff, #d8b4fe)',
              borderRadius: '16px',
              border: '1px solid #c084fc',
              boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.1)'
            }}>
              <div style={{fontSize: '36px', fontWeight: '800', color: '#7c3aed', marginBottom: '12px'}}>{stats.total_item}</div>
              <div style={{color: '#374151', fontWeight: '600', fontSize: '16px', marginBottom: '8px'}}>Item Terjual</div>
              <div style={{fontSize: '12px', color: '#7c3aed', fontWeight: '500'}}>Unit</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;