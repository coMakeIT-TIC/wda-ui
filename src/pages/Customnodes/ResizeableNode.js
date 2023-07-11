import { memo } from "react";
import { Handle, Position, NodeResizer } from "reactflow";

const ResizableNode = ({ data, selected }) => {
  return (
    <div >
      <NodeResizer nodeId={data.id} isVisible = {selected} minWidth={100} minHeight={30} />
      <Handle type="target" position={Position.Top} />
      <div  style={{ padding: 10,textAlign:'center'}} >{data.label}</div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(ResizableNode);