import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableContainer from '@mui/material/TableContainer';
import IconButton from '@mui/material/IconButton';
import TableRow from '@mui/material/TableRow';
import { Employe } from '../../types/staff';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { useAppDispatch } from '../../app/hooks';
import { changeDragEmploye } from './staffSlice';
const headings = [
  'ФИО',
  'Дата рождения',
  'Пол',
  'Должность',
  'Наличие водительских прав',
];

type StaffTableProps = {
  staff: Employe[];
  removeEmployeHandler: (id: string) => Promise<void>;
  openModalHandler: (id?: string) => void;
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const StaffTable = ({
  staff,
  removeEmployeHandler,
  openModalHandler,
}: StaffTableProps) => {
  const dispatch = useAppDispatch();
  return (
    <TableContainer>
      <Table sx={{ width: 1150 }} aria-label="table">
        <TableHead>
          <TableRow>
            {headings.map((heading, index) => (
              <TableCell key={index}>{heading}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {staff.map((employe) => (
            <StyledTableRow
              key={employe.id}
              draggable
              onDragStart={(e) => {
                dispatch(changeDragEmploye(employe));
              }}
            >
              <TableCell component="th" scope="row">
                {employe.name}
              </TableCell>
              <TableCell>
                {dayjs(employe.birthDate).format('DD/MM/YYYY')}
              </TableCell>
              <TableCell>{employe.gender}</TableCell>
              <TableCell>{employe.position}</TableCell>
              <TableCell>{employe.driversLicense ? 'есть' : 'нет'}</TableCell>
              <TableCell>
                <IconButton
                  aria-label="delete"
                  onClick={() => removeEmployeHandler(employe.id)}
                >
                  <DeleteIcon sx={{ color: 'red' }} />
                </IconButton>

                <IconButton
                  aria-label="edit"
                  onClick={() => openModalHandler(employe.id)}
                >
                  <EditIcon sx={{ color: 'green' }} />
                </IconButton>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StaffTable;
