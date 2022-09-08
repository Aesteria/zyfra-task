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
import { toast } from 'react-toastify';

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
  const [modal, setModal] = useState<EditModalState>({
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
    return staff.filter((item) => item.departmentId === selectedDepartment);
  }, [staff, selectedDepartment]);

  const openModalHandler = (id?: string) => {
    if (id) {
      setModal({
        open: true,
        employeId: id,
      });
    } else {
      setModal({
        open: true,
        employeId: null,
      });
    }
  };

  const closeModalHandler = () => {
    setModal({
      employeId: null,
      open: false,
    });
  };

  const addEmployeHandler = async (employeData: EmployeFormData) => {
    try {
      await addEmploye({
        ...employeData,
        birthDate: employeData.birthDate as string,
        departmentId: selectedDepartment as string,
      });
      toast('сотрудник успешно добавлен');
    } catch (e: any) {
      console.log(e);
      toast.warn('что-то пошло не так');
    }
  };

  const removeEmployeHandler = async (id: string) => {
    try {
      await removeEmploye(id);
      toast('сотрудник успешно удален');
    } catch (e: any) {
      console.log(e);
      toast.warn('что-то пошло не так');
    }
  };

  const editEmployeHandler = async (employe: Employe) => {
    try {
      await editEmploye(employe);
      closeModalHandler();
      toast('изменения сохранены');
    } catch (e: any) {
      console.log(e);
      toast.warn('что-то пошло не так');
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
        {modal.open && (
          <AddEditEmployeDialog
            addEmployeHandler={addEmployeHandler}
            editEmployeHandler={editEmployeHandler}
            employeId={modal.employeId}
            onClose={closeModalHandler}
            open={modal.open}
          />
        )}
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
