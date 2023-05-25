import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Input,
  Select,
  Button,
  FormLabel,
  FormControl
} from "@chakra-ui/react";

const UiDataModal = ({ isOpen, onClose, onSubmit,CurrentNode }) => {

  const IntialState ={
    'label':'UI',
    'Framework':'reactjs',
    'PackageName':'',
    'ServerPort':'',
    'ApplicationType':'UI+Gateway',
    ...CurrentNode
  }

  const [UiData,setUiDataData] = useState(IntialState)

  const handleData = (column,value)=>{
    setUiDataData((prev)=>({...prev,[column]:value}))
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>UI</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "Left",
            }}
          >
            <FormControl>
              <FormLabel>Application name</FormLabel>
              <Input
                mb={4}
                variant="outline"
                id="appname"
                placeholder="Name"
                borderColor={"black"}
                value={UiData.label}
                onChange={(e)=>handleData('label',e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Framework</FormLabel>
              <Select mb={4} variant="outline" id="framework" 
                borderColor={"black"}
                value={UiData.Framework}
                onChange={(e)=>handleData('Framework',e.target.value)}
              >
                <option value="reactjs">ReactJS</option>
                <option value="nodejs">NodeJS</option>
              </Select>
            </FormControl>
              
        
            <FormControl>
              <FormLabel>Package Name</FormLabel>
              <Input
                mb={4}
                variant="outline"
                id="packagename"
                placeholder="PackageName"
                borderColor={"black"}
                value={UiData.PackageName}
                onChange={(e)=>handleData('PackageName',e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Server Port</FormLabel>
              <Input
                mb={4}
                variant="outline"
                id="serverport"
                placeholder="ServerPort"
                borderColor={"black"}
                value={UiData.ServerPort}
                onChange={(e)=>handleData('ServerPort',e.target.value)}
              />
            </FormControl>
            
          </div>
          <Button onClick={()=>onSubmit(UiData)}style={{ display: 'block', margin: '0 auto' }}>Submit</Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default UiDataModal;