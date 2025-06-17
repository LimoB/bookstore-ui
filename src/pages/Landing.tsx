import { Link } from "react-router-dom";
import ContactForm from "../components/ContactForm"; // ⬅️ Import ContactForm
import "./Landing.scss";

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="logo">📚 BookZone</div>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="content">
        <h1>Welcome to BookZone</h1>
        <p>Your modern book management system.</p>
      </div>

      {/* About Section */}
      <section id="about" className="section">
        <h2>About BookZone</h2>
        <p>
          BookZone is a digital platform that helps you manage, browse, and keep track of your favorite books.
        </p>
      </section>

      {/* Contact Section */}
      <ContactForm />

      {/* Footer */}
      <footer>
        <p>&copy; {new Date().getFullYear()} BookZone. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
