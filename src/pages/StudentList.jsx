import { useEffect, useState } from "react";

export default function StudentList({ students, isLoading, onSearchStudents, onViewStudent }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearchStudents(searchTerm);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [onSearchStudents, searchTerm]);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <p className="eyebrow">Directory</p>
          <h2>Student List</h2>
        </div>
        <input
          className="search-input"
          type="search"
          placeholder="Search students"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      {isLoading ? <p className="muted-text">Loading student records...</p> : null}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Class</th>
              <th>Roll No</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{student.name}</td>
                <td>{student.className} - {student.section}</td>
                <td>{student.rollNo}</td>
                <td><span className={`status ${student.status.toLowerCase()}`}>{student.status}</span></td>
                <td>
                  <button className="text-btn" type="button" onClick={() => onViewStudent(student.id)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
            {!isLoading && students.length === 0 ? (
              <tr>
                <td colSpan="6">No matching students found.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
