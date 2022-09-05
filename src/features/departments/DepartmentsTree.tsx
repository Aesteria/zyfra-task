import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Divider from '@mui/material/Divider';
import { useGetDepartmentsQuery } from '../api/api';
import Toolbar from '@mui/material/Toolbar';
import { Link } from 'react-router-dom';

type RenderTree = {
  id: string | number;
  name: string;
  children?: readonly RenderTree[];
};

const DepartmentsTree = () => {
  const { data: departments, isSuccess, isLoading } = useGetDepartmentsQuery();

  const departmentsTree = (nodes: RenderTree) => {
    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id.toString()}
        label={
          <Link
            style={{
              display: 'block',
              color: 'inherit',
              textDecoration: 'none',
            }}
            to={`/departments/${nodes.id}`}
          >
            {nodes.name}
          </Link>
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => departmentsTree(node))
          : null}
      </TreeItem>
    );
  };

  const content = isSuccess && (
    <TreeView
      aria-label="department navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {departmentsTree({
        id: 'root',
        name: 'Подразделения',
        children: departments,
      })}
    </TreeView>
  );

  return (
    <div>
      <Toolbar />
      <Divider />
      {isLoading && <p>Loading...</p>}
      {isSuccess && content}
    </div>
  );
};

export default DepartmentsTree;
