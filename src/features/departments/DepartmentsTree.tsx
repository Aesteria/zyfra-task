import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  useAddDepartmentMutation,
  useChangeDepartmentOrderMutation,
  useChangeEmployeDepartmentMutation,
  useEditDepartmentMutation,
  useGetDepartmentsQuery,
  useRemoveDepartmentMutation,
} from '../api/api';
import Typography from '@mui/material/Typography';
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import { Department, DepartmentFormData } from '../../types/department';
import EditIcon from '@mui/icons-material/Edit';
import React, { SyntheticEvent, useCallback, useRef, useState } from 'react';
import AddEditDepartmentDialog from './AddEditDepartmentDialog';
import { toast } from 'react-toastify';
import IconButton from '@mui/material/IconButton';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectDepartment } from './departmentsSlice';
import { Employe } from '../../types/staff';
import { changeDragEmploye } from '../staff/staffSlice';

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
  const currentDragEmploye = useAppSelector(
    (state) => state.staff.currentDragEmploye
  );
  const [changeDepartment] = useChangeDepartmentOrderMutation();
  const [changeEmployeDepartment] = useChangeEmployeDepartmentMutation();
  const treeViewRef = useRef<HTMLLIElement | null>(null);

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
        dispatch(selectDepartment(null));
        await removeDepartment(id).unwrap();
        toast.success('Подразделение успешно удалено');
      } catch (e: any) {
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
    let target = e.target as HTMLDivElement;
    // if target is nested change target to parent
    if (!target.id) {
      target = target.parentElement as HTMLDivElement;
    }
    target.style.background = '';
  };

  const dragEndHandler = (e: React.DragEvent<HTMLDivElement>) => {
    let target = e.target as HTMLDivElement;

    // if target is nested change target to parent
    if (!target.id) {
      target = target.parentElement as HTMLDivElement;
    }

    target.style.background = '';
  };

  const dropHandler = (
    e: React.DragEvent<HTMLDivElement>,
    nodeId: string,
    employe?: Employe | null
  ) => {
    e.preventDefault();
    let target = e.target as HTMLDivElement;

    // if target is nested change target to parent
    if (!target.id) {
      target = target.parentElement as HTMLDivElement;
    }

    dispatch(changeDragEmploye(null));
    setCurrentTreeItem(null);
    target.style.background = '';

    // check if parent element in tree is trying to drop to nested children
    const isTargetParentDropInSelfNested = Boolean(
      treeViewRef?.current
        ?.querySelector(`[id=':r1:-${currentTreeItem?.id}']`)
        ?.querySelector(`[id='${target.id}']`)
    );

    // if target is the same as draggable item
    const isSameDepartment =
      currentTreeItem && target.id === currentTreeItem.id;
    const isSameEmploye = employe && target.id === employe.departmentId;
    const isSameTarget = isSameDepartment || isSameEmploye;
    const isEmployeDropInRoot = employe && target.id === 'rootDepartments';

    if (isTargetParentDropInSelfNested || isEmployeDropInRoot || isSameTarget) {
      return;
    }

    // change background to default after drop
    target.style.background = '';

    if (employe) {
      const isCurrentItemAndNotSameParent =
        currentDragEmploye && currentDragEmploye.departmentId !== nodeId;

      if (isCurrentItemAndNotSameParent) {
        dispatch(changeDragEmploye(null));

        changeEmployeDepartment({
          ...currentDragEmploye,
          departmentId: nodeId,
        });
      }
    } else {
      const isCurrentItemAndNotSameParent =
        currentTreeItem && currentTreeItem.departmentId !== nodeId;
      if (isCurrentItemAndNotSameParent) {
        setCurrentTreeItem(null);
        changeDepartment({
          ...currentTreeItem,
          departmentId: nodeId,
        });
      }
    }
  };

  const dragOverHandler = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    let target = e.target as HTMLDivElement;

    // if target is nested change target to parent
    if (!target.id) {
      target = target.parentElement as HTMLDivElement;
    }

    if (target.id === currentTreeItem?.id) {
      return;
    }

    target.style.background = 'rgb(25, 118, 210, 0.4)';
  };

  const renderTree = (nodes: Department[], parentId: string | null) => {
    const isRoot = !Boolean(parentId);
    if (isSuccess) {
      const filtered = nodes.filter((node) =>
        isRoot ? node.id === 'rootDepartments' : node.departmentId === parentId
      );
      return filtered.map((node) => (
        <TreeItem
          onFocusCapture={(e) => e.stopPropagation()}
          key={node.id}
          nodeId={node.id.toString()}
          label={
            <div
              id={node.id}
              draggable={!isRoot}
              style={{ display: 'flex', alignItems: 'center' }}
              onDragStart={(e) => dragStartHandler(e, node)}
              onDragLeave={(e) => dragLeaveHandler(e)}
              onDragEnd={(e) => dragEndHandler(e)}
              onDrop={(e) => dropHandler(e, node.id, currentDragEmploye)}
              onDragOver={(e) => dragOverHandler(e)}
            >
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
                  <DeleteIcon
                    sx={{ color: '#FC3400', pointerEvents: 'none' }}
                  />
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
        ref={treeViewRef}
      >
        {isSuccess && renderTree(departments, null)}
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
