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

type Props = {
  initialPatients: Patient[];
};

const PatientsTable = ({ initialPatients }: Props) => {
  const [search, setSearch] = useState<string>("");
  const [filtered, setFiltered] = useState<Patient[]>(initialPatients);
  const channelRef = useRef<BroadcastChannel | null>(null);
  const isRemoteUpdate = useRef(false);

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

  return (
    <Card className="p-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          placeholder="Search by name, email, or contact"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-4">No matching patients found</div>
      ) : (
        <Table className="w-full table-auto">
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Blood Group</TableHead>
              <TableHead>Medical Conditions</TableHead>
              <TableHead>Date Registered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium whitespace-nowrap">
                  {patient.firstname} {patient.lastname}
                </TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.gender}</TableCell>
                <TableCell>{patient.contactnumber || "-"}</TableCell>
                <TableCell>{patient.email || "-"}</TableCell>
                <TableCell>{patient.bloodgroup || "-"}</TableCell>
                <TableCell className="whitespace-break-spaces max-w-[100px]">
                  {parseMedicalConditions(patient.medicalconditions) || "-"}
                </TableCell>
                <TableCell className="text-xs">
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
