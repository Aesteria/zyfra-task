import TreeItem from '@mui/lab/TreeItem';
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
  useAddDepartmentMutation,
  useGetDepartmentsQuery,
  useRemoveDepartmentMutation,
} from '../api/api';
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';

type RenderTree = {
  id: string;
  name: string;
  departmentId: string;
};

const DepartmentsTree = () => {
  const { data: departments, isSuccess } = useGetDepartmentsQuery();
  const [addDepartment] = useAddDepartmentMutation();
  const [removeDepartment] = useRemoveDepartmentMutation();

  let navigate = useNavigate();

  const renderTree = (nodes: RenderTree[], parentId: string) => {
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
              <Typography>{node.name}</Typography>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addDepartment({
                    name: 'DEVOPS',
                    departmentId: node.id,
                  });
                }}
              >
                add
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeDepartment(node.id);
                }}
              >
                remove
              </button>
            </div>
          }
        >
          {renderTree(departments, node.id)}
        </TreeItem>
      ));
    }
  };

  return (
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
              <Typography>Подразделения</Typography>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addDepartment({
                    name: 'DEVOPS',
                    departmentId: 'root',
                  });
                }}
              >
                add
              </button>
            </div>
          }
        >
          {renderTree(departments, 'root')}
        </TreeItem>
      )}
    </TreeView>
  );
};

export default DepartmentsTree;
