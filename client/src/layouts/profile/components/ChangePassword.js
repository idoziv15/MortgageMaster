import React, {useState} from "react";
import {
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack, Text, useColorModeValue,
    useToast,
} from "@chakra-ui/react";
import Card from "../../../components/card/Card.js";
import axios from "axios";

const ChangePassword = () => {
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const toast = useToast();

    const getToken = () => {
        // Check if token is in sessionStorage
        let token = sessionStorage.getItem('token');

        // If token is not found in sessionStorage, check localStorage
        if (!token) {
            token = localStorage.getItem('token');
        }

        return token;
    };

    const handleChangePassword = async () => {
        try {
            // Validation: Check if any field is empty
            if (!currentPassword || !newPassword || !confirmPassword) {
                toast({
                    title: "Please fill in all fields",
                    status: "warning",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // Validation: Check if new password matches confirm password
            if (newPassword !== confirmPassword) {
                toast({
                    title: "Passwords do not match",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // Validation: Check if new password is the same as current password
            if (newPassword === currentPassword) {
                toast({
                    title: "New password must be different from current password",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            const token = getToken();
            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/change-password`, {
                    currentPassword, newPassword}, { headers: {Authorization: `Bearer ${token}`}});
            toast({
                title: "Password changed successfully",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            // Reset form fields after successful change
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast({
                title: "Failed to change password",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Card mb={{base: "0px", "2xl": "10px"}} p={5}>
            <Text
                color={textColorPrimary}
                fontWeight="bold"
                fontSize="2xl"
                mt="5px"
                mb="4px"
            >
                Change Password
            </Text>
            <Stack spacing={4}>
                <FormControl>
                    <FormLabel>Current Password</FormLabel>
                    <Input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>New Password</FormLabel>
                    <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel>Confirm New Password</FormLabel>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </FormControl>
                <Button colorScheme="blue" onClick={handleChangePassword}>
                    Change Password
                </Button>
            </Stack>
        </Card>
    );
};

export default ChangePassword;
