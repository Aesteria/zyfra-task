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
import Button from '@mui/material/Button';
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

const StaffTable = ({
  staff,
  removeEmployeHandler,
  openModalHandler,
}: StaffTableProps) => {
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
            <TableRow
              key={employe.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {employe.name}
              </TableCell>
              <TableCell>{employe.birthDate}</TableCell>
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

                <Button variant="outlined">Изменить отдел</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StaffTable;
