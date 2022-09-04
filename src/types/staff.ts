export type Employe = {
  name: string;
  birthDate: string;
  gender: 'мужской' | 'женский';
  position: string;
  driversLicense: boolean;
  id: number;
  department: number;
};

export type EmployeFormData = {
  name: string;
  birthDate: string;
  gender: 'мужской' | 'женский';
  position: string;
  driversLicense: boolean;
};
