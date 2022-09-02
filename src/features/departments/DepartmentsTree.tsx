import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import TreeItem from '@mui/lab/TreeItem';
import Divider from '@mui/material/Divider';
import { useGetDepartmentsQuery } from '../api/api';
import Toolbar from '@mui/material/Toolbar';

type RenderTree = {
  id: string;
  name: string;
  children?: readonly RenderTree[];
};

const DepartmentsTree = () => {
  const { data: departments, isSuccess, isLoading } = useGetDepartmentsQuery();

  const departmentsTree = (nodes: RenderTree) => (
    <TreeItem key={nodes.id} nodeId={nodes.id} label={nodes.name}>
      {Array.isArray(nodes.children)
        ? nodes.children.map((node) => departmentsTree(node))
        : null}
    </TreeItem>
  );

  const content = isSuccess && (
    <TreeView
      aria-label="department navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      {departmentsTree(departments)}
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
