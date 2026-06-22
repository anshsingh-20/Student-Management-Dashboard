import { useState } from "react";

const initialForm = {
  name: "",
  id: "",
  className: "",
  section: "A",
  guardian: "",
  email: "",
  phone: "",
  rollNo: "",
  address: "",
  status: "Active",
  attendance: "",
  grade: "",
  joined: new Date().toISOString().slice(0, 10)
};

export default function AddStudent({ onAddStudent }) {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsSaving(true);

    try {
      await onAddStudent({
        ...form,
        id: form.id.trim(),
        name: form.name.trim(),
        guardian: form.guardian.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        rollNo: form.rollNo.trim(),
        address: form.address.trim(),
        attendance: form.attendance.trim() || "0%",
        grade: form.grade.trim() || "N/A"
      });
      setForm(initialForm);
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
          <p className="eyebrow">Create record</p>
          <h2>Add Student</h2>
        </div>
      </div>

      <form className="form-card" onSubmit={handleSubmit}>
        {error ? <div className="form-alert">{error}</div> : null}
        <div className="two-column">
          <label>
            Full Name
            <input name="name" type="text" placeholder="Student name" value={form.name} onChange={updateField} required />
          </label>
          <label>
            Student ID
            <input name="id" type="text" placeholder="STU-1004" value={form.id} onChange={updateField} required />
          </label>
          <label>
            Class
            <select name="className" value={form.className} onChange={updateField} required>
              <option value="" disabled>Select class</option>
              <option>Grade 8</option>
              <option>Grade 9</option>
              <option>Grade 10</option>
              <option>Grade 11</option>
            </select>
          </label>
          <label>
            Section
            <select name="section" value={form.section} onChange={updateField}>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </label>
          <label>
            Guardian Name
            <input name="guardian" type="text" placeholder="Parent or guardian" value={form.guardian} onChange={updateField} />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="student@school.edu" value={form.email} onChange={updateField} />
          </label>
          <label>
            Phone
            <input name="phone" type="tel" placeholder="+91 90000 00000" value={form.phone} onChange={updateField} />
          </label>
          <label>
            Roll Number
            <input name="rollNo" type="text" placeholder="26" value={form.rollNo} onChange={updateField} />
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
            <input name="attendance" type="text" placeholder="92%" value={form.attendance} onChange={updateField} />
          </label>
          <label>
            Grade
            <input name="grade" type="text" placeholder="A" value={form.grade} onChange={updateField} />
          </label>
        </div>
        <label>
          Address
          <textarea name="address" rows="4" placeholder="Student address" value={form.address} onChange={updateField} />
        </label>
        <button className="primary-btn" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Student"}
        </button>
      </form>
    </section>
  );
}
