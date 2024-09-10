import React, {useState} from "react";
import {Box, Text, useColorModeValue, Input, Button, Flex, Icon, useToast} from "@chakra-ui/react";
import Card from "../../../components/card/Card.js";
import {MdEdit} from "react-icons/md";
import axios from "axios";

export default function UserDetail(props) {
    const {title, value, userId, onUpdateDetail, loading, setLoading, ...rest} = props;
    const [isEditing, setIsEditing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [newValue, setNewValue] = useState(value);
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = useColorModeValue("gray.400", "gray.400");
    const bg = useColorModeValue("white", "navy.700");
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

    const handleSave = async () => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await axios.put(`http://localhost:5000/users/${userId}`, {
                [title.toLowerCase().replace(" ", "_")]: newValue,
            }, {
                headers: {Authorization: `Bearer ${token}`},
            });
            setNewValue(newValue);
            onUpdateDetail(newValue);
            setIsEditing(false);
            setLoading(false);
            toast({
                title: "Success",
                description: response.data.message || "Detail updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            setLoading(false);
            toast({
                title: "Error",
                description: "There was an error updating the detail",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Card
            bg={bg}
            {...rest}
            position="relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isEditing ? (
                <Box>
                    <Input
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                    />
                    <Flex mt={2}>
                        <Button colorScheme="green" mr={2} onClick={handleSave}>
                            Save
                        </Button>
                        <Button colorScheme="red" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                    </Flex>
                </Box>
            ) : (
                <Box>
                    <Text fontWeight="500" color={textColorSecondary} fontSize="sm">
                        {title}
                    </Text>
                    <Text color={textColorPrimary} fontWeight="500" fontSize="md">
                        {value}
                    </Text>
                    {isHovered && (
                        <Button
                            size="sm"
                            position="absolute"
                            top="10px"
                            right="10px"
                            onClick={() => setIsEditing(true)}
                        >
                            <Icon as={MdEdit} color='secondaryGray.500' h='18px' w='18px'/>
                        </Button>
                    )}
                </Box>
            )}
        </Card>
    );
}