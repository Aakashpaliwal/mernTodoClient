import React, { useContext, useState } from "react";
import { Box, Link, Text, Stack, Flex, Icon } from "@chakra-ui/react";
import { MdClose, MdMenu } from "react-icons/md";
import MyContex from "../../MyContext";
import MyContext from "../../MyContext";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" color="black">
        Todo List
      </Text>
    </Box>
  );
};

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <Icon as={MdClose} /> : <Icon as={MdMenu} />}
    </Box>
  );
};

const MenuItem = ({ children, isLast, to = "/", ...rest }) => {
  return (
    <Link href={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};

const MenuLinks = ({ isOpen }) => {
  const navigate = useNavigate()
  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={8}
        align="center"
        justify={["center", "space-between", "flex-end"]}
        direction={["column", "row"]}
        paddingTop={[4, 4, 0]}
      >
        <MenuItem onClick={() => {
          sessionStorage.clear();
          window.location.href = "/login";
        }}>Sign Out</MenuItem>
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({ children }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      width="100%"
      padding={8}
      bg={"transparent"}
      color={"gray.600"}
    >
      {children}
    </Flex>
  );
};

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);
  // const {token} = useContext(MyContex)
  const [token, setToken] = useContext(MyContext)

  return (
    <Box bg={"gray.100"}>
      <NavBarContainer>
        <Logo />
        <MenuToggle toggle={toggleMenu} isOpen={isOpen} />
        {token?.length > 0 && (
          <MenuLinks isOpen={isOpen} />
        )}
      </NavBarContainer>
    </Box>
  );
}

export default Header;
