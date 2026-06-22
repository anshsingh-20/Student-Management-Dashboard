import { useState, useEffect } from "react";
import { fetchProfile, saveProfile } from "../data/api.js";

const defaultProfile = {
  name: "Admin User",
  email: "admin@school.edu",
  role: "Administrator",
  phone: "+91 90000 11111"
};

export default function ProfilePage() {
  const [form, setForm] = useState(defaultProfile);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadProfile() {
      try {
        const savedProfile = await fetchProfile();
        if (isCurrent) {
          setForm({ ...defaultProfile, ...savedProfile });
        }
      } catch (requestError) {
        if (isCurrent) {
          setError(requestError.message);
        }
      }
    }

    loadProfile();

    return () => {
      isCurrent = false;
    };
  }, []);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await saveProfile(form);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="page-section narrow">
      <div className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h2>Profile Page</h2>
        </div>
      </div>

      <article className="profile-card large">
        <div className="avatar">{form.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <h3>{form.name}</h3>
          <p>{form.role}</p>
        </div>
      </article>

      <form className="form-card" onSubmit={handleSubmit}>
        {error ? <div className="form-alert">{error}</div> : null}
        <div className="two-column">
          <label>
            Name
            <input name="name" type="text" value={form.name} onChange={updateField} />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} />
          </label>
          <label>
            Role
            <input name="role" type="text" value={form.role} onChange={updateField} />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" value={form.phone} onChange={updateField} />
          </label>
        </div>
        <button className="primary-btn" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </section>
  );
}
