import Button from '@mui/material/Button';
import { useMemo, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Employe, EmployeFormData } from '../../types/staff';
import StaffTable from './StaffTable';
import AddEmployeeDialog from './AddEmployeDialog';
import {
  useAddNewEmployeMutation,
  useEditEmployeeMutation,
  useGetStaffQuery,
  useRemoveEmployeeMutation,
} from '../api/api';
import EditEmployeDialog from './EditEmployeDialog';
import { useParams } from 'react-router-dom';

type EditModalState = {
  employe: null | Employe;
  open: boolean;
};

const Staff = () => {
  const { data: staff = [], isSuccess } = useGetStaffQuery();
  const [open, setOpen] = useState(false);
  const [editModal, setEditModal] = useState<EditModalState>({
    employe: null,
    open: false,
  });
  const [addEmploye] = useAddNewEmployeMutation();
  const [removeEmploye] = useRemoveEmployeeMutation();
  const [editEmploye] = useEditEmployeeMutation();
  const { departmentId } = useParams<{ departmentId: string }>();
  const selectedDepartment = parseInt(departmentId as string, 10);

  const staffFiltered = useMemo(() => {
    return staff.filter((item: any) => item.department === selectedDepartment);
  }, [staff, selectedDepartment]);

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

  let content;

  if (isSuccess) {
    content = (
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
          staff={staffFiltered}
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
  } else {
    content = <p>Loading...</p>;
  }

  return content;
};

export default Staff;
