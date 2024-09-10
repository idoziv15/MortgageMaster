import React, { useState } from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack, Text, useColorModeValue,
    useToast,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Flex,
} from "@chakra-ui/react";
import Card from "../../../components/card/Card.js";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const DeleteAccount = () => {
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const navigate = useNavigate();

    const getToken = () => {
        let token = sessionStorage.getItem('token');
        if (!token) {
            token = localStorage.getItem('token');
        }
        return token;
    };

    const handleDeleteAccount = async () => {
        try {
            const token = getToken();
            const response = await axios.delete("http://localhost:5000/users", {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast({
                title: "Account deleted successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            navigate('/');
        } catch (error) {
            toast({
                title: "Failed to delete account",
                description: error.response?.data?.message || error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Card mb={{ base: "0px", "2xl": "10px" }} p={5}>
                <Text
                    color={textColorPrimary}
                    fontWeight="bold"
                    fontSize="2xl"
                    mt="5px"
                    mb="4px"
                >
                    Delete Account
                </Text>
                <Text>
                    Once you delete your account, all of your data, including user information and saved reports, will be permanently deleted.
                    This action cannot be undone. Please ensure you want to proceed before confirming.
                </Text>
                <Flex justifyContent="center" mt={6}>
                    <Button
                        colorScheme="red"
                        onClick={onOpen}
                        size="md"
                    >
                        Delete
                    </Button>
                </Flex>
            </Card>

            {/* Confirmation Modal */}
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Confirm Account Deletion</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>Are you sure ?</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button variant="ghost" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme="red" onClick={handleDeleteAccount} ml={3}>
                            Yes, Delete Account
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default DeleteAccount;
