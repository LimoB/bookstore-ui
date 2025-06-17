import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import "./Auth.scss";
import bookImage from "../assets/book2.jpg";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token, user } = await loginUser(email, password);
      console.log("🔐 Login response:", { token, user });

      // Validate response
      if (!token || !user) {
        throw new Error("Invalid login response. Please try again.");
      }

      // Normalize the role
      const normalizedUser = {
        ...user,
        role: user.role || user.user_type || user.userType || user.type || "",
      };

      if (!normalizedUser.role) {
        throw new Error("User role missing in login response.");
      }

      // Persist login data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(normalizedUser));

      // Redirect based on role
      switch (normalizedUser.role.toLowerCase()) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "author":
          navigate("/author");
          break;
        case "member":
        default:
          navigate("/books");
          break;
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image">
        <img src={bookImage} alt="Books" />
      </div>

      <div className="auth-form">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <span className="error-message">{error}</span>}

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="auth-switch">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
