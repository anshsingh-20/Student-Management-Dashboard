import { useState, useEffect } from "react";

export default function ProfilePage({ profile, onSaveProfile }) {
  const [form, setForm] = useState(profile);

  useEffect(() => {
    if (profile) {
      setForm(profile);
    }
  }, [profile]);

  if (!profile || !form) {
    return (
      <section className="page-section narrow">
        <div className="page-header">
          <div>
            <p className="eyebrow">Account</p>
            <h2>Profile Page</h2>
          </div>
        </div>
        <p>Loading profile...</p>
      </section>
    );
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSaveProfile(form);
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
        <button className="primary-btn" type="submit">Save Profile</button>
      </form>
    </section>
  );
}
