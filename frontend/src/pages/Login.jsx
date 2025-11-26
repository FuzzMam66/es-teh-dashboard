import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center" style={{backgroundColor: '#5CBFEA'}}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        padding: '48px',
        borderRadius: '24px',
        width: '420px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        <div style={{textAlign: 'center', marginBottom: '40px'}}>
          <div style={{fontSize: '64px', marginBottom: '20px', filter: 'drop-shadow(0 8px 16px rgba(0, 0, 0, 0.1))'}}> </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1f2937, #4b5563)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: '0 0 12px 0',
            letterSpacing: '-0.025em'
          }}>Kasir Es Teh</h1>
          <p style={{fontSize: '16px', color: '#6b7280', margin: 0, fontWeight: '400'}}>Silakan masuk ke akun Anda</p>
        </div>

        {error && (
          <div style={{
            background: 'linear-gradient(135deg, #fef2f2, #fee2e2)',
            border: '1px solid #fca5a5',
            color: '#dc2626',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            {error}
          </div>
        )}

        <div style={{marginBottom: '32px'}}>
          <div style={{marginBottom: '24px'}}>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Username</label>
            <input
              type="text"
              placeholder="Masukkan username"
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
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px'}}>Password</label>
            <div style={{position: 'relative'}}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                style={{
                  width: '100%',
                  padding: '16px 50px 16px 20px',
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
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#6b7280',
                  padding: '4px'
                }}
              >
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
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
          Masuk
        </button>
      </div>
    </div>
  );
}

export default Login;
