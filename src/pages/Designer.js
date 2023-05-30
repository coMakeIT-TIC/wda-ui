import React, { useState, useRef, useCallback,useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  MarkerType,
  MiniMap
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './../components/Sidebar';
import ServiceModal from '../components/Modal/ServiceModal';
import UiDataModal from '../components/Modal/UIModal';
import DeployModal from '../components/Modal/DeployModal';
import CustomImageNode from "./Customnodes/CustomImageNode"
import CustomServiceNode from "./Customnodes/CustomServiceNode"
import CustomIngressNode from "./Customnodes/CustomIngressNode"
import CustomAuthNode from "./Customnodes/CustomAuthNode"
import CustomMessageBrokerNode from "./Customnodes/CustomMessageBrokerNode"
import CustomCloudNode from "./Customnodes/CustomCloudNode"
import CustomLoadNode from "./Customnodes/CustomLoadNode"
import AlertModal from '../components/Modal/AlertModal';

import "./../App.css"
import { Button } from '@chakra-ui/react';
import EdgeModal from '../components/Modal/EdgeModal';

let service_id = 1;
let database_id = 1;
let totalnodes = 1
const getId = (type='') =>{
      if( type === 'Service')
        return `Service_${service_id++}`
      else if ( type === 'Database')
        return `Database_${database_id++}`
      else if ( type === 'Authentication')
        return 'Authentication_1'
      // else if ( type === 'Deployment')
      //   return 'Deployment_1'
      else if( type === 'UI')
        return 'UI'
    return 'Id'
}
const nodeTypes = {
  selectorNode: CustomImageNode,
  selectorNode1: CustomServiceNode,
  selectorNode2: CustomIngressNode,
  selectorNode3: CustomAuthNode,
  selectorNode4: CustomMessageBrokerNode,
  selectorNode5: CustomCloudNode,
  selectorNode6: CustomLoadNode
};


const Designer = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes,setNodes] = useState({})
  const [nodeType,setNodeType] = useState(null)
  const [ServiceDiscoveryCount,setServiceDiscoveryCount] = useState(0)
  const [MessageBrokerCount,setMessageBrokerCount] = useState(0)
  const [CloudProviderCount,setCloudProviderCount] = useState(0)

  console.log("Nodes",nodes)

  const addEdge = (edgeParams,edges)=>{
    console.log(edgeParams,'edgeee')
    const edgeId= `${edgeParams.source}-${edgeParams.target}`
    return {...edges,[edgeId]:{id:edgeId,...edgeParams}}
  }

  const updateEdge= (oldEdge, newConnection, edges)=>{

    console.log('OldEdge',oldEdge)
    console.log('New Connection',newConnection)
    console.log('Edges',edges)
    let newEdgeId = newConnection.source+'-'+newConnection.target

    let updatedEdges ={...edges,[newEdgeId]:{id:newEdgeId,...newConnection}}
    delete updatedEdges[oldEdge.id]
    
    return updatedEdges;
  }

  const onNodesChange = useCallback((changes= []) => {
    setNodes((oldNodes) => {
      const updatedNodes = { ...oldNodes };

      changes.forEach((change) => {
        switch (change.type) {
          case 'dimensions':
            updatedNodes[change.id] = {
              ...updatedNodes[change.id],
              position: {
                ...updatedNodes[change.id].position,
                ...change.dimensions,
              },
            };
            break;
          case 'position':
            updatedNodes[change.id] = {
              ...updatedNodes[change.id],
              position: {
                ...updatedNodes[change.id].position,
                ...change.position,
              },
              positionAbsolute: {
                x: 0,
                y: 0,
                ...updatedNodes[change.id].positionAbsolute,
                ...change.positionAbsolute,
              },
              dragging: change.dragging,
            };
            break;
          case 'select':
            updatedNodes[change.id] = {
              ...updatedNodes[change.id],
              selected: change.selected,
            };
            break;
          case 'remove': // Delete Functionality
          if(change.id !== 'UI')
            setIsUINodeEnabled(true);
            delete updatedNodes[change.id];
            break;
          case 'add':
            updatedNodes[change.item.id] = change.item;
            break;
          case 'reset':
            updatedNodes[change.item.id] = change.item;
            break;
          default:
            break;
        }
      });

      return updatedNodes;
    });
  }, []);

  
  const [edges, setEdges] = useState({})
  console.log("Edges",edges)  

  const onEdgesChange = useCallback((changes = []) => {
    setEdges((oldEdges) => {
      const updatedEdges = { ...oldEdges };
      console.log(changes,updatedEdges)
      changes.forEach((change) => {
        switch (change.type) {
          case 'add':
            console.log('Addddddddddd')
            // Handle add event
            break;
          case 'remove':
            delete updatedEdges[change.id]
            // Handle remove event
            break;
          case 'update':
            console.log('Updateeeeeeeeeeeeee')
            // Handle update event
            break;
          case 'select':
              updatedEdges[change.id] = {
                ...updatedEdges[change.id],
                selected: change.selected,
              };
              break;
          default:
            break;
        }
      });
  
      return updatedEdges;
    });
  }, []);

  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [Isopen,setopen]=useState(false);
  const [IsEdgeopen,setEdgeopen]=useState(false);
  const [CurrentNode,setCurrentNode]= useState({});
  const [CurrentEdge,setCurrentEdge]= useState({});
  const edgeUpdateSuccessful = useRef(true);
  const [isUINodeEnabled, setIsUINodeEnabled] = useState(true);

    const onEdgeUpdateStart = useCallback(() => {
      edgeUpdateSuccessful.current = false;
    }, []);
  
    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
      edgeUpdateSuccessful.current = true;
      setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, []);
  
    const onEdgeUpdateEnd = useCallback((_, edge) => {
      if (!edgeUpdateSuccessful.current) {
        setEdges((edges) => {
          let AllEdges={...edges}
          delete AllEdges[edge.id]
          return AllEdges
        });
      }
  
      edgeUpdateSuccessful.current = true;
    }, []);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onclick = (e)=>{
    console.log(e)
    const Id= e.target.dataset.id || e.target.name
    console.log(Id)
    if(Id){
      const type=Id.split('_')[0]
      setNodeType(type)
      if(type=='AWS' || type ==='Azure'){
        setCurrentNode(nodes['cloudProvider'].data)     }
      else
      setCurrentNode(nodes[Id].data)
      setopen(Id)
    }
    
  }

  const onDrop = useCallback(
    (event,servicecount,messagecount,cloudcount) => {
      event.preventDefault();
      console.log(event)
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const name = event.dataTransfer.getData('Name')

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      if(name.startsWith('Database')){
        const prodDatabaseType=name.split('_').splice(1)[0]
        console.log(prodDatabaseType)
        const newNode = {
          id: getId('Database'),
          type:'selectorNode',
          position,
          data: { prodDatabaseType: prodDatabaseType },
         style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({...nds,[newNode.id]:newNode}))
      }
      else if(name.startsWith('Discovery') && servicecount==0){
        console.log(servicecount)
        const serviceDiscoveryType=name.split('_').splice(1)[0]
        console.log(serviceDiscoveryType)
        const newNode = {
          id: 'serviceDiscoveryType',
          type:'selectorNode1',
          position,
          data: { serviceDiscoveryType: serviceDiscoveryType },
         style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({...nds,[newNode.id]:newNode}))
        setServiceDiscoveryCount(1)
          
    }
    else if(name.startsWith('Discovery') && servicecount>=1){
      console.log("else",servicecount)
      setServiceDiscoveryCount(2)}

      else if(name.startsWith('Auth')){
        const authenticationType=name.split('_').splice(1)[0]
        console.log(authenticationType)
        const newNode = {
          id: 'authenticationType',
          type:'selectorNode3',
          position,
          data: { authenticationType: authenticationType },
         style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({...nds,[newNode.id]:newNode}))
      }
      else if(name.startsWith('MessageBroker')&& messagecount==0){
        console.log(messagecount)
        const messageBroker=name.split('_').splice(1)[0]
        console.log(messageBroker)
        const newNode = {
          id: 'messageBroker',
          type:'selectorNode4',
          position,
          data: { messageBroker: messageBroker },
         style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({...nds,[newNode.id]:newNode}))
        setMessageBrokerCount(1)
      }
      else if(name.startsWith('MessageBroker') && messagecount>=1)
      {
        console.log("else",messagecount)
        setMessageBrokerCount(2)
      }
      else if(name.startsWith('Cloud')&& cloudcount==0){
        console.log(cloudcount)
        const cloudProvider=name.split('_').splice(1)[0]
        console.log(cloudProvider)
        const newNode = {
          id: 'cloudProvider',
          type:'selectorNode5',
          position,
          data: { cloudProvider: cloudProvider },
         style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({...nds,[newNode.id]:newNode}))
        setCloudProviderCount(1)
      }
      else if(name.startsWith('Cloud') && cloudcount>=1)
      {
        console.log("else",cloudcount)
        setCloudProviderCount(2)
      }
      else if(name.startsWith('Load')){
        const logManagementType=name.split('_').splice(1)[0]
        const newNode = {
          id: 'logManagement',
          type:'selectorNode6',
          position,
          data: { logManagementType: logManagementType },
         style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({...nds,[newNode.id]:newNode}))
      }
      else {
        
        const newNode = {
          id: getId(name),
          type,
          position,
          data: { label: name},
         style: { border: "1px solid", padding: "4px 4px" },
        };
        setNodes((nds) => ({...nds,[newNode.id]:newNode}))
      }
      
  

    },
    [reactFlowInstance]
  );

  const onChange = (Data) => {
    let UpdatedNodes={...nodes}
    let CurrentNode;
    if(Isopen==='AWS' || Isopen ==='Azure'){
     UpdatedNodes['cloudProvider'].data={...UpdatedNodes['cloudProvider'].data,...Data}
    }
    else{
      UpdatedNodes[Isopen].data={...UpdatedNodes[Isopen].data,...Data}
    }
    setNodes(UpdatedNodes)
    setopen(false)
  }

  useEffect(()=>{
    setNodes({'UI':
      {
            id: 'UI',
            type: 'default',
            data: { label: 'UI'},
           style: { border: "1px solid #8c8d8f", padding: "4px 4px" },
            position: { x: 250, y: 5 },
          },
         
        })
  },[])

  const MergeData = (sourceId,targetId,Nodes) =>{

    const sourceType = sourceId.split('_')[0]
    const targetType = targetId.split('_')[0]
    
    console.log(sourceType, targetType)
    
    if(sourceType !== targetType){
      if(sourceType === 'Service' && targetType === 'Database'){
          let AllNodes={...Nodes}
          let sourceNode = AllNodes[sourceId]
          let targetNode = AllNodes[targetId]
          console.log(sourceNode,targetNode)
          AllNodes[sourceId].data={...sourceNode.data,...targetNode.data}
          setNodes({...AllNodes})
        }
    }
  }
  const onsubmit = (Data) =>{

    let NewNodes = {...nodes}
    let Service_Discovery_Data= nodes['serviceDiscoveryType'].data
    for(const key in NewNodes){
      const Node = NewNodes[key]
      if(Node.id.startsWith('Service')|| Node.id === 'UI')
            Node.data={...Node.data,...Service_Discovery_Data}
    }
    console.log(Data)
    setNodes(NewNodes)
  } 

  const onEdgeClick = (e,edge) =>{
    const sourceType = edge.source.split('_')[0]
    const targetType = edge.target.split('_')[0]
    console.log(e,edge)
    if( (sourceType ==='UI' && targetType === 'Service') || (sourceType=='Service' && targetType==='Service')){
      setEdgeopen(edge.id)
      setCurrentEdge(edges[edge.id].data)
    }

  }
  
  const handleEdgeData = (Data)=>{
    console.log(Data,IsEdgeopen)
    let UpdatedEdges={...edges}
    if(Data.communicationType === 'synchronous'){
      delete Data?.selectedBroker
      delete UpdatedEdges[IsEdgeopen]?.data?.selectedBroker
    }
    else{
      delete Data?.protocol
      delete UpdatedEdges[IsEdgeopen]?.data?.protocol
    }
    UpdatedEdges[IsEdgeopen].data={'client':UpdatedEdges[IsEdgeopen].source,'server':UpdatedEdges[IsEdgeopen].target,...UpdatedEdges[IsEdgeopen].data,...Data}
    setEdges(UpdatedEdges)
    setEdgeopen(false)
  }
  
  
  const onConnect = useCallback((params,Nodes) => {
    params.markerEnd= {type: MarkerType.ArrowClosed}
    params.type='straight'
    params.data={}
    setEdges((eds) => addEdge(params, eds))
    MergeData(params.source,params.target,Nodes)
  }
    , []);

  return (
    <div className="dndflow">
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{width:'100%', height:'90%'}}>
          <ReactFlow
            nodes={Object.values(nodes)}
            edges={Object.values(edges)}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={(params)=>onConnect(params,nodes)}
            onInit={setReactFlowInstance}
            onDrop={(e)=>onDrop(e,ServiceDiscoveryCount,MessageBrokerCount,CloudProviderCount)}
            onDragOver={onDragOver}
            onNodeDoubleClick={onclick}
            deleteKeyCode={["Backspace","Delete"]}
            fitView
            onEdgeUpdate={onEdgeUpdate}
            onEdgeUpdateStart={onEdgeUpdateStart}
            onEdgeUpdateEnd={onEdgeUpdateEnd}
            onEdgeClick={onEdgeClick}
            onKeyDown={(event) => {
              if (event.code === 'Delete' || event.code === 'Backspace') {
                setIsUINodeEnabled(false);
              }
            }}
            nodesFocusable={true}
          >
            <Controls />
            <MiniMap style={{backgroundColor:'#3182CE'}}/>
          </ReactFlow>
        </div>
        <Sidebar isUINodeEnabled={isUINodeEnabled} setIsUINodeEnabled={setIsUINodeEnabled} onSubmit={onsubmit} />

        { nodeType === 'Service' && Isopen && <ServiceModal isOpen={Isopen} CurrentNode ={CurrentNode} onClose={setopen} onSubmit={onChange} />}
      
        { nodeType === 'Azure'  && Isopen && <DeployModal isOpen={Isopen} CurrentNode ={CurrentNode} onClose={setopen} onSubmit={onChange} />}
        
        { nodeType === 'AWS'  && Isopen && <DeployModal isOpen={Isopen} CurrentNode ={CurrentNode} onClose={setopen} onSubmit={onChange} />}
      
        { nodeType === 'UI' && Isopen && <UiDataModal isOpen={Isopen} CurrentNode ={CurrentNode} onClose={setopen} onSubmit={onChange} />}

        { IsEdgeopen && <EdgeModal isOpen={IsEdgeopen} CurrentEdge={CurrentEdge} onClose={setEdgeopen} handleEdgeData={handleEdgeData}/>}

        {ServiceDiscoveryCount==2 && <AlertModal isOpen={true} onClose={()=>setServiceDiscoveryCount(1)} />}
        
        {MessageBrokerCount==2 && <AlertModal isOpen={true} onClose={()=>setMessageBrokerCount(1)} />}

        {CloudProviderCount==2 && <AlertModal isOpen={true} onClose={()=>setCloudProviderCount(1)} />}

        {/* <Button onClick={()=>onsubmit()}>Submit</Button> */}
      </ReactFlowProvider>


    </div>
  );
};

export default Designer;

