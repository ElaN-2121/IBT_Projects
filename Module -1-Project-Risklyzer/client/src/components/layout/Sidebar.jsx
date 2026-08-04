import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="sidebar">
      <div className="sidebar-title">Riskalyzer</div>
      <NavLink to="/vulns" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <span className="nav-tag">VP</span>Vulnerability Prioritizer
      </NavLink>
      <NavLink to="/killchain" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <span className="nav-tag">KC</span>Kill Chain Mapper
      </NavLink>
      <NavLink to="/phishing" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <span className="nav-tag">PS</span>Phishing Scorer
      </NavLink>
      <NavLink to="/attribution" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
        <span className="nav-tag">AE</span>Attribution Engine
      </NavLink>

      <div className="sidebar-footer">
        {user ? (
          <>
            <div className="sidebar-user">{user.username}</div>
            <button className="nav-link logout-btn" onClick={logout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Login
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default Sidebar;