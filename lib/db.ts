import path from "path";
import { PGlite } from "@electric-sql/pglite";
import { existsSync, mkdirSync } from "fs";

let db: PGlite | null = null;
const dbpath = path.join(process.cwd(), "db", "patients");

export async function getDbConnection() {
  try {
    if (!db) {
      if (!existsSync(dbpath)) {
        mkdirSync(dbpath, { recursive: true });
      }

      db = new PGlite(dbpath);
    }

    await initiateDB(db);
    console.log("Connected to DB");
    return db;
  } catch (error) {
    console.error("Error connecting to DB:", error);
  }
}

async function initiateDB(db: PGlite) {
  try {
    await db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
      id SERIAL PRIMARY KEY,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT CHECK(gender IN ('Male', 'Female', 'Other')) NOT NULL,
      contactNumber TEXT NOT NULL,
      email TEXT,
      address TEXT,
      bloodGroup TEXT,
      medicalConditions TEXT, -- store as JSON string
      createdAt TEXT NOT NULL -- ISO string
    );
  `);
  } catch (error) {
    console.error("Error creating table:", error);
  }
}
