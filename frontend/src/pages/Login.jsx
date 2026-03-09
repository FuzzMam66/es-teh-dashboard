import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { MdLocalCafe, MdVisibility, MdVisibilityOff, MdPlayArrow } from "react-icons/md";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { username, password });

      localStorage.setItem("token", res.data.token);

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    }
  };

  const handleDemoLogin = () => {
    setUsername("admin");
    setPassword("admin123");
    // Secara opsional bisa langsung trigger login, tapi mengisi form lebih jelas bagi user
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f7f8] font-sans text-slate-900">
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xl w-full max-w-md flex flex-col gap-6">
        <div className="text-center flex flex-col items-center gap-3">
          <div className="w-16 h-16 bg-[#136dec] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-2">
            <MdLocalCafe className="text-4xl" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Kasir Es Teh
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            Silakan masuk untuk melanjutkan
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold text-center">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Username
            </label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-[#136dec] transition-all outline-none pr-12"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <MdVisibilityOff size={20} />
                ) : (
                  <MdVisibility size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#136dec] text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-500/25 hover:opacity-90 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
        >
          Masuk
        </button>

        <button
          onClick={handleDemoLogin}
          className="w-full bg-white border-2 border-[#136dec] text-[#136dec] py-3.5 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <MdPlayArrow size={20} />
          Coba Demo (Isi Otomatis)
        </button>

        <p className="text-center text-xs text-slate-400 font-medium mt-4">
          © 20255 Es Teh Kasir
        </p>
      </div>
    </div>
  );
}

export default Login;
