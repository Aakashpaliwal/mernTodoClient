import {
  Container,
  FormControl,
  FormLabel,
  Input,
  useToast,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
  Text,
} from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import ViewList from "../components/TodoList/ViewList";
import { BASE_URL } from "../Constants/constant";
import MyContext from "../MyContext";

const HomeContainer = () => {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [task, setTask] = useState(null);

  const {
    data: todoListData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todoList"],
    queryFn: async () => {
      let data = {
        id: JSON.parse(localStorage.getItem('userData'))?.id
      }
      const res = await axios.get(`${BASE_URL}/todolist/viewalltodoitem/${JSON.parse(localStorage.getItem('userData'))?.id}`, data);
      return res;
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    },
    refetchOnWindowFocus: false,
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await axios.post(`${BASE_URL}/todolist/addtodo`, data);
      return response;
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Task Successfully added",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries("todoList");
      setTask("");
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Error",
        description: error?.response?.data?.message?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return (
    <div>
      <Container maxW={"6xl"} mt={20} width={"100%"}>
        <FormControl
          isRequired
          display={"flex"}
          justifyContent={"space-between"}
        >
          <Input
            type="text"
            onChange={(e) => setTask(e.target.value)}
            mr={5}
            placeholder={"Enter Task..."}
            value={task}
          />
          <Button
            colorScheme="blue"
            onClick={() => {
              mutation.mutate({
                task,
                id: JSON.parse(localStorage.getItem('userData'))?.id
              });
            }}
            isDisabled={mutation.isPending || !task || task?.length === 0}
            isLoading={mutation.isPending}
          >
            Add
          </Button>
        </FormControl>
        {todoListData?.data?.allItems?.length === 0 && (
          <Text fontSize="lg" mt={10} color={"gray.400"}>
            No Tasks Yet.
          </Text>
        )}
        <OrderedList mt={10}>
          {todoListData?.data?.allItems?.map((item) => {
            return <ViewList key={item._id} data={item} />;
          })}
        </OrderedList>
      </Container>
    </div>
  );
};

export default HomeContainer;
