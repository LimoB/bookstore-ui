import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import "./Auth.scss";
import bookImage from "../assets/bookbg1.jpg"; // ✅ Make sure the path matches your project

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await registerUser(form);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error: any) {
      alert(error.message || "Registration failed.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image">
        <img src={bookImage} alt="Books" />
      </div>

      <div className="auth-form">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
          <p>
            Already have an account?{" "}
            <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
