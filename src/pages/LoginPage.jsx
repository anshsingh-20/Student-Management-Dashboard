import { useState } from "react";
import { saveLogin } from "../data/api.js";

export default function LoginPage({ onNavigate }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: true
  });
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function updateField(event) {
    const { name, type, checked, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await saveLogin(form);
      onNavigate("dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="login-layout">
      <div className="login-panel">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign in to manage student records</h2>
        <form className="stacked-form" onSubmit={handleSubmit}>
          {error ? <div className="form-alert">{error}</div> : null}
          <label>
            Email
            <input name="email" type="email" placeholder="admin@school.edu" value={form.email} onChange={updateField} />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="Enter password" value={form.password} onChange={updateField} />
          </label>
          <div className="form-row">
            <label className="check-label">
              <input name="rememberMe" type="checkbox" checked={form.rememberMe} onChange={updateField} />
              Remember me
            </label>
            <a href="#forgot">Forgot password?</a>
          </div>
          <button type="submit" className="primary-btn" disabled={isSaving}>
            {isSaving ? "Saving..." : "Login"}
          </button>
        </form>
      </div>
      <div className="login-visual" aria-label="School administration preview">
        <div className="metric-tile">
          <strong>1,248</strong>
          <span>Students enrolled</span>
        </div>
        <div className="metric-tile">
          <strong>94%</strong>
          <span>Average attendance</span>
        </div>
      </div>
    </section>
  );
}
