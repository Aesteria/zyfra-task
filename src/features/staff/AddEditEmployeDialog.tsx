import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { Employe, EmployeFormData } from '../../types/staff';
import { useGetEmployeByIdQuery } from '../api/api';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller } from 'react-hook-form';
import { genders } from '../../constants/genders';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import dayjs from 'dayjs';

type AddEditEmployeDialogProps = {
  employeId: string | null;
  editEmployeHandler: (employeData: Employe) => Promise<void>;
  addEmployeHandler: (employeData: EmployeFormData) => Promise<void>;
  open: boolean;
  onClose: () => void;
};

const initialState: EmployeFormData = {
  birthDate: new Date('1996').toString(),
  driversLicense: false,
  gender: 'мужской',
  name: '',
  position: '',
};

const AddEditEmployeDialog = ({
  employeId,
  editEmployeHandler,
  addEmployeHandler,
  open,
  onClose,
}: AddEditEmployeDialogProps) => {
  const isAddMode = !employeId;

  const validationSchema = yup
    .object({
      name: yup.string().required('Необходимо указать имя'),
      gender: yup.string().required('Необходимо указать пол'),
      position: yup.string().required('Необходимо указать должность'),
      birthDate: yup
        .date()
        .test(
          'birthDate',
          'Возраст не больше 80 и не меньше 18 лет',
          (value) => {
            return (
              dayjs(new Date()).diff(value, 'year') >= 18 &&
              dayjs(new Date()).diff(value, 'year') < 80
            );
          }
        )
        .required('Необходимо указать дату рождения')
        .typeError('Некорректная дата рождения'),
    })
    .required();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<EmployeFormData>({
    resolver: yupResolver(validationSchema),
    defaultValues: initialState,
  });

  const { data: employe, isSuccess } = useGetEmployeByIdQuery(
    employeId as string,
    {
      skip: isAddMode,
    }
  );

  const onSubmit = (data: EmployeFormData) => {
    return isAddMode
      ? addEmployeHandler({ ...data })
      : isSuccess &&
          editEmployeHandler({
            ...data,
            id: employe.id,
            departmentId: employe.departmentId,
            birthDate: data.birthDate,
          });
  };

  useEffect(() => {
    if (isSuccess) {
      const fields = [
        'name',
        'gender',
        'position',
        'birthDate',
        'driversLicense',
      ];
      fields.forEach((field) => {
        setValue(
          field as keyof EmployeFormData,
          employe[field as keyof EmployeFormData]
        );
      });
    }
  }, [employe, isSuccess, setValue]);

  return (
    <Dialog
      onClose={() => {
        onClose();
      }}
      open={open}
    >
      <DialogTitle>Добавить работника</DialogTitle>
      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Controller
            name="gender"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                id="select-gender"
                select
                label="Пол"
                value={value}
                onChange={onChange}
                error={errors.hasOwnProperty('gender')}
                helperText={errors.gender?.message}
                sx={{ marginBottom: '15px' }}
              >
                {genders.map((option, index) => (
                  <MenuItem key={index} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
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
                label="Имя"
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
            name="position"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                value={value}
                autoFocus
                onChange={onChange}
                margin="dense"
                id="position"
                label="Должность"
                type="text"
                fullWidth
                variant="outlined"
                error={errors.hasOwnProperty('position')}
                helperText={errors.position?.message}
                sx={{ marginBottom: '20px' }}
              />
            )}
          />
          <Controller
            name="birthDate"
            control={control}
            render={({ field: { onChange, value } }) => (
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale="ru"
              >
                <DatePicker
                  inputFormat={'DD/MM/YYYY'}
                  label="Введите дату рождения"
                  value={value}
                  minDate={'01/01/1942'}
                  maxDate={'01/01/2004'}
                  onChange={onChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      id="birthDate"
                      error={errors.hasOwnProperty('birthDate')}
                      helperText={errors.birthDate?.message}
                      sx={{ marginBottom: '20px' }}
                    />
                  )}
                />
              </LocalizationProvider>
            )}
          />
          <Controller
            name="driversLicense"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormGroup>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox onChange={onChange} checked={value} />}
                    label="Есть водительские права"
                  />
                </FormGroup>
              </FormGroup>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} type="button">
            Отмена
          </Button>
          <Button type="submit">
            {isAddMode ? 'Добавить работника' : 'Сохранить изменения'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AddEditEmployeDialog;
