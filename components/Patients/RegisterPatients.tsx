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
import { toast } from "sonner";

const ErrorMessage = ({ message, id }: { message?: string; id: string }) => {
  return message ? (
    <p id={id} className="text-sm text-red-500" role="alert" aria-live="polite">
      {message}
    </p>
  ) : null;
};

const RegisterPatients = () => {
  const [open, setOpen] = useState(false);
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
    const broadCastChannel = new BroadcastChannel(PATIENTS_SYNC_CHANNEL);
    setChannel(broadCastChannel);

    broadCastChannel.onmessage = (event) => {
      if (event.data.type === NEW_PATIENT_REGISTERED) {
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
      toast.success("Patient registered successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to register patient";

      reset();
      setOpen(false);
      toast.error(errorMessage);
    }
  };

  const handleDialogChange = (isOpen: boolean) => {
    if (!isOpen) reset();
    setOpen(isOpen);
  };

  return (
    <div role="main" aria-label="Patient Registration">
      <div className="flex justify-between items-center mb-6">
        <h1
          className="text-2xl font-bold"
          onClick={() => {
            toast.success("Patient Management System", {
              id: "toast-1",
            });
          }}
        >
          Patients
        </h1>
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button variant="outline" aria-haspopup="dialog">
              Add New Patient
            </Button>
          </DialogTrigger>

          <DialogContent
            className="sm:max-w-lg"
            aria-modal="true"
            role="dialog"
          >
            <DialogHeader>
              <DialogTitle>Register New Patient</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4 mt-6"
              aria-describedby="form-description"
            >
              <div>
                <Input
                  placeholder="First Name"
                  {...register("firstName")}
                  aria-invalid={!!errors.firstName}
                  aria-describedby="firstName-error"
                />
                <ErrorMessage
                  message={errors.firstName?.message}
                  id="firstName-error"
                />
              </div>

              <div>
                <Input
                  placeholder="Last Name"
                  {...register("lastName")}
                  aria-invalid={!!errors.lastName}
                  aria-describedby="lastName-error"
                />
                <ErrorMessage
                  message={errors.lastName?.message}
                  id="lastName-error"
                />
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Age"
                  {...register("age")}
                  aria-invalid={!!errors.age}
                  aria-describedby="age-error"
                />
                <ErrorMessage message={errors.age?.message} id="age-error" />
              </div>

              <div>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-full"
                        aria-label="Select Gender"
                        aria-invalid={!!errors.gender}
                        aria-describedby="gender-error"
                      >
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
                <ErrorMessage
                  message={errors.gender?.message}
                  id="gender-error"
                />
              </div>

              <div>
                <Input
                  placeholder="Contact Number"
                  type="tel"
                  {...register("contactNumber")}
                  aria-invalid={!!errors.contactNumber}
                  aria-describedby="contact-error"
                />
                <ErrorMessage
                  message={errors.contactNumber?.message}
                  id="contact-error"
                />
              </div>

              <Input
                placeholder="Email Address"
                {...register("email")}
                aria-describedby="email-error"
              />

              <Input
                placeholder="Address"
                {...register("address")}
                aria-describedby="address-error"
              />

              <div>
                <Controller
                  name="bloodGroup"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-full"
                        aria-label="Select Blood Group"
                        aria-invalid={!!errors.bloodGroup}
                        aria-describedby="bloodGroup-error"
                      >
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
                <ErrorMessage
                  message={errors.bloodGroup?.message}
                  id="bloodGroup-error"
                />
              </div>

              <div>
                <Textarea
                  placeholder="Medical Conditions (comma-separated)"
                  {...register("medicalConditions")}
                  aria-describedby="medicalConditions-help"
                />
                <p
                  id="medicalConditions-help "
                  className="text-sm text-muted-foreground mt-1"
                >
                  Separate each condition with a comma
                </p>
              </div>

              <Button
                type="submit"
                aria-label="Submit Patient Registration"
                disabled={isSubmitting}
                className="w-full cursor-pointer"
                aria-disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Submit"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default RegisterPatients;
