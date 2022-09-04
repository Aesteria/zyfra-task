import Button from '@mui/material/Button';
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Employe, EmployeFormData } from '../../types/staff';
import StaffTable from './StaffTable';
import AddEmployeeDialog from './AddEmployeeDialog';
import {
  useAddNewEmployeMutation,
  useRemoveEmployeeMutation,
} from '../api/api';
import { useAppSelector } from '../../app/hooks';

type StaffProps = {
  staff: Employe[];
};

const Staff = ({ staff }: StaffProps) => {
  const [open, setOpen] = useState(false);
  const [addEmploye] = useAddNewEmployeMutation();
  const [removeEmploye] = useRemoveEmployeeMutation();
  const selectedDepartment = useAppSelector(
    (state) => state.departments.selected
  );

  const openModalHandler = () => {
    setOpen(true);
  };

  const closeModalHandler = () => {
    setOpen(false);
  };

  const addEmployeHandler = async (employeData: EmployeFormData) => {
    const res = await addEmploye({
      ...employeData,
      department: selectedDepartment as number,
    });

    console.log(res);
  };

  const removeEmployeHandler = async (id: number) => {
    try {
      await removeEmploye(id);
    } catch (e: any) {
      console.log(e);
    }
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<AddCircleIcon />}
        size="large"
        onClick={openModalHandler}
      >
        Добавить работника
      </Button>
      <StaffTable staff={staff} removeEmployeHandler={removeEmployeHandler} />
      <AddEmployeeDialog
        open={open}
        onClose={closeModalHandler}
        addEmployeHandler={addEmployeHandler}
      />
    </div>
  );
};

export default Staff;
