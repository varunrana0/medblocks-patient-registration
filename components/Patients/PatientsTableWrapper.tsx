import { getAllPatients } from "@/actions/actions";
import PatientsTable from "./PatientsTable";

const PatientsTableWrapper = async () => {
  const patients = await getAllPatients();
  return <PatientsTable initialPatients={patients!} />;
};

export default PatientsTableWrapper;
