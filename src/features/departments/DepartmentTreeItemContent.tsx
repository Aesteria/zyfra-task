import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { Department } from '../../types/department';

type DepartmentTreeItemContentProps = {
  node: Department;
  isRoot: boolean;
  addClickHandler: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void;
  deleteClickHandler: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void;
  editClickHandler: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => void;
};

const DepartmentTreeItemContent = ({
  node,
  isRoot,
  addClickHandler,
  deleteClickHandler,
  editClickHandler,
}: DepartmentTreeItemContentProps) => {
  return (
    <>
      <Typography sx={{ marginRight: '10px', userSelect: 'none' }}>
        {node.name}
      </Typography>
      <IconButton
        aria-label="add"
        size="small"
        onClick={(e) => addClickHandler(e, node.id)}
      >
        <AddBoxIcon sx={{ color: '#1976d2', pointerEvents: 'none' }} />
      </IconButton>
      {!isRoot && (
        <IconButton
          aria-label="delete"
          size="small"
          onClick={(e) => deleteClickHandler(e, node.id)}
        >
          <DeleteIcon sx={{ color: '#FC3400', pointerEvents: 'none' }} />
        </IconButton>
      )}
      {!isRoot && (
        <IconButton
          aria-label="edit"
          size="small"
          onClick={(e) => editClickHandler(e, node.id)}
        >
          <EditIcon sx={{ color: '#2E2C34', pointerEvents: 'none' }} />
        </IconButton>
      )}
    </>
  );
};

export default DepartmentTreeItemContent;
