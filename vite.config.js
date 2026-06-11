import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.resolve(__dirname, "db.json");

function readDb() {
  if (!fs.existsSync(DB_PATH)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
  } catch (err) {
    console.error("Error reading db.json:", err);
    return {};
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing db.json:", err);
  }
}

export default defineConfig({
  plugins: [
    react(),
    {
      name: "api-server",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/api/db" && req.method === "GET") {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(readDb()));
          } else if (req.url === "/api/db" && req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                const data = JSON.parse(body);
                const currentDb = readDb();
                const updatedDb = { ...currentDb, ...data };
                writeDb(updatedDb);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: true, db: updatedDb }));
              } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid JSON" }));
              }
            });
          } else {
            next();
          }
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === "/api/db" && req.method === "GET") {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(readDb()));
          } else if (req.url === "/api/db" && req.method === "POST") {
            let body = "";
            req.on("data", (chunk) => {
              body += chunk.toString();
            });
            req.on("end", () => {
              try {
                const data = JSON.parse(body);
                const currentDb = readDb();
                const updatedDb = { ...currentDb, ...data };
                writeDb(updatedDb);
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ success: true, db: updatedDb }));
              } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid JSON" }));
              }
            });
          } else {
            next();
          }
        });
      }
    }
  ]
});
