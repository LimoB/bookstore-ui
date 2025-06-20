import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/authSlice";
import { loginUser } from "../services/auth";
import bookImage from "../assets/book2.jpg";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const normalizeUser = (user: any) => ({
    ...user,
    role:
      user.role ||
      user.user_type ||
      user.userType ||
      user.type ||
      "",
  });

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { token, user } = await loginUser(email, password);
      console.log("🔐 Login response:", { token, user });

      if (!token || !user) {
        throw new Error("Invalid login response. Please try again.");
      }

      const normalizedUser = normalizeUser(user);

      if (!normalizedUser.role) {
        throw new Error("User role missing in login response.");
      }

      dispatch(setCredentials({ token, user: normalizedUser }));

      const role = normalizedUser.role.toLowerCase();
      switch (role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "author":
          navigate("/author");
          break;
        case "member":
          navigate("/");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Image */}
      <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100">
        <img
          src={bookImage}
          alt="Books"
          className="object-cover max-h-full rounded-xl shadow-lg"
        />
      </div>

      {/* Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6"
        >
          <h2 className="text-3xl font-bold text-indigo-600 text-center">
            Welcome Back
          </h2>

          <div>
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
