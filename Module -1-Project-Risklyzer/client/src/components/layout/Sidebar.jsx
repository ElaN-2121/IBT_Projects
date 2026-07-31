import { NavLink } from "react-router-dom";

const Sidebar = () => {
    return(
        <div className="sidebar">
        <div className="sidebar-title">Risklyzer</div>
        <NavLink to="/vulns" className={({ isActive }) => isActive ? "nav-link active":"nav-link"}>
            <span className="nav-tag">VP</span>
            Vulnerability Prioritizer</NavLink>
        <NavLink to="/attribution" className={({ isActive }) => isActive ? "nav-link active":"nav-link"}>
        <span className="nav-tag">AE</span>
        Attribution Engine</NavLink>
        <NavLink to="/phishing" className={({ isActive }) => isActive ? "nav-link active":"nav-link"}>
        <span className="nav-tag">PS</span>
        Phishing Scorer</NavLink>
        <NavLink to="/killchain" className={({ isActive }) => isActive ? "nav-link active":"nav-link"}>
        <span className="nav-tag">KC</span>
        Kill Chain Mapper</NavLink>
        <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active":"nav-link"}>Login</NavLink>
        </div>
    )
}

export default Sidebar;