import { useEffect, useState } from "react";

export default function EditStudent({ student, onUpdateStudent }) {
  const [form, setForm] = useState(student);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setForm(student);
  }, [student]);

  if (!form) {
    return (
      <section className="page-section narrow">
        <div className="page-header">
          <div>
            <p className="eyebrow">Update record</p>
            <h2>Edit Student</h2>
          </div>
        </div>
        <p>No student selected.</p>
      </section>
    );
  }

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      await onUpdateStudent(form);
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
          <p className="eyebrow">Update record</p>
          <h2>Edit Student</h2>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error ? <div className="form-alert">{error}</div> : null}
        <div className="two-column">
          <label>
            Full Name
            <input name="name" type="text" value={form.name} onChange={updateField} required />
          </label>
          <label>
            Student ID
            <input name="id" type="text" value={form.id} onChange={updateField} required />
          </label>
          <label>
            Class
            <input name="className" type="text" value={form.className} onChange={updateField} required />
          </label>
          <label>
            Section
            <input name="section" type="text" value={form.section} onChange={updateField} />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" value={form.phone} onChange={updateField} />
          </label>
          <label>
            Guardian
            <input name="guardian" type="text" value={form.guardian} onChange={updateField} />
          </label>
          <label>
            Roll Number
            <input name="rollNo" type="text" value={form.rollNo} onChange={updateField} />
          </label>
          <label>
            Status
            <select name="status" value={form.status} onChange={updateField}>
              <option>Active</option>
              <option>Review</option>
            </select>
          </label>
          <label>
            Attendance
            <input name="attendance" type="text" value={form.attendance} onChange={updateField} />
          </label>
          <label>
            Grade
            <input name="grade" type="text" value={form.grade} onChange={updateField} />
          </label>
          <label>
            Joined
            <input name="joined" type="date" value={form.joined} onChange={updateField} />
          </label>
        </div>
        <label>
          Address
          <textarea name="address" rows="4" value={form.address} onChange={updateField} />
        </label>
        <button className="primary-btn" type="submit" disabled={isSaving}>
          {isSaving ? "Updating..." : "Update Student"}
        </button>
      </form>
    </section>
  );
}
