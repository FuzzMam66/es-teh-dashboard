import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function QRPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalHarga, transactionId } = location.state || {};
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      alert("Pembayaran berhasil dikonfirmasi!");
      navigate("/dashboard");
    }, 1000);
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
          }}>Pembayaran QRIS</h1>
          
          {/* QR Code Placeholder */}
          <div style={{
            background: 'linear-gradient(135deg, #f3f4f6, #e5e7eb)',
            width: '280px',
            height: '280px',
            margin: '0 auto 32px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '20px',
            border: '2px solid #d1d5db',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{textAlign: 'center'}}>
              <div style={{fontSize: '80px', marginBottom: '12px', filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))'}}>📱</div>
              <div style={{fontSize: '16px', color: '#6b7280', fontWeight: '600'}}>QR Code</div>
            </div>
          </div>
          
          <div style={{marginBottom: '32px'}}>
            <div style={{fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#374151'}}>Total Pembayaran</div>
            <div style={{
              fontSize: '36px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Rp {totalHarga?.toLocaleString()}
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
              onClick={handleConfirm}
              disabled={confirmed}
              style={{
                width: '100%',
                background: confirmed ? 'linear-gradient(135deg, #10b981, #047857)' : 'linear-gradient(135deg, #10b981, #047857)',
                color: 'white',
                padding: '16px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: confirmed ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: '700',
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)',
                transition: 'all 0.3s ease',
                opacity: confirmed ? 0.8 : 1
              }}
              onMouseOver={(e) => {
                if (!confirmed) {
                  e.target.style.transform = 'translateY(-2px) scale(1.02)';
                  e.target.style.boxShadow = '0 15px 20px -3px rgba(16, 185, 129, 0.5)';
                }
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 15px -3px rgba(16, 185, 129, 0.4)';
              }}
            >
              {confirmed ? "✓ Dikonfirmasi" : "🚀 Konfirmasi Pembayaran"}
            </button>
            
            <button
              onClick={() => navigate("/penjualan")}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #6b7280, #4b5563)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
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
              ← Kembali ke Penjualan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default QRPayment;