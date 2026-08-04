import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../utils/api";
import { useAuth } from "../context/AuthContext";

function getPasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

const STRENGTH_LABELS = ["Very weak", "Weak", "Fair", "Good", "Strong", "Very strong"];

function Login() {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === "login") {
        const data = await loginUser(formData);
        setUser(data.user);
      } else {
        await registerUser(formData);
        const data = await loginUser({ email: formData.email, password: formData.password, username: formData.username });
        setUser(data.user);
      }
      navigate("/vulns");
    } catch (err) {
      setError(err.message);
    }
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <div className="login-page">
      <h1>{mode === "login" ? "Log In" : "Create Account"}</h1>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="vuln-form login-form">
        <input
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />

        {mode === "register" && formData.password && (
          <div className={`strength-meter strength-${strength}`}>
            <div className="strength-bar">
              <div className="strength-fill" style={{ width: `${(strength / 5) * 100}%` }} />
            </div>
            <span>{STRENGTH_LABELS[strength]}</span>
          </div>
        )}

        <button type="submit">{mode === "login" ? "Log In" : "Create Account"}</button>
      </form>

      <button
        className="edit-link"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Need an account? Register" : "Already have an account? Log in"}
      </button>
    </div>
  );
}

export default Login;