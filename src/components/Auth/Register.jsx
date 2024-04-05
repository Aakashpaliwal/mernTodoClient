import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../Constants/constant";

const Register = ({ setIsLoginShow }) => {
  const toast = useToast();
  const [firstName, setFirstName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const mutation = useMutation({
    mutationFn: async () => {
      let data = {
        fullName: firstName,
        email: email,
        password: password,
      };
      const res = await axios.post(`${BASE_URL}/users/signup`, data);
      return res;
    },
    onSuccess: (data) => {
      console.log(data);
      toast({
        title: "Success",
        description: "You have successfully registered",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setIsLoginShow(true);
    },
    onError: (error) => {
      console.log(error)
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
  });

  return (
    <div>
      <Container centerContent>
        <Card align="center" mt={20} width={"100%"}>
          <CardHeader>
            <Heading size="md">Register</Heading>
          </CardHeader>
          <CardBody width={"100%"}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired mt={5}>
              <FormLabel>Email</FormLabel>
              <Input type="email" onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired mt={5}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
          </CardBody>
          <CardFooter justifyContent={"space-between"} width={"100%"}>
            <Button
              colorScheme="blue"
              onClick={() => {
                mutation.mutate({
                  fullName: firstName,
                  email: email,
                  password: password,
                });
              }}
              isDisabled={mutation.isPending}
              isLoading={mutation.isLoading}
            >
              Create User
            </Button>
            <Button
              colorScheme="blue"
              variant={"ghost"}
              onClick={() => {
                setIsLoginShow(true);
              }}
            >
              Login
            </Button>
          </CardFooter>
        </Card>
      </Container>
    </div>
  );
};

export default Register;
