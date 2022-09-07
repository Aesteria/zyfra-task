import Button from '@mui/material/Button';
import { useMemo, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Employe, EmployeFormData } from '../../types/staff';
import StaffTable from './StaffTable';
import {
  useAddNewEmployeMutation,
  useEditEmployeeMutation,
  useGetStaffQuery,
  useRemoveEmployeeMutation,
} from '../api/api';
import { useParams } from 'react-router-dom';
import AddEditEmployeDialog from './AddEditEmployeDialog';

type EditModalState = {
  employeId: string | null;
  open: boolean;
};

const Staff = () => {
  const {
    data: staff = [],
    isSuccess,
    isLoading,
    isError,
  } = useGetStaffQuery();
  const [open, setOpen] = useState<EditModalState>({
    employeId: null,
    open: false,
  });
  const [addEmploye] = useAddNewEmployeMutation();
  const [removeEmploye] = useRemoveEmployeeMutation();
  const [editEmploye] = useEditEmployeeMutation();
  const { departmentId: selectedDepartment } = useParams<{
    departmentId: string;
  }>();

  const staffFiltered = useMemo(() => {
    return staff.filter((item: any) => item.department === selectedDepartment);
  }, [staff, selectedDepartment]);

  const openModalHandler = (id?: string) => {
    if (id) {
      setOpen({
        open: true,
        employeId: id,
      });
    } else {
      setOpen({
        open: true,
        employeId: null,
      });
    }
  };

  const closeModalHandler = () => {
    setOpen({
      employeId: null,
      open: false,
    });
  };

  const addEmployeHandler = async (employeData: EmployeFormData) => {
    try {
      await addEmploye({
        ...employeData,
        birthDate: employeData.birthDate as string,
        department: selectedDepartment as string,
      });
    } catch (e: any) {
      console.log(e);
    }
  };

  const removeEmployeHandler = async (id: string) => {
    try {
      await removeEmploye(id);
    } catch (e: any) {
      console.log(e);
    }
  };

  const editEmployeHandler = async (employe: Employe) => {
    try {
      await editEmploye(employe);
      closeModalHandler();
      console.log('Succesfully edit contact');
    } catch (e: any) {
      console.log(e);
    }
  };

  let content;

  if (isSuccess && selectedDepartment !== 'root') {
    content = (
      <div>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          size="large"
          onClick={() => openModalHandler()}
        >
          Добавить работника
        </Button>
        <StaffTable
          staff={staffFiltered}
          removeEmployeHandler={removeEmployeHandler}
          openModalHandler={openModalHandler}
        />
        <AddEditEmployeDialog
          addEmployeHandler={addEmployeHandler}
          editEmployeHandler={editEmployeHandler}
          employeId={open.employeId}
          onClose={closeModalHandler}
          open={open.open}
        />
      </div>
    );
  } else if (isSuccess && selectedDepartment === 'root') {
    content = <p>Выберите подразделение</p>;
  }

  if (isLoading) {
    content = <p>Loading..</p>;
  }

  if (isError) {
    content = <p>Ошибка</p>;
  }

  return <>{content}</>;
};

export default Staff;
