import { useNavigate, useLocation } from "react-router-dom";

function CashPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalHarga, nominalBayar, kembalian, transactionId } = location.state || {};

  const handleFinish = () => {
    alert("Transaksi selesai!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{backgroundColor: '#5CBFEA'}}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '48px',
        maxWidth: '500px',
        width: '100%',
        margin: '0 20px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{textAlign: 'center'}}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            marginBottom: '32px',
            background: 'linear-gradient(135deg, #1f2937, #4b5563)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>Pembayaran Tunai</h1>
          
          <div style={{fontSize: '80px', marginBottom: '32px', filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'}}>💵</div>
          
          <div style={{marginBottom: '32px'}}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '16px',
              marginBottom: '16px'
            }}>
              <span style={{fontSize: '16px', color: '#374151', fontWeight: '600'}}>Total Pesanan:</span>
              <span style={{fontSize: '16px', fontWeight: '700', color: '#1f2937'}}>Rp {totalHarga?.toLocaleString()}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '16px',
              marginBottom: '16px'
            }}>
              <span style={{fontSize: '16px', color: '#374151', fontWeight: '600'}}>Nominal Bayar:</span>
              <span style={{fontSize: '16px', fontWeight: '700', color: '#1f2937'}}>Rp {nominalBayar?.toLocaleString()}</span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px',
              background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
              borderRadius: '12px',
              border: '1px solid #6ee7b7'
            }}>
              <span style={{fontSize: '18px', color: '#374151', fontWeight: '600'}}>Kembalian:</span>
              <span style={{
                fontSize: '24px',
                fontWeight: '800',
                background: 'linear-gradient(135deg, #059669, #047857)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Rp {kembalian?.toLocaleString()}
              </span>
            </div>
          </div>
          
          <div style={{
            fontSize: '14px',
            color: '#6b7280',
            marginBottom: '32px',
            padding: '12px 16px',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '8px',
            border: '1px solid #93c5fd'
          }}>
            🏷️ ID Transaksi: {transactionId}
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            <button
              onClick={handleFinish}
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
                boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px) scale(1.02)';
                e.target.style.boxShadow = '0 15px 20px -3px rgba(59, 130, 246, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(59, 130, 246, 0.4)';
              }}
            >
              ✓ Selesai
            </button>
            
            <button
              onClick={() => navigate("/penjualan")}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #10b981, #047857)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 15px 20px -3px rgba(16, 185, 129, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.4)';
              }}
            >
              Transaksi Baru
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CashPayment;