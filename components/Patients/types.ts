// Patient interface uses the same fields as the database to ensure consistency
export interface Patient {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  gender: string;
  contactnumber: string;
  email: string;
  address: string;
  bloodgroup: string;
  createdat: string;
  medicalconditions: string;
}
