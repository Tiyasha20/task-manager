import { ClipboardList, LogOut, ShieldCheck } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="brand">
        <ClipboardList size={24} />
        <span>Task Manager</span>
      </Link>

      <nav className="nav-actions">
        {isAuthenticated ? (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            {user?.role === "admin" && (
              <NavLink to="/admin">
                <ShieldCheck size={18} />
                Admin
              </NavLink>
            )}
            <button className="icon-button" type="button" onClick={handleLogout} title="Log out">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <NavLink to="/">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
