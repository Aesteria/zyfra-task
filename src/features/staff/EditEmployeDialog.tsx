import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { genders } from '../../constants/genders';
import { Employe, EmployeFormData } from '../../types/staff';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import { useEffect } from 'react';

const schema = yup
  .object({
    name: yup.string().required('Необходимо указать имя'),
    gender: yup.string().required('Необходимо указать пол'),
    position: yup.string().required('Необходимо указать должность'),
    birthDate: yup
      .date()
      .required('Необходимо указать дату рождения')
      .typeError('Некорректная дата рождения'),
  })
  .required();

type EditContactDialogProps = {
  open: boolean;
  onClose: () => void;
  editEmployeHandler: (employeData: Employe) => Promise<void>;
  employe: Employe | null;
};

const EditEmployeDialog = ({
  open,
  editEmployeHandler,
  employe,
  onClose,
}: EditContactDialogProps) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      birthDate: '',
      gender: 'мужской',
      position: '',
      driversLicense: false,
    } as EmployeFormData,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (employe) {
      setValue('name', employe.name);
      setValue('birthDate', employe.birthDate);
      setValue('driversLicense', employe.driversLicense);
      setValue('gender', employe.gender);
      setValue('position', employe.position);
    }
  }, [employe, setValue]);

  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Добавить работника</DialogTitle>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit((data) => {
          console.log(data);
          if (employe) {
            const formattedBirthDate = dayjs(data.birthDate).format(
              'DD/MM/YYYY'
            );
            editEmployeHandler({
              ...data,
              id: employe.id,
              department: employe.department,
              birthDate: formattedBirthDate,
            });
          }
        })}
      >
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
                    control={
                      <Checkbox
                        onChange={onChange}
                        value={value}
                        checked={value}
                      />
                    }
                    label="Есть водительские права"
                  />
                </FormGroup>
              </FormGroup>
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} type="button">
            Выйти
          </Button>
          <Button type="submit">Сохранить изменения</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default EditEmployeDialog;
