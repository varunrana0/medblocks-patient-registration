import { Suspense } from "react";
import RegisterPatients from "@/components/Patients/RegisterPatients";
import PatientsTableWrapper from "@/components/Patients/PatientsTableWrapper";

export default function Home() {
  return (
    <main className="container mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        Patient Management System
      </h1>

      {/*  Register Patients to the system */}
      <RegisterPatients />

      {/* List of Patients */}
      <Suspense
        fallback={<div className="text-center p-6">Loading patients...</div>}
      >
        <PatientsTableWrapper />
      </Suspense>
    </main>
  );
}
