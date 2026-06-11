import { useState, useEffect } from "react";

export default function LoginPage({ login, onSaveLogin, onNavigate }) {
  const [form, setForm] = useState(login);

  useEffect(() => {
    if (login) {
      setForm(login);
    }
  }, [login]);

  if (!login || !form) {
    return (
      <section className="login-layout">
        <div className="login-panel">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to manage student records</h2>
          <p>Loading login settings...</p>
        </div>
      </section>
    );
  }

  function updateField(event) {
    const { name, type, checked, value } = event.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSaveLogin(form);
    onNavigate("dashboard");
  }

  return (
    <section className="login-layout">
      <div className="login-panel">
        <p className="eyebrow">Welcome back</p>
        <h2>Sign in to manage student records</h2>
        <form className="stacked-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="primary-btn">
            Login
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
