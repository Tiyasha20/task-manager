import { UserPlus } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await register(form);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="auth-layout">
      <div className="auth-copy">
        <p className="eyebrow">New account</p>
        <h1>Create your task space and keep your work organized.</h1>
        <p>Accounts default to the user role. Admin roles can be assigned directly in MongoDB.</p>
      </div>
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Register</h2>
        {error && <p className="alert">{error}</p>}
        <label>
          Name
          <input name="name" value={form.name} onChange={handleChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            minLength="6"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">
          <UserPlus size={18} />
          Register
        </button>
        <p className="form-note">
          Already registered? <Link to="/">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default RegisterPage;
