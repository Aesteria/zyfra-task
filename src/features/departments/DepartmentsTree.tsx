import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  useAddDepartmentMutation,
  useChangeDepartmentOrderMutation,
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
  const [currentTreeItem, setCurrentTreeItem] = useState<Department | null>(
    null
  );
  const [changeDepartment] = useChangeDepartmentOrderMutation();

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

  const dragStartHandler = (
    e: React.DragEvent<HTMLDivElement>,
    node: Department
  ) => {
    setCurrentTreeItem(node);
  };

  const dragLeaveHandler = (e: React.DragEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    target.style.background = '';
  };

  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
    console.log(e.target);
    const target = e.target as HTMLDivElement;
    target.style.background = '';
  };

  const dropHandler = (e: React.DragEvent<HTMLDivElement>, nodeId: string) => {
    console.log('drop', e.target);
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    if (target.id === currentTreeItem?.id) {
      return;
    }

    if (!target.id) {
      const parent = target.parentElement as HTMLDivElement;
      parent.style.background = '';
    } else {
      target.style.background = '';
    }

    const isCurrentItemAndNotSameParent =
      currentTreeItem && currentTreeItem.departmentId !== nodeId;
    if (isCurrentItemAndNotSameParent) {
      changeDepartment({
        ...currentTreeItem,
        departmentId: nodeId,
      });
    }
  };

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    if (target.id === currentTreeItem?.id) {
      return;
    }

    // if target element is nested change parentElement background
    if (!target.id) {
      const parent = target.parentElement as HTMLDivElement;
      parent.style.background = 'rgb(25, 118, 210, 0.4)';
    } else {
      target.style.background = 'rgb(25, 118, 210, 0.4)';
    }
  };

  const renderTree = (nodes: Department[], parentId: string) => {
    if (isSuccess) {
      const filtered = nodes.filter((node) => node.departmentId === parentId);
      return filtered.map((node) => (
        <TreeItem
          onFocusCapture={(e) => e.stopPropagation()}
          key={node.id}
          nodeId={node.id.toString()}
          label={
            <div
              id={node.id}
              draggable
              style={{ display: 'flex', alignItems: 'center' }}
              onDragStart={(e) => dragStartHandler(e, node)}
              onDragLeave={(e) => dragLeaveHandler(e)}
              onDragEnd={(e) => dragEndHandler(e)}
              onDrop={(e) => dropHandler(e, node.id)}
              onDragOver={(e) => dragOverHandler(e)}
            >
              <Typography sx={{ marginRight: '10px' }}>{node.name}</Typography>
              <IconButton
                aria-label="add"
                size="small"
                onClick={(e) => addClickHandler(e, node.id)}
              >
                <AddBoxIcon sx={{ color: '#1976d2', pointerEvents: 'none' }} />
              </IconButton>
              <IconButton
                aria-label="delete"
                size="small"
                onClick={(e) => deleteClickHandler(e, node.id)}
              >
                <DeleteIcon sx={{ color: '#FC3400', pointerEvents: 'none' }} />
              </IconButton>
              <IconButton
                aria-label="edit"
                size="small"
                onClick={(e) => editClickHandler(e, node.id)}
              >
                <EditIcon sx={{ color: '#2E2C34', pointerEvents: 'none' }} />
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
            onFocusCapture={(e) => e.stopPropagation()}
            nodeId="root"
            sx={{ userSelect: 'none' }}
            label={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragEnd={(e) => dragEndHandler(e)}
                onDrop={(e) => dropHandler(e, 'root')}
                onDragOver={(e) => dragOverHandler(e)}
                id="root"
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
