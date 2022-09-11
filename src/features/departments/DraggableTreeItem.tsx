import { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Department } from '../../types/department';
import { Employe } from '../../types/staff';
import {
  useChangeDepartmentOrderMutation,
  useChangeEmployeDepartmentMutation,
} from '../api/api';
import { changeDragEmploye } from '../staff/staffSlice';

type DraggableTreeItemProps = {
  children: ReactNode;
  treeView: React.MutableRefObject<HTMLLIElement | null>;
  node: Department;
  isRoot: boolean;
  changeCurrentTreeItem: (node: Department | null) => void;
  currentTreeItem: Department | null;
};

const DraggableTreeItem = ({
  children,
  treeView,
  node,
  isRoot,
  changeCurrentTreeItem,
  currentTreeItem,
}: DraggableTreeItemProps) => {
  const currentDragEmploye = useAppSelector(
    (state) => state.staff.currentDragEmploye
  );

  const dispatch = useAppDispatch();
  const [changeDepartment] = useChangeDepartmentOrderMutation();
  const [changeEmployeDepartment] = useChangeEmployeDepartmentMutation();

  const dragStartHandler = (
    e: React.DragEvent<HTMLDivElement>,
    node: Department
  ) => {
    changeCurrentTreeItem(node);
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
    changeCurrentTreeItem(null);
    target.style.background = '';

    // check if parent element in tree is trying to drop to nested children
    const isTargetParentDropInSelfNested = Boolean(
      treeView?.current
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
        changeCurrentTreeItem(null);
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

  return (
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
      {children}
    </div>
  );
};

export default DraggableTreeItem;
