import { useState } from "react";

export default function StudentList({ students, onViewStudent }) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredStudents = students.filter((student) => {
    const searchableText = `${student.id} ${student.name} ${student.className} ${student.section} ${student.rollNo} ${student.status}`.toLowerCase();
    return searchableText.includes(searchTerm.toLowerCase());
  });

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
            {filteredStudents.map((student) => (
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
          </tbody>
        </table>
      </div>
    </section>
  );
}
