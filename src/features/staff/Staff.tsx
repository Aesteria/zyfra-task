import Button from '@mui/material/Button';
import { useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Employe, EmployeFormData } from '../../types/staff';
import StaffTable from './StaffTable';
import AddEmployeeDialog from './AddEmployeDialog';
import {
  useAddNewEmployeMutation,
  useEditEmployeeMutation,
  useRemoveEmployeeMutation,
} from '../api/api';
import { useAppSelector } from '../../app/hooks';
import EditEmployeDialog from './EditEmployeDialog';

type StaffProps = {
  staff: Employe[];
};

type EditModalState = {
  employe: null | Employe;
  open: boolean;
};

const Staff = ({ staff }: StaffProps) => {
  const [open, setOpen] = useState(false);
  const [editModal, setEditModal] = useState<EditModalState>({
    employe: null,
    open: false,
  });
  const [addEmploye] = useAddNewEmployeMutation();
  const [removeEmploye] = useRemoveEmployeeMutation();
  const [editEmploye] = useEditEmployeeMutation();
  const selectedDepartment = useAppSelector(
    (state) => state.departments.selected
  );

  const openModalHandler = () => {
    setOpen(true);
  };

  const closeModalHandler = () => {
    setOpen(false);
  };

  const openEditModalHandler = (employe: Employe) => {
    setEditModal({
      open: true,
      employe,
    });
  };

  const closeEditModalHandler = () => {
    setEditModal({
      open: false,
      employe: null,
    });
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

  const editEmployeHandler = async (employe: Employe) => {
    try {
      await editEmploye(employe);
      console.log('Succesfully edit contact');
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
      <StaffTable
        staff={staff}
        removeEmployeHandler={removeEmployeHandler}
        openEditModalHandler={openEditModalHandler}
      />
      <AddEmployeeDialog
        open={open}
        onClose={closeModalHandler}
        addEmployeHandler={addEmployeHandler}
      />
      <EditEmployeDialog
        open={editModal.open}
        onClose={closeEditModalHandler}
        editEmployeHandler={editEmployeHandler}
        employe={editModal.employe}
      />
    </div>
  );
};

export default Staff;
