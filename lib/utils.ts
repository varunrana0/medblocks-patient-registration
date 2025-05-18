import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

export const parseMedicalConditions = (conditionsJson: string) => {
  try {
    const conditions = JSON.parse(conditionsJson);
    return Array.isArray(conditions) ? conditions.join(", ") : conditionsJson;
  } catch {
    return conditionsJson;
  }
};
