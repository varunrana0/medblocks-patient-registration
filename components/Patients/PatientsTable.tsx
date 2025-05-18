"use client";

import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "../ui/table";
import { type Patient } from "./types";
import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PATIENTS_FILTER_CHANNEL, FILTER_PATIENTS } from "./constant";
import { formatDate, parseMedicalConditions } from "@/lib/utils";
import { Alert, AlertTitle } from "../ui/alert";
import { AlertTriangleIcon } from "lucide-react";

type Props = {
  initialPatients: Patient[];
};

const PatientsTable = ({ initialPatients }: Props) => {
  const [search, setSearch] = useState<string>("");
  const [filtered, setFiltered] = useState<Patient[]>(initialPatients);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const isRemoteUpdate = useRef<boolean>(false);

  useEffect(() => {
    const s = search.toLowerCase();

    const filteredData = initialPatients.filter(
      (p) =>
        `${p.firstname} ${p.lastname}`.toLowerCase().includes(s) ||
        p.email?.toLowerCase().includes(s) ||
        p.contactnumber?.includes(s)
    );

    setFiltered(filteredData);

    if (!isRemoteUpdate.current) {
      channelRef.current?.postMessage({
        type: FILTER_PATIENTS,
        payload: search,
      });
    } else {
      isRemoteUpdate.current = false;
    }
  }, [search, initialPatients]);

  useEffect(() => {
    const channel = new BroadcastChannel(PATIENTS_FILTER_CHANNEL);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data.type === FILTER_PATIENTS) {
        isRemoteUpdate.current = true;
        setSearch(event.data.payload);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  if (!initialPatients || initialPatients.length === 0) {
    return (
      <Alert className="mt-4" variant="destructive" role="alert">
        <AlertTriangleIcon className="h-4 w-4" />
        <AlertTitle>No Patient Records Found</AlertTitle>
      </Alert>
    );
  }

  return (
    <Card
      className="p-4"
      role="region"
      aria-labelledby="patients-table-heading"
    >
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <label htmlFor="search" className="sr-only">
          Search Patients
        </label>
        <Input
          id="search"
          placeholder="Search by name, email, or contact"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
          aria-label="Search patients by name, email, or contact number"
        />
      </div>

      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {filtered.length === 0
          ? "No matching patients found"
          : `${filtered.length} patients found`}
      </div>

      {filtered.length === 0 ? (
        <div
          className="text-center py-4"
          role="status"
          data-testid="no-patients-message"
        >
          No matching patients found
        </div>
      ) : (
        <Table
          className="w-full table-auto"
          role="table"
          aria-label="List of registered patients"
        >
          <TableHeader>
            <TableRow role="row">
              <TableHead role="columnheader">Name</TableHead>
              <TableHead role="columnheader">Age</TableHead>
              <TableHead role="columnheader">Gender</TableHead>
              <TableHead role="columnheader">Contact</TableHead>
              <TableHead role="columnheader">Email</TableHead>
              <TableHead role="columnheader">Blood Group</TableHead>
              <TableHead role="columnheader">Medical Conditions</TableHead>
              <TableHead role="columnheader">Date Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((patient) => (
              <TableRow key={patient.id} role="row">
                <TableCell
                  role="cell"
                  className="font-medium whitespace-nowrap"
                >
                  {patient.firstname} {patient.lastname}
                </TableCell>
                <TableCell role="cell">{patient.age}</TableCell>
                <TableCell role="cell">{patient.gender}</TableCell>
                <TableCell role="cell">
                  {patient.contactnumber || "-"}
                </TableCell>
                <TableCell role="cell">{patient.email || "-"}</TableCell>
                <TableCell role="cell">{patient.bloodgroup || "-"}</TableCell>
                <TableCell
                  role="cell"
                  className="whitespace-break-spaces max-w-[100px]"
                >
                  {parseMedicalConditions(patient.medicalconditions) || "-"}
                </TableCell>
                <TableCell role="cell" className="text-xs">
                  {formatDate(patient.createdat)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default PatientsTable;
