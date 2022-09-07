import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  useAddDepartmentMutation,
  useEditDepartmentMutation,
  useGetDepartmentsQuery,
  useRemoveDepartmentMutation,
} from '../api/api';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { Department, DepartmentFormData } from '../../types/department';
import EditIcon from '@mui/icons-material/Edit';
import { useState } from 'react';
import AddEditDepartmentDialog from './AddEditDepartmentDialog';

type EditModalState = {
  departmentId: string | null;
  open: boolean;
  isEdit: boolean;
};

const DepartmentsTree = () => {
  const { data: departments, isSuccess } = useGetDepartmentsQuery();
  const [addDepartment] = useAddDepartmentMutation();
  const [removeDepartment] = useRemoveDepartmentMutation();
  const [editDepartment] = useEditDepartmentMutation();
  const [modal, setModal] = useState<EditModalState>({
    departmentId: null,
    open: false,
    isEdit: false,
  });

  const openModalHandler = (id: string, edit: boolean) => {
    if (id) {
      setModal({
        open: true,
        departmentId: id,
        isEdit: edit,
      });
    } else {
      setModal({
        open: true,
        departmentId: id,
        isEdit: edit,
      });
    }
  };

  const closeModalHandler = () => {
    setModal((prevState) => ({ ...prevState, open: false }));
  };

  const editDepartmentHandler = async (employe: Department) => {
    try {
      await editDepartment(employe);
      console.log('Succesfully edit department');
    } catch (e: any) {
      console.log(e);
    }
  };

  const addDepartmentHandler = async (departmentData: DepartmentFormData) => {
    try {
      await addDepartment({
        ...departmentData,
        createdAt: departmentData.createdAt as string,
        departmentId: modal.departmentId as string,
      });
    } catch (e: any) {
      console.log(e);
    }
  };

  let navigate = useNavigate();

  const renderTree = (nodes: Department[], parentId: string) => {
    if (isSuccess) {
      const filtered = nodes.filter((node) => node.departmentId === parentId);
      return filtered.map((node) => (
        <TreeItem
          onClick={() => {
            navigate(`/departments/${node.id}`);
          }}
          key={node.id}
          nodeId={node.id.toString()}
          label={
            <div style={{ display: 'flex' }}>
              <Typography sx={{ marginRight: '10px' }}>{node.name}</Typography>
              <AddBoxIcon
                onClick={(e) => {
                  e.stopPropagation();
                  openModalHandler(node.id, false);
                }}
              />
              <DeleteIcon
                onClick={(e) => {
                  e.stopPropagation();
                  removeDepartment(node.id);
                }}
              />
              <EditIcon
                onClick={(e) => {
                  e.stopPropagation();
                  openModalHandler(node.id, true);
                }}
              />
            </div>
          }
        >
          {renderTree(departments, node.id)}
        </TreeItem>
      ));
    }
  };

  return (
    <>
      <TreeView
        aria-label="department navigator"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
      >
        {isSuccess && (
          <TreeItem
            nodeId="root"
            onClick={() => {
              navigate('/departments/root');
            }}
            label={
              <div style={{ display: 'flex' }}>
                <Typography sx={{ marginRight: '10px' }}>
                  Подразделения
                </Typography>
                <AddBoxIcon
                  onClick={(e) => {
                    e.stopPropagation();
                    openModalHandler('root', false);
                  }}
                />
              </div>
            }
          >
            {renderTree(departments, 'root')}
          </TreeItem>
        )}
      </TreeView>
      <AddEditDepartmentDialog
        addDepartmentHandler={addDepartmentHandler}
        onClose={closeModalHandler}
        departmentId={modal.departmentId}
        editDepartmentHandler={editDepartmentHandler}
        open={modal.open}
        isEdit={modal.isEdit}
      />
    </>
  );
};

export default DepartmentsTree;
