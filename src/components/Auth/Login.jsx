import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../Constants/constant";
import MyContext from "../../MyContext";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";

const Login = ({ setIsLoginShow }) => {
  const [token, setToken, userObj, setUserObj] = useContext(MyContext);
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);

  const mutation = useMutation({
    mutationFn: async () => {
      let data = {
        email,
        password,
      };
      const res = await axios.post(`${BASE_URL}/users/signin`, data);
      return res;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "You have successfully Logged in",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      sessionStorage.setItem("userToken", data?.data?.token);
      setToken(data?.data?.token);
      const token = jwtDecode(data?.data?.token);
      if (token) {
        localStorage.setItem("userData", JSON.stringify(token));
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log(codeResponse);
      setUser(codeResponse);
    },
    onError: (error) => console.log("Login Failed:", error),
  });

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log(res);
          setProfile(res.data);
          axios
            .post(`${BASE_URL}/users/thirdpartysignin`, {
              fullName: res.data.name,
              email: res.data.email,
            })
            .then((res) => {
              console.log(res);
              toast({
                title: "Success",
                description: "You have successfully Logged in",
                status: "success",
                duration: 5000,
                isClosable: true,
              });
              sessionStorage.setItem("userToken", res?.data?.token);
              setToken(res?.data?.token);
              const token = jwtDecode(res?.data?.token);
              if (token) {
                localStorage.setItem("userData", JSON.stringify(token));
              }
              navigate('/home')
            })
            .catch((err) => {
              console.log(err);
              toast({
                title: "Error",
                description: err?.response?.data?.message,
                status: "error",
                duration: 5000,
                isClosable: true,
              });
            });
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // log out function to log the user out of google and set the profile array to null
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  console.log(profile);

  return (
    <>
      <Container centerContent>
        <Card align="center" mt={20} width={"100%"}>
          <CardHeader>
            <Heading size="md">Login</Heading>
          </CardHeader>
          <CardBody width={"100%"}>
            <FormControl isRequired>
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
                  email: email,
                  password: password,
                });
              }}
              isDisabled={mutation.isPending}
              isLoading={mutation.isLoading}
            >
              Sign In
            </Button>
            <Button
              colorScheme="blue"
              variant={"ghost"}
              onClick={() => {
                setIsLoginShow(false);
              }}
            >
              Sign Up
            </Button>
          </CardFooter>
          <Divider />
          <Box mt={5} mb={5}>
            {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
            <Button onClick={login}>Sign in with Google 🚀</Button>
          </Box>
        </Card>
      </Container>
    </>
  );
};

export default Login;
