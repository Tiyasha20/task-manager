import { LogIn } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const user = await login(form);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <p className="eyebrow">Secure task workspace</p>
        <h1>Plan your day with a clear, private task board.</h1>
        <p>Sign in to manage your own tasks. Admins can review every task across the system.</p>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p className="alert">{error}</p>}
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">
          <LogIn size={18} />
          Login
        </button>
        <p className="form-note">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </form>
    </section>
  );
};

export default LoginPage;
