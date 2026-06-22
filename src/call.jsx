import { useCallback, useEffect, useMemo, useState } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddStudent from "./pages/AddStudent.jsx";
import StudentList from "./pages/StudentList.jsx";
import StudentDetails from "./pages/StudentDetails.jsx";
import EditStudent from "./pages/EditStudent.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { createStudent, fetchStudents, saveStudent } from "./data/api.js";

const pages = [
  { id: "login", label: "Login", Component: LoginPage },
  { id: "dashboard", label: "Dashboard", Component: Dashboard },
  { id: "add", label: "Add Student", Component: AddStudent },
  { id: "list", label: "Student List", Component: StudentList },
  { id: "details", label: "Student Details", Component: StudentDetails },
  { id: "edit", label: "Edit Student", Component: EditStudent },
  { id: "profile", label: "Profile", Component: ProfilePage },
];

export default function Call() {
  const [activePage, setActivePage] = useState("login");
  const [students, setStudents] = useState([]);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedStudent = useMemo(() => {
    return (
      students.find((student) => student.id === selectedStudentId) ??
      students[0] ??
      null
    );
  }, [students, selectedStudentId]);

  const ActiveComponent = useMemo(
    () => pages.find((page) => page.id === activePage)?.Component ?? LoginPage,
    [activePage],
  );

  const loadStudentRecords = useCallback(async (searchTerm = "") => {
    setIsLoading(true);
    setError("");

    try {
      const nextStudents = await fetchStudents(searchTerm);
      setStudents(nextStudents);
      setSelectedStudentId(
        (currentId) => currentId || nextStudents[0]?.id || "",
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudentRecords();
  }, [loadStudentRecords]);

  async function addStudent(student) {
    const savedStudent = await createStudent(student);
    setSelectedStudentId(savedStudent.id);
    await loadStudentRecords();
    setActivePage("list");
  }

  async function updateStudent(updatedStudent) {
    const savedStudent = await saveStudent(selectedStudentId, updatedStudent);
    setSelectedStudentId(savedStudent.id);
    await loadStudentRecords();
    setActivePage("details");
  }

  function viewStudent(studentId) {
    setSelectedStudentId(studentId);
    setActivePage("details");
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand-block">
          <div className="brand-mark">SM</div>
          <div>
            <p className="eyebrow"></p>
            <h1>Student Management</h1>
          </div>
        </div>

        <nav className="nav-list">
          {pages.map((page) => (
            <button
              key={page.id}
              className={
                activePage === page.id ? "nav-item active" : "nav-item"
              }
              type="button"
              onClick={() => setActivePage(page.id)}>
              <span>{page.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="page-stage">
        {error ? <div className="app-alert">{error}</div> : null}
        <ActiveComponent
          students={students}
          student={selectedStudent}
          isLoading={isLoading}
          onNavigate={setActivePage}
          onAddStudent={addStudent}
          onSearchStudents={loadStudentRecords}
          onUpdateStudent={updateStudent}
          onViewStudent={viewStudent}
        />
      </main>
    </div>
  );
}
