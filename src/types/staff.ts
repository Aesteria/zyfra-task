export type Employe = {
  name: string;
  birthDate: string;
  gender: 'мужской' | 'женский';
  position: string;
  driversLicense: boolean;
  id: string;
  departmentId: string;
};

export type EmployeFormData = {
  name: string;
  birthDate: string;
  gender: 'мужской' | 'женский';
  position: string;
  driversLicense: boolean;
};
