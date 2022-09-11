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
import { Department, DepartmentFormData } from '../../types/department';
import React, { SyntheticEvent, useCallback, useRef, useState } from 'react';
import AddEditDepartmentDialog from './AddEditDepartmentDialog';
import { toast } from 'react-toastify';
import { useAppDispatch } from '../../app/hooks';
import { selectDepartment } from './departmentsSlice';
import DraggableTreeItem from './DraggableTreeItem';
import DepartmentTreeItemContent from './DepartmentTreeItemContent';

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
  const treeViewRef = useRef<HTMLLIElement | null>(null);
  const [currentTreeItem, setCurrentTreeItem] = useState<Department | null>(
    null
  );

  const changeCurrentTreeItem = (node: Department | null) => {
    setCurrentTreeItem(node);
  };

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
      await editDepartment(employe).unwrap();
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
      }).unwrap();
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
            <DraggableTreeItem
              isRoot={isRoot}
              node={node}
              treeView={treeViewRef}
              changeCurrentTreeItem={changeCurrentTreeItem}
              currentTreeItem={currentTreeItem}
            >
              <DepartmentTreeItemContent
                addClickHandler={addClickHandler}
                deleteClickHandler={deleteClickHandler}
                editClickHandler={editClickHandler}
                isRoot={isRoot}
                node={node}
              />
            </DraggableTreeItem>
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
        onNodeSelect={(_: SyntheticEvent, nodeId: string) => {
          // if its root then set to null, because we dont need staff data on root
          if (nodeId !== 'rootDepartments') {
            dispatch(selectDepartment(nodeId));
          } else {
            dispatch(selectDepartment(null));
          }
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
