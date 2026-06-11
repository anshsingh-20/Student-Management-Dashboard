export default function StudentDetails({ student, onNavigate }) {
  if (!student) {
    return (
      <section className="page-section narrow">
        <div className="page-header">
          <div>
            <p className="eyebrow">Student profile</p>
            <h2>Student Details</h2>
          </div>
        </div>
        <p>No student selected.</p>
      </section>
    );
  }

  return (
    <section className="page-section narrow">
      <div className="page-header">
        <div>
          <p className="eyebrow">Student profile</p>
          <h2>Student Details</h2>
        </div>
        <button className="secondary-btn compact" type="button" onClick={() => onNavigate("edit")}>
          Edit
        </button>
      </div>

      <article className="profile-card">
        <div className="avatar">{student.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <h3>{student.name}</h3>
          <p>{student.id} - {student.className} Section {student.section}</p>
        </div>
      </article>

      <div className="details-grid">
        <Info label="Roll Number" value={student.rollNo} />
        <Info label="Email" value={student.email} />
        <Info label="Phone" value={student.phone} />
        <Info label="Guardian" value={student.guardian} />
        <Info label="Attendance" value={student.attendance} />
        <Info label="Grade" value={student.grade} />
        <Info label="Joined" value={student.joined} />
        <Info label="Address" value={student.address} />
      </div>
    </section>
  );
}

function Info({ label, value }) {
  return (
    <div className="info-box">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
