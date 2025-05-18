"use server";

import { getDbConnection } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { type Results } from "@electric-sql/pglite";
import { type Patient } from "@/components/Patients/types";
import { type TPatientForm } from "@/components/Patients/Patient.schema";

const db = await getDbConnection();

export const registerPatient = async (
  data: TPatientForm,
  medicalConditions: string,
  createdAt: string
): Promise<void> => {
  if (!db) {
    throw new Error("Database connection error");
  }

  const {
    firstName,
    lastName,
    age,
    gender,
    contactNumber,
    email,
    address,
    bloodGroup,
  } = data;

  try {
    const insertQuery = `
      INSERT INTO patients (
        firstName, lastName, age, gender, contactNumber, email, address,
        bloodGroup, medicalConditions, createdAt
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      ) RETURNING *
    `;

    const values = [
      firstName,
      lastName,
      age,
      gender,
      contactNumber,
      email,
      address,
      bloodGroup,
      medicalConditions,
      createdAt,
    ];

    await db.query(insertQuery, values);
    revalidatePath("/");
  } catch (error) {
    throw new Error("Failed to register patient");
  }
};

export const refreshPatients = async () => {
  revalidatePath("/");
};

export const getAllPatients = async () => {
  try {
    if (!db) {
      throw new Error("Database connection error");
    }

    const result: Results<Patient> = await db.query(
      "SELECT * FROM patients ORDER BY createdAt DESC;"
    );

    if (!result) {
      throw new Error("Failed to fetch patients");
    }

    return result.rows;
  } catch (error) {
    throw new Error("Failed to fetch patients");
  }
};
