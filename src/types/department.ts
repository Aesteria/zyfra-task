export type Department = {
  id: string;
  name: string;
  departmentId: string;
  createdAt: string | null;
  description: string;
};

export type DepartmentFormData = Omit<Department, 'id' | 'departmentId'>;
