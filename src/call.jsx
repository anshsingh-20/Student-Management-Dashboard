import { useMemo, useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import AddStudent from "./pages/AddStudent.jsx";
import StudentList from "./pages/StudentList.jsx";
import StudentDetails from "./pages/StudentDetails.jsx";
import EditStudent from "./pages/EditStudent.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import {
  loadStudents,
  saveStudents,
  loadProfile,
  saveProfile,
  loadLogin,
  saveLogin
} from "./data/localStore.js";

const pages = [
  { id: "login", label: "Login", Component: LoginPage },
  { id: "dashboard", label: "Dashboard", Component: Dashboard },
  { id: "add", label: "Add Student", Component: AddStudent },
  { id: "list", label: "Student List", Component: StudentList },
  { id: "details", label: "Student Details", Component: StudentDetails },
  { id: "edit", label: "Edit Student", Component: EditStudent },
  { id: "profile", label: "Profile", Component: ProfilePage }
];

export default function Call() {
  const [activePage, setActivePage] = useState("login");
  const [students, setStudents] = useState([]);
  const [profile, setProfile] = useState(null);
  const [login, setLogin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState("");

  const selectedStudent = useMemo(() => {
    return students.find((student) => student.id === selectedStudentId) ?? students[0] ?? null;
  }, [students, selectedStudentId]);

  const ActiveComponent = useMemo(
    () => pages.find((page) => page.id === activePage)?.Component ?? LoginPage,
    [activePage]
  );

  useEffect(() => {
    fetch("/api/db")
      .then((res) => res.json())
      .then((data) => {
        const initialStudents = data.students || loadStudents();
        const initialProfile = data.profile || loadProfile();
        const initialLogin = data.login || loadLogin();

        setStudents(initialStudents);
        setProfile(initialProfile);
        setLogin(initialLogin);

        if (initialStudents.length > 0) {
          setSelectedStudentId(initialStudents[0].id);
        }

        // Seeding database on the server if db.json is currently empty
        if (!data.students || !data.profile || !data.login) {
          fetch("/api/db", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              students: initialStudents,
              profile: initialProfile,
              login: initialLogin
            })
          }).catch((err) => console.error("Error seeding local database file:", err));
        }

        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Local DB fetch failed, using localStorage:", err);
        const fbStudents = loadStudents();
        const fbProfile = loadProfile();
        const fbLogin = loadLogin();

        setStudents(fbStudents);
        setProfile(fbProfile);
        setLogin(fbLogin);

        if (fbStudents.length > 0) {
          setSelectedStudentId(fbStudents[0].id);
        }
        setIsLoading(false);
      });
  }, []);

  function persistDb(updatedFields) {
    if (updatedFields.students) saveStudents(updatedFields.students);
    if (updatedFields.profile) saveProfile(updatedFields.profile);
    if (updatedFields.login) saveLogin(updatedFields.login);

    fetch("/api/db", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(updatedFields)
    }).catch((err) => console.error("Error persisting to database file:", err));
  }

  function updateStudents(nextStudents) {
    setStudents(nextStudents);
    persistDb({ students: nextStudents });
  }

  function addStudent(student) {
    const nextStudents = [student, ...students];
    setSelectedStudentId(student.id);
    updateStudents(nextStudents);
    setActivePage("list");
  }

  function updateStudent(updatedStudent) {
    const nextStudents = students.map((student) =>
      student.id === selectedStudentId ? updatedStudent : student
    );

    setSelectedStudentId(updatedStudent.id);
    updateStudents(nextStudents);
    setActivePage("details");
  }

  function viewStudent(studentId) {
    setSelectedStudentId(studentId);
    setActivePage("details");
  }

  function handleSaveProfile(newProfile) {
    setProfile(newProfile);
    persistDb({ profile: newProfile });
  }

  function handleSaveLogin(newLogin) {
    setLogin(newLogin);
    persistDb({ login: newLogin });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand-block">
          <div className="brand-mark">SM</div>
          <div>
            <p className="eyebrow">Phase 1 UI</p>
            <h1>Student Manager</h1>
          </div>
        </div>

        <nav className="nav-list">
          {pages.map((page) => (
            <button
              key={page.id}
              className={activePage === page.id ? "nav-item active" : "nav-item"}
              type="button"
              onClick={() => setActivePage(page.id)}
            >
              <span>{page.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      <main className="page-stage">
        {isLoading ? (
          <div className="db-loading-container">
            <div className="db-spinner"></div>
            <h3>Syncing local database...</h3>
            <p>Reading from db.json</p>
          </div>
        ) : (
          <ActiveComponent
            students={students}
            student={selectedStudent}
            profile={profile}
            login={login}
            onNavigate={setActivePage}
            onAddStudent={addStudent}
            onUpdateStudent={updateStudent}
            onViewStudent={viewStudent}
            onSaveProfile={handleSaveProfile}
            onSaveLogin={handleSaveLogin}
          />
        )}
      </main>
    </div>
  );
}
