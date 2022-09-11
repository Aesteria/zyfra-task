import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useAppSelector } from '../../app/hooks';
import Spinner from '../../components/ui/Spinner';
import { useGetDepartmentByIdQuery } from '../api/api';

const DepartmentInfo = () => {
  const selectedDepartment = useAppSelector(
    (state) => state.departments.selected
  );

  const {
    data: department,
    isFetching,
    isSuccess,
    isError,
    error,
  } = useGetDepartmentByIdQuery(selectedDepartment as string, {
    skip: selectedDepartment === null,
  });

  let content;

  if (isFetching) {
    content = <Spinner />;
  } else if (isSuccess) {
    content = (
      <>
        <Typography variant="h5" component="h2">
          Название отдела: {department.name}
        </Typography>
        <Typography sx={{ marginBottom: '25px' }}>
          Описание: {department.description}
        </Typography>
        <Typography sx={{ marginBottom: '25px' }}>
          Дата формирования: {dayjs(department.createdAt).format('DD/MM/YYYY')}
        </Typography>
      </>
    );
  } else if (isError) {
    if ('data' in error) {
      content = (
        <Alert severity="error">Ошибка. Статус ошибки: {error.status}</Alert>
      );
    }
  }

  return (
    <div style={{ marginBottom: '15px', minHeight: '110px' }}>{content}</div>
  );
};

export default DepartmentInfo;
