const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? "https://student-management-dashboard-1-3gh8.onrender.com/api"
    : "http://localhost:5000/api");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export function fetchStudents(searchTerm = "") {
  const search = searchTerm.trim();
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  return request(`/students${query}`);
}

export function createStudent(student) {
  return request("/students", {
    body: JSON.stringify(student),
    method: "POST",
  });
}

export function saveStudent(previousStudentId, student) {
  return request(`/students/${encodeURIComponent(previousStudentId)}`, {
    body: JSON.stringify(student),
    method: "PUT",
  });
}

export function saveLogin(login) {
  return request("/login", {
    body: JSON.stringify(login),
    method: "POST",
  });
}

export function fetchProfile() {
  return request("/profile");
}

export function saveProfile(profile) {
  return request("/profile", {
    body: JSON.stringify(profile),
    method: "POST",
  });
}
