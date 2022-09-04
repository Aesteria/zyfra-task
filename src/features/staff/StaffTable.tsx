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
const headings = [
  'ФИО',
  'Дата рождения',
  'Пол',
  'Должность',
  'Наличие водительских прав',
];

type StaffTableProps = {
  staff: Employe[];
  removeContactHandler?: (id: number) => Promise<void>;
  openEditModalHandler?: (contact: Employe) => void;
};

const StaffTable = ({
  staff,
}: // removeContactHandler,
// openEditModalHandler,
StaffTableProps) => {
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
                  // onClick={() => removeContactHandler(employe.id)}
                >
                  <DeleteIcon sx={{ color: 'red' }} />
                </IconButton>

                <IconButton
                  aria-label="edit"
                  // onClick={() => openEditModalHandler(employe)}
                >
                  <EditIcon sx={{ color: 'green' }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default StaffTable;
