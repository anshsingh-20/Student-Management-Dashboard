const crypto = require("node:crypto");
const http = require("node:http");
const { MongoClient } = require("mongodb");

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/";
const DB_NAME = process.env.DB_NAME || "student_management";

const seedStudents = [
  {
    id: "STU-1001",
    name: "Aarav Sharma",
    className: "Grade 10",
    section: "A",
    rollNo: "18",
    status: "Active",
    email: "aarav.sharma@school.edu",
    phone: "+91 98765 43210",
    guardian: "Neha Sharma",
    address: "Sector 17, Chandigarh",
    attendance: "96%",
    grade: "A",
    joined: "2024-04-12"
  },
  {
    id: "STU-1002",
    name: "Mira Kapoor",
    className: "Grade 9",
    section: "B",
    rollNo: "07",
    status: "Active",
    email: "mira.kapoor@school.edu",
    phone: "+91 98989 12121",
    guardian: "Arjun Kapoor",
    address: "Model Town, Delhi",
    attendance: "91%",
    grade: "B+",
    joined: "2024-05-03"
  },
  {
    id: "STU-1003",
    name: "Kabir Mehta",
    className: "Grade 11",
    section: "C",
    rollNo: "25",
    status: "Review",
    email: "kabir.mehta@school.edu",
    phone: "+91 91234 56789",
    guardian: "Ritu Mehta",
    address: "Baner, Pune",
    attendance: "83%",
    grade: "B",
    joined: "2023-07-18"
  }
];

const defaultProfile = {
  name: "Admin User",
  email: "admin@school.edu",
  role: "Administrator",
  phone: "+91 90000 11111"
};

const client = new MongoClient(MONGODB_URI);
let db;

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json"
  });
  response.end(statusCode === 204 ? "" : JSON.stringify(payload));
}

function readBody(request) {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function cleanDocument(document) {
  const { _id, ...data } = document;
  return data;
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function connectDatabase() {
  if (db) {
    return db;
  }

  await client.connect();
  db = client.db(DB_NAME);
  await db.collection("students").createIndex({ id: 1 }, { unique: true });

  const studentCount = await db.collection("students").countDocuments();
  if (studentCount === 0) {
    await db.collection("students").insertMany(
      seedStudents.map((student) => ({
        ...student,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  }

  return db;
}

async function handleStudents(request, response, url) {
  const database = await connectDatabase();
  const students = database.collection("students");

  if (request.method === "GET") {
    const search = url.searchParams.get("search")?.trim();
    const query = search
      ? {
          $or: [
            "id",
            "name",
            "className",
            "section",
            "rollNo",
            "status",
            "email",
            "phone",
            "guardian",
            "address",
            "grade"
          ].map((field) => ({
            [field]: { $regex: escapeRegex(search), $options: "i" }
          }))
        }
      : {};
    const result = await students.find(query).sort({ createdAt: -1 }).toArray();
    return sendJson(response, 200, result.map(cleanDocument));
  }

  if (request.method === "POST") {
    const student = await readBody(request);
    if (!student.id || !student.name || !student.className) {
      return sendJson(response, 400, { message: "Student ID, name, and class are required." });
    }

    const now = new Date();
    await students.updateOne(
      { id: student.id },
      {
        $set: { ...student, updatedAt: now },
        $setOnInsert: { createdAt: now }
      },
      { upsert: true }
    );
    const savedStudent = await students.findOne({ id: student.id });
    return sendJson(response, 201, cleanDocument(savedStudent));
  }

  return sendJson(response, 405, { message: "Method not allowed." });
}

async function handleStudentById(request, response, studentId) {
  if (request.method !== "PUT") {
    return sendJson(response, 405, { message: "Method not allowed." });
  }

  const database = await connectDatabase();
  const students = database.collection("students");
  const student = await readBody(request);

  if (!student.id || !student.name || !student.className) {
    return sendJson(response, 400, { message: "Student ID, name, and class are required." });
  }

  await students.updateOne(
    { id: decodeURIComponent(studentId) },
    { $set: { ...student, updatedAt: new Date() } }
  );
  const savedStudent = await students.findOne({ id: student.id });
  return sendJson(response, 200, cleanDocument(savedStudent));
}

async function handleLogin(request, response) {
  if (request.method !== "POST") {
    return sendJson(response, 405, { message: "Method not allowed." });
  }

  const database = await connectDatabase();
  const login = await readBody(request);
  await database.collection("logins").insertOne({
    email: login.email,
    passwordHash: hashPassword(login.password || ""),
    rememberMe: Boolean(login.rememberMe),
    createdAt: new Date()
  });

  return sendJson(response, 201, { message: "Login saved." });
}

async function handleProfile(request, response) {
  const database = await connectDatabase();
  const profiles = database.collection("profiles");

  if (request.method === "GET") {
    const profile = await profiles.findOne({ key: "admin" });
    return sendJson(response, 200, profile ? cleanDocument(profile) : defaultProfile);
  }

  if (request.method === "POST") {
    const profile = await readBody(request);
    await profiles.updateOne(
      { key: "admin" },
      { $set: { ...profile, key: "admin", updatedAt: new Date() } },
      { upsert: true }
    );
    return sendJson(response, 201, profile);
  }

  return sendJson(response, 405, { message: "Method not allowed." });
}

const server = http.createServer(async (request, response) => {
  if (request.method === "OPTIONS") {
    return sendJson(response, 204, {});
  }

  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (url.pathname === "/api/health") {
      await connectDatabase();
      return sendJson(response, 200, { database: DB_NAME, status: "ok" });
    }

    if (url.pathname === "/api/students") {
      return handleStudents(request, response, url);
    }

    if (url.pathname.startsWith("/api/students/")) {
      return handleStudentById(request, response, url.pathname.replace("/api/students/", ""));
    }

    if (url.pathname === "/api/login") {
      return handleLogin(request, response);
    }

    if (url.pathname === "/api/profile") {
      return handleProfile(request, response);
    }

    return sendJson(response, 404, { message: "Route not found." });
  } catch (error) {
    console.error(error);
    return sendJson(response, 500, { message: error.message || "Server error." });
  }
});

server.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`MongoDB connection: ${MONGODB_URI}`);
});
