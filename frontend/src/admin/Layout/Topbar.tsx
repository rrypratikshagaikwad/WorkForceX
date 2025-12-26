import "./Topbar.css";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="topbar">
      <span>Welcome, Admin</span>
      <button className="logout-btn"  onClick={logout}>Logout</button>
    </div>
  );
};

export default Topbar;
