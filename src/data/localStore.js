import { students as seedStudents } from "./students.jsx";

const STUDENTS_KEY = "student-manager.students";
const PROFILE_KEY = "student-manager.profile";
const LOGIN_KEY = "student-manager.login";

export const DEFAULT_PROFILE = {
  name: "Admin User",
  email: "admin@school.edu",
  role: "Administrator",
  phone: "+91 90000 11111"
};

export const DEFAULT_LOGIN = {
  email: "",
  password: "",
  rememberMe: true
};

export { seedStudents as SEED_STUDENTS };


function readJson(key, fallback) {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadStudents() {
  const storedStudents = readJson(STUDENTS_KEY, null);

  if (Array.isArray(storedStudents)) {
    return storedStudents;
  }

  writeJson(STUDENTS_KEY, seedStudents);
  return seedStudents;
}

export function saveStudents(students) {
  writeJson(STUDENTS_KEY, students);
}

export function loadProfile() {
  return readJson(PROFILE_KEY, DEFAULT_PROFILE);
}

export function saveProfile(profile) {
  writeJson(PROFILE_KEY, profile);
}

export function loadLogin() {
  return readJson(LOGIN_KEY, DEFAULT_LOGIN);
}

export function saveLogin(login) {
  writeJson(LOGIN_KEY, login);
}
