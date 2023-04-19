import React, { useState, useEffect } from "react";
import {
  Accordion,
  Container,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Heading,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Checkbox,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import Application from "./Application";
// import Entity from "./Entity";
import Deployment from "./Deployment";
import { saveAs } from "file-saver";
import Confetti from "react-confetti";
import useWindowDimensions from "../../Hooks/useWindowDimensions";
import {
  entityPreFlightTemplate,
  applicationPreFlightTemplate,
  communicationPreFlightTemplate,
  deploymentPreFlightTemplate,
  wdiPreFlightTemplate,
} from "./assert";
import Communication from "./communication";
import Infrastructure from "./Infrastructure";

function FormWda() {
  const { height, width } = useWindowDimensions();
  const [party, setParty] = useState(false);
  const handleSubmitWda = (e) => {
    e.preventDefault();
    fetch(
      "http://localhost:3001/generateJDL?username=" +
        username +
        "&projectName=" +
        projectName +
        "&generateInfra=" +
        generateInfrastructure +
        "",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application,
          entity,
          deployment,
          communication,
        }),
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, `${projectName}.zip`); // Edit the name or ask the user for the project Name
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setTimeout(() => setParty(true));
      });
  };
    
  const handleSubmitWdi = (e) => {
    e.preventDefault();
    fetch(
      "http://localhost:3001/generateJDL?username=" +
        username +
        "&projectName=" +
        projectName +
        "&generateInfra=" +
        generateInfrastructure +
        "",
      {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          application,
          entity,
          deployment,
          communication,
          wdi
        }),
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        saveAs(blob, `${projectName}.zip`);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setTimeout(() => setParty(true));
      });
  };
  const [entityCounter, setEntityCounter] = useState(1);
  const [communicationCounter, setCommunicationCounter] = useState(1);
  const [entity, setEntity] = useState([entityPreFlightTemplate]);
  const [applicationCounter, setApplicationCounter] = useState(1);
  const [application, setApplication] = useState({
    0: applicationPreFlightTemplate,
  });
  const [deployment, setDeployment] = useState(deploymentPreFlightTemplate);
  const [communication, setCommunication] = useState({
    0: communicationPreFlightTemplate,
  });

  /*
  TODO :use setWdi when the generateInfra is true
  */
  const [wdi, setWdi] = useState(wdiPreFlightTemplate);

  const addEntity = () => {
    setEntityCounter((state) => state + 1);
    setEntity((prev) => ({
      ...prev,
      [entityCounter]: entityPreFlightTemplate,
    }));
  };
  const addApplication = () => {
    setApplicationCounter((state) => state + 1);
    setApplication((prev) => ({
      ...prev,
      [applicationCounter]: applicationPreFlightTemplate,
    }));
  };
  const addCommunication = () => {
    setCommunicationCounter((state) => state + 1);
    setCommunication((prev) => ({
      ...prev,
      [communicationCounter]: communicationPreFlightTemplate,
    }));
  };

  useEffect(() => {
    if (party) {
      setTimeout(() => {
        setParty(false);
      }, 5000);
    }
  }, [party]);
  const [isOpen, setIsOpen] = useState(true);
  const [isContainerVisible, setIsContainerVisible] = useState(true);
  const [generateInfrastructure, setGenerateInfrastructure] = useState(false);
  const [username, setUsername] = useState("");
  const [projectName, setProjectName] = useState("");

  const handleContainerClose = () => {
    setIsOpen(false);
    setIsContainerVisible(false);
  };
  const handleCheckboxChange = (e) => {
    setGenerateInfrastructure(e.target.checked);
  };

  return (
    <>
      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Please enter your details</ModalHeader>
          <ModalBody>
            Enter username
            <Input
              type="text"
              marginBottom="10px"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
            />
            Enter project name
            <Input
              type="text"
              marginBottom="10px"
              onChange={(e) => setProjectName(e.target.value)}
              value={projectName}
            />
            <Checkbox
              defaultChecked={generateInfrastructure}
              onChange={handleCheckboxChange}
            >
              Generate infrastructure
            </Checkbox>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleContainerClose}
              isDisabled={!username || !projectName}
            >
              Next
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {!isContainerVisible && (
        <Container maxW="2xl" marginTop="16px">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <Heading marginBottom="10px" marginRight="10px">
              WDA
            </Heading>
            {generateInfrastructure && (
              <Heading marginBottom="10px">& WDI</Heading>
            )}
          </div>
          <Tabs isLazy isFitted>
            <TabList mb="1em">
              {/* <Tab
                fontWeight="normal"
                _selected={{
                  fontWeight: "bold",
                  color: "rgb(49, 130, 206)",
                  borderBottom: "2px solid rgb(49, 130, 206)",
                }}
              >
                Entity
              </Tab> */}
              <Tab
                fontWeight="normal"
                _selected={{
                  fontWeight: "bold",
                  color: "rgb(49, 130, 206)",
                  borderBottom: "2px solid rgb(49, 130, 206)",
                }}
              >
                Application
              </Tab>
              <Tab
                fontWeight="normal"
                _selected={{
                  fontWeight: "bold",
                  color: "rgb(49, 130, 206)",
                  borderBottom: "2px solid rgb(49, 130, 206)",
                }}
              >
                Communication
              </Tab>
              <Tab
                fontWeight="normal"
                _selected={{
                  fontWeight: "bold",
                  color: "rgb(49, 130, 206)",
                  borderBottom: "2px solid rgb(49, 130, 206)",
                }}
              >
                Deployment
              </Tab>
              {generateInfrastructure && (
                <Tab
                  fontWeight="normal"
                  _selected={{
                    fontWeight: "bold",
                    color: "rgb(49, 130, 206)",
                    borderBottom: "2px solid rgb(49, 130, 206)",
                  }}
                >
                  Infrastructure
                </Tab>
              )}
              {/* <Tab>Code</Tab> */}
            </TabList>
            <TabPanels>
              {/* <TabPanel>
                <Accordion allowToggle>
                  {Object.values(entity).map((entity, id) => {
                    return (
                      <Entity
                        key={id}
                        id={id}
                        setEntity={setEntity}
                        entity={entity}
                      />
                    );
                  })}
                </Accordion>
                <Button
                  width="100px"
                  border="2px"
                  borderColor="green.500"
                  mr={4}
                  leftIcon={<AddIcon />}
                  onClick={addEntity}
                  marginTop="10px"
                >
                  Add
                </Button>
              </TabPanel> */}
              <TabPanel>
                <Accordion allowToggle>
                  {Object.values(application).map((application, id) => {
                    return (
                      <Application
                        key={id}
                        id={id}
                        application={application}
                        setApplication={setApplication}
                        // entity={entity}
                        // Client
                        // Name
                      />
                    );
                  })}
                  <Button
                    width="100px"
                    border="2px"
                    borderColor="green.500"
                    onClick={addApplication}
                    leftIcon={<AddIcon />}
                    marginTop="10px"
                  >
                    Add
                  </Button>
                </Accordion>
              </TabPanel>
              <TabPanel>
                <Accordion allowToggle>
                  {Object.values(communication).map((communication, id) => {
                    return (
                      <Communication
                        key={id}
                        id={id}
                        communication={communication}
                        setCommunication={setCommunication}
                      />
                    );
                  })}
                </Accordion>
                <Button
                  width="100px"
                  border="2px"
                  borderColor="green.500"
                  mr={4}
                  leftIcon={<AddIcon />}
                  onClick={addCommunication}
                  marginTop="10px"
                >
                  Add
                </Button>
              </TabPanel>
              <TabPanel>
                <Deployment
                  application={application}
                  deployment={deployment}
                  setDeployment={setDeployment}
                />
                {!generateInfrastructure &&  (
                <Button
                  width="100px"
                  border="2px"
                  borderColor="green.500"
                  onClick={handleSubmitWda}
                  marginTop="10px"
                >
                  Submit
                </Button>
                )}
              </TabPanel>
              {generateInfrastructure && (
                <TabPanel>
                  <Infrastructure
                    application={application}
                    wdi={wdi}
                    setWdi={setWdi}
                  />
                  <Button
                    width="100px"
                    border="2px"
                    borderColor="green.500"
                    onClick={handleSubmitWdi}
                    marginTop="10px"
                  >
                    Submit
                  </Button>
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>

          {party && <Confetti width={width} height={height} />}
        </Container>
      )}
    </>
  );
}

export default FormWda;
