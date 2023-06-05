import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Box,
  Flex,
  HStack,
  Button,
  Text,
  Image,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/TIC.png";

export default function Header({ children }) {
  const color = "#ffffff";
  const bg = "#3182CE";
  const [action, setAction] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const handleAction = (action) => {
    setAction(action);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Box bg={bg} py={4} px={6} shadow="md">
      <Flex
        alignItems="center"
        justifyContent="space-between"
        maxW="7xl"
        mx="auto"
      >
        <Flex alignItems="center">
        <Link to="/">
          <Image
            src={logo}
            alt="App Logo"
            style={{ width: "18px", height: "15px", marginRight: "30px", transform: "scale(3.5)" }}
          />
          </Link>
          <Link to="/">
          <Text fontSize="xl" fontWeight="bold" color={color}>
            TIC@coMakeIT
          </Text>
        </Link>
        </Flex>
        <HStack spacing={4} display={{ base: "none", md: "flex" }}>
          <Link to="/" onClick={() => handleAction("home")}>
            <Text
              fontSize="md"
              color={color}
              fontWeight={action === "home" || !action ? "bold" : ""}
            >
              Home
            </Text>
          </Link>
          <Link to="/docs" onClick={() => handleAction("docs")}>
            <Text
              fontSize="md"
              color={color}
              fontWeight={action === "docs" ? "bold" : ""}
            >
              Docs
            </Text>
          </Link>
          <Menu isOpen={isOpen} onClose={handleClose}>
            <MenuButton
              as={Link}
              to="#"
              color="white"
              onClick={() => {
                setIsOpen(!isOpen);
                handleAction("products");
              }}
              style={{
                color: color,
                fontWeight: action === "products" ? "bold" : "normal",
              }}
            >
              Products
            </MenuButton>
            <MenuList
              borderColor={bg}
              color={color}
              backgroundColor={bg}
              minWidth="75px"
            >
              <MenuItem
                backgroundColor={bg}
                as={Link}
                to="/wda"
                onClick={() => handleClose()}
              >
                WDA
              </MenuItem>
              <MenuItem
                backgroundColor={bg}
                as={Link}
                to="/wdi"
                onClick={() => handleClose()}
              >
                WDI
              </MenuItem>
            </MenuList>
          </Menu>
          {/* <Link to="/about" onClick={() => handleAction("about")}>
            <Text
              fontSize="md"
              color={color}
              fontWeight={action === "about" ? "bold" : ""}
            >
              About
            </Text>
          </Link> */}
          <Link to="/contact" onClick={() => handleAction("contact")}>
            <Text
              fontSize="md"
              color={color}
              fontWeight={action === "contact" ? "bold" : ""}
            >
              Contact
            </Text>
          </Link>
          <Link to="/login" onClick={() => handleAction("login")}>
            <Text
              fontSize="md"
              color={color}
              fontWeight={action === "login" ? "bold" : ""}
            >
              Login
            </Text>
          </Link>
        </HStack>
        <Box display={{ base: "block", md: "none" }}>
          <Button variant="ghost" colorScheme="blue" size="sm">
            Menu
          </Button>
        </Box>
      </Flex>
      {children}
    </Box>
  );
}
