export default function Dashboard({ students, onNavigate }) {
  const activeStudents = students.filter((student) => student.status === "Active").length;

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Dashboard</h2>
        </div>
        <button className="primary-btn compact" type="button" onClick={() => onNavigate("add")}>
          Add Student
        </button>
      </div>

      <div className="stats-grid">
        <article className="stat-card">
          <span>Total Students</span>
          <strong>{students.length}</strong>
        </article>
        <article className="stat-card">
          <span>Active Students</span>
          <strong>{activeStudents}</strong>
        </article>
        <article className="stat-card">
          <span>Classes</span>
          <strong>12</strong>
        </article>
        <article className="stat-card">
          <span>Attendance</span>
          <strong>92%</strong>
        </article>
      </div>

      <div className="content-grid">
        <article className="panel">
          <h3>Recent Students</h3>
          <div className="mini-list">
            {students.map((student) => (
              <button key={student.id} type="button" onClick={() => onNavigate("details")}>
                <span>{student.name}</span>
                <small>{student.className} - {student.section}</small>
              </button>
            ))}
          </div>
        </article>
        <article className="panel">
          <h3>Today</h3>
          <div className="timeline">
            <p><strong>09:00</strong> Attendance review</p>
            <p><strong>11:30</strong> Parent meeting</p>
            <p><strong>14:00</strong> Academic report update</p>
          </div>
        </article>
      </div>
    </section>
  );
}
