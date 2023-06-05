import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  Button,
  FormLabel,
  FormControl,
} from "@chakra-ui/react";

const DeployModal = ({ isOpen, onClose, onSubmit, CurrentNode }) => {
  console.log(CurrentNode, isOpen);
  const IntialState = {
    cloudProvider: isOpen,
    deploymentType: "",
    kubernetesNamespace: "",
    kubernetesUseDynamicStorage: "",
    kubernetesStorageClassName: "",
    azureRegion: "",
    acrRegistry: "",
    awsAccountId: "",
    clusterName: "",
    awsRegion: "",
    ingress: "istio",
    monitoring: "",
    ingressDomain: "",
    k8sWebUI: "",
    subscriptionid:"",
    tenantid:"",

    ...CurrentNode,
  };

  console.log(isOpen);
  const [DeploymentData, setDeploymentData] = useState(IntialState);

  const handleData = (column, value) => {
    setDeploymentData((prev) => ({ ...prev, [column]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} isCentered={true}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Deployment</ModalHeader>
        <ModalCloseButton/>
        <ModalBody
          style={{
            maxHeight: "600px",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "Left",
            }}
          >
            {isOpen === 'Azure' && (
              <div>
                <FormControl>
                  <FormLabel>Azure Registry</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="acrRegistry"
                    borderColor={"black"}
                    value={DeploymentData.acrRegistry}
                    onChange={(e) =>
                      handleData("acrRegistry", e.target.value)
                    }
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>Azure Region</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="azureRegion"
                    borderColor={"black"}
                    value={DeploymentData.azureRegion}
                    onChange={(e) => handleData("azureRegion", e.target.value)}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="canadacentral">Canada Central</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Subscription ID</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="subscriptionid"
                    borderColor={"black"}
                    value={DeploymentData.subscriptionid}
                    onChange={(e) =>
                      handleData("subscriptionid", e.target.value)
                    }
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>Tenant ID</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="tenantid"
                    borderColor={"black"}
                    value={DeploymentData.tenantid}
                    onChange={(e) =>
                      handleData("tenantid", e.target.value)
                    }
                  ></Input>
                </FormControl>
              </div>
            )}

            {isOpen === "AWS" && (
              <div>
                <FormControl>
                  <FormLabel>AWS Account ID</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="awsAccountId"
                    borderColor={"black"}
                    value={DeploymentData.awsAccountId}
                    onChange={(e) =>
                      handleData("awsAccountId", e.target.value)
                    }
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>AWS Region</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="awsRegion"
                    borderColor={"black"}
                    value={DeploymentData.awsRegion}
                    onChange={(e) =>
                      handleData("awsRegion", e.target.value)
                    }
                  >
                    <option value="us-east-2">US East (Ohio)</option>
                    <option value="us-east-1">
                      US East (N. Virginia)
                    </option>
                    <option value="ap-south-1">
                      Asia Pacific (Mumbai)
                    </option>
                  </Select>
                </FormControl>
              </div>
            )}
            <FormControl>
              <FormLabel>Deployment Type</FormLabel>
              <Select
                mb={4}
                variant="outline"
                id="deploymentType"
                borderColor={"black"}
                value={DeploymentData.deploymentType}
                onChange={(e) =>
                  handleData("deploymentType", e.target.value)
                }
              >
                <option value="" disabled>
                  Select an option
                </option>
                <option value="kubernetes">Kubernetes</option>
              </Select>
            </FormControl>

            {DeploymentData.deploymentType === "kubernetes" && (
              <div>
                <FormControl>
                  <FormLabel>Cluster Name</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="clusterName"
                    borderColor={"black"}
                    value={DeploymentData.clusterName}
                    onChange={(e) => handleData("clusterName", e.target.value)}
                  ></Input>
                </FormControl>
                <FormControl>
                  <FormLabel>Namespace</FormLabel>
                  <Input
                    mb={4}
                    variant="outline"
                    id="kubernetesnamespace"
                    placeholder="Kubernetes Namespace"
                    borderColor={"black"}
                    value={DeploymentData.kubernetesNamespace}
                    onChange={(e) =>
                      handleData("kubernetesNamespace", e.target.value)
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Enable Dynamic Storage</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="kubernetesUseDynamicStorage"
                    borderColor={"black"}
                    value={DeploymentData.kubernetesUseDynamicStorage}
                    onChange={(e) =>
                      handleData("kubernetesUseDynamicStorage", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </FormControl>
                {DeploymentData.kubernetesUseDynamicStorage === "yes" && (
                  <FormControl>
                    <FormLabel>Storage Class Name</FormLabel>
                    <Input
                      mb={4}
                      variant="outline"
                      id="kubernetesStorageClassName"
                      placeholder="Kubernetes Storage Class Name"
                      borderColor={"black"}
                      value={DeploymentData.kubernetesStorageClassName}
                      onChange={(e) =>
                        handleData(
                          "kubernetesStorageClassName",
                          e.target.value
                        )
                      }
                    />
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel>Ingress Type</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="ingress"
                    borderColor={"black"}
                    value={DeploymentData.ingress}
                    onChange={(e) => handleData("ingress", e.target.value)}
                  >
                    <option value="istio">Istio</option>
                  </Select>
                </FormControl>
                {DeploymentData.ingress === "istio" && (
                  <FormControl>
                    <FormLabel>Ingress Domain Name</FormLabel>
                    <Input
                      mb={4}
                      variant="outline"
                      id="ingressDomain"
                      placeholder="Ingress Domain Name"
                      borderColor={"black"}
                      value={DeploymentData.ingressDomain}
                      onChange={(e) =>
                        handleData("ingressDomain", e.target.value)
                      }
                    />
                  </FormControl>
                )}
                <FormControl>
                  <FormLabel>Enable Monitoring</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="monitoring"
                    borderColor={"black"}
                    value={DeploymentData.monitoring}
                    onChange={(e) =>
                      handleData("monitoring", e.target.value)
                    }
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Enable Web UI</FormLabel>
                  <Select
                    mb={4}
                    variant="outline"
                    id="k8sWebUI"
                    borderColor={"black"}
                    value={DeploymentData.k8sWebUI}
                    onChange={(e) => handleData("k8sWebUI", e.target.value)}
                  >
                    <option value="" disabled>
                      Select an option
                    </option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </FormControl>
              </div>
            )}
          </div>
          <ModalFooter>
            <Button
              onClick={() => onSubmit(DeploymentData)}
              type="submit"
              style={{ display: "block", margin: "0 auto" }}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DeployModal;
