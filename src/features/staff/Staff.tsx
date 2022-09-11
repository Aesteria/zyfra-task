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
import AddEditEmployeDialog from './AddEditEmployeDialog';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../app/hooks';
import Spinner from '../../components/ui/Spinner';
import Alert from '@mui/material/Alert';
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
    error,
  } = useGetStaffQuery();
  const [modal, setModal] = useState<EditModalState>({
    employeId: null,
    open: false,
  });

  const [addEmploye] = useAddNewEmployeMutation();
  const [removeEmploye] = useRemoveEmployeeMutation();
  const [editEmploye] = useEditEmployeeMutation();
  const selectedDepartment = useAppSelector(
    (state) => state.departments.selected
  );

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
      }).unwrap();
      toast('сотрудник успешно добавлен');
    } catch (e: any) {
      console.log(e);
      toast.warn('что-то пошло не так');
    }
  };

  const removeEmployeHandler = async (id: string) => {
    try {
      await removeEmploye(id).unwrap();
      toast('сотрудник успешно удален');
    } catch (e: any) {
      console.log(e);
      toast.warn('что-то пошло не так');
    }
  };

  const editEmployeHandler = async (employe: Employe) => {
    try {
      await editEmploye(employe).unwrap();
      closeModalHandler();
      toast('изменения сохранены');
    } catch (e: any) {
      console.log(e);
      toast.warn('что-то пошло не так');
    }
  };

  let content;
  const showTable = isSuccess && selectedDepartment;

  if (isLoading) {
    content = <Spinner />;
  } else if (showTable) {
    content = (
      <div>
        <Button
          variant="contained"
          startIcon={<AddCircleIcon />}
          size="large"
          onClick={() => openModalHandler()}
        >
          Добавить сотрудника
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
  } else if (isError) {
    if ('data' in error) {
      content = (
        <Alert severity="error">Ошибка. Статус ошибки: {error.status}</Alert>
      );
    }
  }

  return <>{content}</>;
};

export default Staff;
