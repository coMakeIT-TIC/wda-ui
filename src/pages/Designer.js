import React, { useState, useRef, useCallback,useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
updateEdge

} from 'reactflow';
import { Button } from '@chakra-ui/core';
import 'reactflow/dist/style.css';

import Sidebar from './../components/Sidebar';
import MyModal from '../components/Modal/MyModal';
import ColorSelectorNode from './../components/ColorSelectorNode';
import "./../App.css"

let application_id = 2;
let database_id = 1;
let totalnodes = 1
const getId = (type='') =>{
      if( type === 'Application')
        return `Application_${application_id++}`
      else if ( type === 'Database')
        return `Database_${database_id++}`
      else if ( type === 'Authentication')
        return 'Authentication_1'
      else if ( type === 'Deployment')
        return 'Deployment_1'
    return 'Id'
}
const nodeTypes = {
  selectorNode: ColorSelectorNode,
};


const Designer = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [nodeMap,setNodeMap] = useState(new Map())
  console.log("Nodes",nodes)
  
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  console.log("Edges",edges)  
  console.log('NodeMap',nodeMap)
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [Isopen,setopen]=useState(false);
  const edgeUpdateSuccessful = useRef(true);

  const onConnect = useCallback((params) => {
    console.log("Connect ",params)
    setEdges((eds) => addEdge(params, eds))}
    , []);

  const onEdgeUpdateStart = useCallback(() => {
    edgeUpdateSuccessful.current = false;
  }, []);

  const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
    edgeUpdateSuccessful.current = true;
    setEdges((els) => updateEdge(oldEdge, newConnection, els));
  }, []);

  const onEdgeUpdateEnd = useCallback((_, edge) => {
    if (!edgeUpdateSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeUpdateSuccessful.current = true;
  }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);
  const handleSubmit = () => console.log("Submitted");

  const image = '../assets/pstgrc.jpeg';

  

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      console.log(event)
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const name = event.dataTransfer.getData('Name')

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(name),
        type,
        position,
        data: { label: name },
       style: { border: "1px solid", padding: "4px 4px" },
      };

      setNodeMap((prev)=>new Map(prev.set(newNode.id,totalnodes++)))
      setNodes((nds) => nds.concat(newNode));

    },
    [reactFlowInstance]
  );

  const onclick = (e)=>{
    const Id= e.target.dataset.id
    console.log(Id)
    if(Id){
      setopen(Id)
      // let index = nodeMap.get(Id)
      // let CurrentNode = nodes[index].data
      // console.log(CurrentNode)
      // console.log(document.getElementById("appname"))
      // =CurrentNode.label
    }
    
  }

  const onChange = (e) => {
    console.log("object",e.target.dataset.id)
    const Name= document.getElementById("appname").value;
    const Framework= document.getElementById("framework").value;
    const PackageName= document.getElementById("packagename").value;
    const ServerPort= document.getElementById("serverport").value;
    const ApplicationType= document.getElementById("apptype").value;
    console.log(Name,Framework,PackageName,ServerPort,ApplicationType)
    console.log("Nodes",nodes)
    console.log(Isopen)

    let UpdatedNodes=[...nodes]
    let index = nodeMap.get(Isopen)
    let CurrentNode = UpdatedNodes[index]
    console.log(CurrentNode)
    CurrentNode.data={...CurrentNode.data,Framework:Framework,label:Name,PackageName:PackageName,ServerPort:ServerPort,ApplicationType:ApplicationType}
    UpdatedNodes[index]=CurrentNode
    setNodes(UpdatedNodes)

    setopen(false)
  }

  useEffect(()=>{
    setNodes([
      {
            id: 'Application_1',
            type: 'input',
            data: { label: 'Application',onChange:onChange},
           style: { border: "1px solid", padding: "4px 4px" },
            position: { x: 250, y: 5 },
          },
          // {
          //   id: '2',
          //   type: 'selectorNode',
          //   data: { onChange: onChange, database: image },
          //   style: { border: '1px solid #777', padding: 10 },
          //   position: { x: 300, y: 50 },
          // },
    ])
    setNodeMap((prev)=>new Map(prev.set('Application_1',0)))
    
  },[])


  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onClick={onclick}
            fitView
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
          >
            {/* <MiniMap
        nodeStrokeColor={(n) => {
          
          if (n.type === 'selectorNode') return image;
        
        }}
        nodeColor={(n) => {
          if (n.type === 'selectorNode') return image;
          return '#fff';
        }}
      /> */}
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar />
      { Isopen &&  <>
         <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <MyModal isOpen={isOpen} onClose={setopen} onSubmit={onChange} />
  
  
      </>
      }
      </ReactFlowProvider>


    </div>
  );
};

export default Designer;
