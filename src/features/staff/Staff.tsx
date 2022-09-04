import Button from '@mui/material/Button';
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Employe, EmployeFormData } from '../../types/staff';
import StaffTable from './StaffTable';
import AddEmployeeDialog from './AddEmployeeDialog';
import { useAddNewEmployeMutation } from '../api/api';
import { useAppSelector } from '../../app/hooks';

type StaffProps = {
  staff: Employe[];
};

const Staff = ({ staff }: StaffProps) => {
  const [open, setOpen] = useState(false);
  const [addEmploye] = useAddNewEmployeMutation();
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
      departmentId: selectedDepartment as number,
    });

    console.log(res);
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
      <StaffTable staff={staff} />
      <AddEmployeeDialog
        open={open}
        onClose={closeModalHandler}
        addEmployeHandler={addEmployeHandler}
      />
    </div>
  );
};

export default Staff;
