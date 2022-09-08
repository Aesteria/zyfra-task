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
import Typography from '@mui/material/Typography';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { Department, DepartmentFormData } from '../../types/department';
import EditIcon from '@mui/icons-material/Edit';
import React, { SyntheticEvent, useCallback, useState } from 'react';
import AddEditDepartmentDialog from './AddEditDepartmentDialog';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import { useAppDispatch } from '../../app/hooks';
import { selectDepartment } from './departmentsSlice';

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
  const dispatch = useAppDispatch();

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

  const closeModalHandler = useCallback(() => {
    setModal({
      departmentId: null,
      isEdit: false,
      open: false,
    });
  }, []);

  const editDepartmentHandler = async (employe: Department) => {
    try {
      await editDepartment(employe);
      toast('изменения сохранены!');
    } catch (e: any) {
      console.log(e);
      toast.warn('что-то пошло не так');
    }
  };

  const addDepartmentHandler = async (departmentData: DepartmentFormData) => {
    try {
      await addDepartment({
        ...departmentData,
        createdAt: departmentData.createdAt as string,
        departmentId: modal.departmentId as string,
      });
      toast(`Подразделение ${departmentData.name} добавлено`);
    } catch (e: any) {
      console.log(e);
      toast.warn('что-то пошло не так');
    }
  };

  const addClickHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    openModalHandler(id, false);
  };

  const deleteClickHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    const removeDep = async () => {
      try {
        await removeDepartment(id);
        toast.success('Подразделение успешно удалено');
      } catch (e) {
        console.log(e);
        toast.warn('что-то пошло не так');
      }
    };

    removeDep();
  };

  const editClickHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: string
  ) => {
    e.stopPropagation();
    openModalHandler(id, true);
  };

  const renderTree = (nodes: Department[], parentId: string) => {
    if (isSuccess) {
      const filtered = nodes.filter((node) => node.departmentId === parentId);
      return filtered.map((node) => (
        <TreeItem
          key={node.id}
          nodeId={node.id.toString()}
          label={
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Typography sx={{ marginRight: '10px' }}>{node.name}</Typography>
              <IconButton
                aria-label="add"
                size="small"
                onClick={(e) => addClickHandler(e, node.id)}
              >
                <AddBoxIcon sx={{ color: '#1976d2' }} />
              </IconButton>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={(e) => deleteClickHandler(e, node.id)}
              >
                <DeleteIcon sx={{ color: '#FC3400' }} />
              </IconButton>
              <IconButton
                aria-label="edit"
                size="small"
                onClick={(e) => editClickHandler(e, node.id)}
              >
                <EditIcon sx={{ color: '#2E2C34' }} />
              </IconButton>
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
        onNodeSelect={(event: SyntheticEvent, nodeId: string) => {
          dispatch(selectDepartment(nodeId));
        }}
      >
        {isSuccess && (
          <TreeItem
            onFocusCapture={(e) => e.preventDefault()}
            nodeId="root"
            label={
              <div
                style={{ display: 'flex', alignItems: 'center' }}
                draggable="true"
              >
                <Typography sx={{ marginRight: '10px' }}>
                  Подразделения
                </Typography>
                <IconButton
                  aria-label="add"
                  size="small"
                  onClick={(e) => addClickHandler(e, 'root')}
                >
                  <AddBoxIcon sx={{ color: '#1976d2' }} />
                </IconButton>
              </div>
            }
          >
            {renderTree(departments, 'root')}
          </TreeItem>
        )}
      </TreeView>
      {modal.open && (
        <AddEditDepartmentDialog
          addDepartmentHandler={addDepartmentHandler}
          onClose={closeModalHandler}
          departmentId={modal.departmentId}
          editDepartmentHandler={editDepartmentHandler}
          open={modal.open}
          isEdit={modal.isEdit}
        />
      )}
    </>
  );
};

export default DepartmentsTree;
