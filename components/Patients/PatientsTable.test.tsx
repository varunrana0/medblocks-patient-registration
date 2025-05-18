import { render, screen, fireEvent } from "@testing-library/react";
import PatientsTable from "./PatientsTable";
import type { Patient } from "./types";

const patients: Patient[] = [
  {
    id: 1,
    firstname: "John",
    lastname: "Doe",
    address: "123 Main St",
    age: 30,
    gender: "Male",
    contactnumber: "1234567890",
    email: "john@example.com",
    bloodgroup: "A+",
    medicalconditions: "diabetes,hypertension",
    createdat: new Date().toISOString(),
  },
];

describe("PatientsTable", () => {
  it("renders patient data", () => {
    render(<PatientsTable initialPatients={patients} />);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("filters patient data by search", () => {
    render(<PatientsTable initialPatients={patients} />);
    const input = screen.getByPlaceholderText(/search/i);
    fireEvent.change(input, { target: { value: "Jane" } });
    expect(screen.getByTestId("no-patients-message")).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "John" } });
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("shows fallback message for empty patient list", () => {
    render(<PatientsTable initialPatients={[]} />);
    expect(screen.getByText(/no patient records found/i)).toBeInTheDocument();
  });
});
