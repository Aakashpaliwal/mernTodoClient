import React, { useState } from "react";
import {
  ListItem,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  Input,
  Divider,
} from "@chakra-ui/react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "../../Constants/constant";

const ViewList = ({ data }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [editTask, setEditTask] = useState(null);

  const mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.delete(
        `${BASE_URL}/todolist/deleteTodoItem/${data.id}`
      );
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("todos");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error?.response?.data?.message?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios.put(
        `${BASE_URL}/todolist/edittodo/`,
        data
      );
      return res;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("todos");
      onClose();
    },
    onError: (error) => {
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
    <div style={{ marginTop: 20 }}>
      <ListItem
        textAlign={"left"}
        mb={3}
        display={"flex"}
        flexWrap={"wrap"}
        justifyContent={"space-between"}
      >
        {/* {data?.title} */}
        <Text noOfLines={2} width={"85%"}>
          {data?.title}
        </Text>
        <div>
          <Button
            // float={"right"}
            colorScheme="blue"
            onClick={() => {
              onOpen(), setEditTask(data.title);
            }}
            mr={3}
          >
            <AiOutlineEdit />
          </Button>
          <Button
            // float={"right"}
            colorScheme="red"
            onClick={() => {
              mutation.mutate({
                id: data._id,
              });
            }}
            isDisabled={mutation.isPending}
            isLoading={mutation.isPending}
          >
            <AiOutlineDelete />
          </Button>
        </div>
      </ListItem>
      <Divider />
      {/* Edit Modal*/}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl
              isRequired
              display={"flex"}
              justifyContent={"space-between"}
            >
              <Input
                type="text"
                onChange={(e) => setEditTask(e.target.value)}
                mr={5}
                value={editTask}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                updateMutation?.mutate({
                  id: data._id,
                  title: editTask,
                });
              }}
              isDisabled={updateMutation.isPending}
              isLoading={updateMutation.isPending}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ViewList;
