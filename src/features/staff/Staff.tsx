import Button from '@mui/material/Button';
import { useMemo, useState } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Employe, EmployeFormData } from '../../types/staff';
import StaffTable from './StaffTable';
import {
  useAddNewEmployeMutation,
  useEditEmployeeMutation,
  useGetDepartmentByIdQuery,
  useGetStaffQuery,
  useRemoveEmployeeMutation,
} from '../api/api';
import AddEditEmployeDialog from './AddEditEmployeDialog';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../app/hooks';
import Typography from '@mui/material/Typography';

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
  const selectedDepartment = useAppSelector(
    (state) => state.departments.selected
  );
  const { data: department } = useGetDepartmentByIdQuery(
    selectedDepartment as string,
    {
      skip: selectedDepartment === 'root' || selectedDepartment === null,
    }
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
  const showTable =
    isSuccess && selectedDepartment && selectedDepartment !== 'root';
  const showPrompt =
    isSuccess && (!selectedDepartment || selectedDepartment === 'root');

  if (showTable) {
    content = (
      <div>
        <Typography variant="h5" component="h2">
          Название отдела: {department?.name}
        </Typography>
        <Typography sx={{ marginBottom: '25px' }}>
          Описание: {department?.description}
        </Typography>
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
  } else if (showPrompt) {
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
