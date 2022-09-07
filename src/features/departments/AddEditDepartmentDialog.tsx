import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useGetDepartmentByIdQuery } from '../api/api';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller } from 'react-hook-form';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Box from '@mui/material/Box';
import { Department, DepartmentFormData } from '../../types/department';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

type AddEditDepartmentDialogProps = {
  departmentId: string | null;
  editDepartmentHandler: (departmentData: Department) => Promise<void>;
  addDepartmentHandler: (departmentData: DepartmentFormData) => Promise<void>;
  open: boolean;
  onClose: () => void;
  isEdit: boolean;
};

const initialState: DepartmentFormData = {
  name: '',
  createdAt: new Date().toString(),
  description: '',
};

const AddEditDepartmentDialog = ({
  addDepartmentHandler,
  departmentId,
  editDepartmentHandler,
  onClose,
  open,
  isEdit,
}: AddEditDepartmentDialogProps) => {
  const isAddMode = !isEdit;
  const validationSchema = yup
    .object({
      name: yup.string().required('Укажите название подразделения'),
      createdAt: yup
        .date()
        .required('Необходимо указать пол')
        .typeError('Некорректная дата формирования'),
      description: yup.string().required('Необходимо указать описание'),
    })
    .required();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitSuccessful },
    reset,
  } = useForm<DepartmentFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialState,
  });

  const { data: department, isSuccess } = useGetDepartmentByIdQuery(
    departmentId as string,
    {
      skip: isAddMode,
    }
  );

  const onSubmit = (data: DepartmentFormData) => {
    return isAddMode
      ? addDepartmentHandler({ ...data })
      : isSuccess &&
          editDepartmentHandler({
            ...data,
            id: department.id,
            departmentId: department.departmentId,
          });
  };

  useEffect(() => {
    if (isSuccess) {
      const fields = ['name', 'createdAt', 'description'];
      fields.forEach((field) =>
        setValue(
          field as keyof DepartmentFormData,
          department[field as keyof DepartmentFormData]
        )
      );
    }
  }, [department, isSuccess, setValue]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset(initialState);
      onClose();
    }
  }, [isSubmitSuccessful, reset, onClose]);

  return (
    <Dialog
      onClose={() => {
        onClose();
        reset(initialState);
      }}
      open={open}
    >
      <DialogTitle>
        {isAddMode ? 'Добавить Подразделение' : 'Изменить подразделение'}
      </DialogTitle>
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="name"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                value={value}
                autoFocus
                onChange={onChange}
                margin="dense"
                id="name"
                label="Подразделение"
                type="text"
                fullWidth
                variant="outlined"
                error={errors.hasOwnProperty('name')}
                helperText={errors.name?.message}
                sx={{ marginBottom: '15px' }}
              />
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                value={value}
                autoFocus
                onChange={onChange}
                margin="dense"
                id="description"
                label="Описание"
                type="text"
                fullWidth
                variant="outlined"
                error={errors.hasOwnProperty('description')}
                helperText={errors.description?.message}
                sx={{ marginBottom: '15px' }}
              />
            )}
          />
          <Controller
            name="createdAt"
            control={control}
            render={({ field: { onChange, value } }) => (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  inputFormat={'DD/MM/YYYY'}
                  label="Дата создания"
                  value={value}
                  onChange={onChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="createdAt"
                      error={errors.hasOwnProperty('createdAt')}
                      helperText={errors.createdAt?.message}
                      sx={{ marginBottom: '20px' }}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} type="button">
            Отмена
          </Button>
          <Button type="submit">
            {isAddMode ? 'Добавить Подразделение' : 'Сохранить изменения'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddEditDepartmentDialog;
