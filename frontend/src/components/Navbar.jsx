import { useNavigate, useLocation } from "react-router-dom";
import { MdLocalCafe, MdLogout } from "react-icons/md";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const activeClass =
    "text-sm font-semibold text-[#136dec] border-b-2 border-[#136dec] pb-1 cursor-pointer transition-colors";
  const inactiveClass =
    "text-sm font-medium text-slate-500 hover:text-[#136dec] transition-colors cursor-pointer";

  return (
    <header className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md border-b border-blue-500/10">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between py-3">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#136dec] rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <MdLocalCafe className="text-2xl" />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Es Teh Kasir
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate("/dashboard")}
              className={
                currentPath === "/dashboard" ? activeClass : inactiveClass
              }
            >
              Dashboard
            </button>
            <button
              onClick={() => navigate("/penjualan")}
              className={
                currentPath === "/penjualan" ? activeClass : inactiveClass
              }
            >
              Penjualan
            </button>
            <button
              onClick={() => navigate("/kelola-menu")}
              className={
                currentPath === "/kelola-menu" ? activeClass : inactiveClass
              }
            >
              Kelola Menu
            </button>
            <button
              onClick={() => navigate("/laporan-harian")}
              className={
                currentPath === "/laporan-harian" ? activeClass : inactiveClass
              }
            >
              Laporan
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
          <div className="flex items-center gap-3 pl-2">
            <button
              className="ml-2 p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors group cursor-pointer"
              onClick={handleLogout}
            >
              <MdLogout />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
