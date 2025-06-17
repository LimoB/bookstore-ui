import { Link } from "react-router-dom";
import "./Landing.scss";

const Landing = () => {
  return (
    <div className="landing">
      <h1>📚 Welcome to BookZone</h1>
      <p>Your modern book management system.</p>
      <div className="buttons">
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>
    </div>
  );
};

export default Landing;
