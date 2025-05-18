"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { refreshPatients, registerPatient } from "@/actions/actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { type TPatientForm, patientSchema } from "./Patient.schema";
import {
  BLOOD_GROUPS,
  GENDER_OPTIONS,
  NEW_PATIENT_REGISTERED,
  PATIENTS_SYNC_CHANNEL,
} from "./constant";

const ErrorMessage = ({ message }: { message?: string }) => {
  return message ? <p className="text-sm text-red-500">{message}</p> : null;
};

const RegisterPatients = () => {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [channel, setChannel] = useState<BroadcastChannel | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TPatientForm>({
    resolver: zodResolver(patientSchema),
  });

  useEffect(() => {
    const broadcaseChannel = new BroadcastChannel(PATIENTS_SYNC_CHANNEL);
    setChannel(broadcaseChannel);

    broadcaseChannel.onmessage = (event) => {
      if (event.data.type === NEW_PATIENT_REGISTERED) {
        console.log("refreshing patients");
        refreshPatients();
      }
    };
  }, []);

  const onSubmit = async (data: TPatientForm) => {
    try {
      const createdAt = new Date().toISOString();
      const medicalConditions = JSON.stringify(
        data.medicalConditions
          ?.split(",")
          .map((c) => c.trim())
          .filter(Boolean) || []
      );

      await registerPatient(data, medicalConditions, createdAt);
      channel?.postMessage({ type: NEW_PATIENT_REGISTERED });
      reset();
      setOpen(false);
    } catch (err) {
      console.error("Error saving patient:", err);
      setError("Failed to save patient. Please try again.");
    }
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) reset();
    setOpen(isOpen);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Patients</h1>
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button variant="outline">Add New Patient</Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Register New Patient</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
              <div>
                <Input placeholder="First Name" {...register("firstName")} />
                <ErrorMessage message={errors.firstName?.message} />
              </div>

              <div>
                <Input placeholder="Last Name" {...register("lastName")} />
                <ErrorMessage message={errors.lastName?.message} />
              </div>

              <div>
                <Input type="number" placeholder="Age" {...register("age")} />
                <ErrorMessage message={errors.age?.message} />
              </div>

              <div>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {GENDER_OPTIONS.map((gender: string) => (
                            <SelectItem key={gender} value={gender}>
                              {gender}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorMessage message={errors.gender?.message} />
              </div>

              <div>
                <Input
                  placeholder="Contact Number"
                  type="tel"
                  {...register("contactNumber")}
                />
                <ErrorMessage message={errors.contactNumber?.message} />
              </div>

              <Input placeholder="Email Address" {...register("email")} />
              <Input placeholder="Address" {...register("address")} />

              <div>
                <Controller
                  name="bloodGroup"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Blood Group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {BLOOD_GROUPS.map((group: string) => (
                            <SelectItem key={group} value={group}>
                              {group}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorMessage message={errors.bloodGroup?.message} />
              </div>

              <Textarea
                placeholder="Medical Conditions (comma-separated)"
                {...register("medicalConditions")}
              />

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Saving..." : "Submit"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
    </div>
  );
};

export default RegisterPatients;
