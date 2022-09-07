export type Department = {
  id: string;
  name: string;
  departmentId: string;
  createdAt: string;
  description: string;
};

export type DepartmentFormData = Omit<Department, 'id' | 'departmentId'>;
