import React, { useState } from "react";
import {
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Button,
    Input,
    Flex,
    Icon,
    useToast,
    useColorModeValue,
} from "@chakra-ui/react";
import { MdEdit } from "react-icons/md";

export default function PropertyDetailTable({ propertyDetails }) {
    const [editingField, setEditingField] = useState(null);
    const [newValues, setNewValues] = useState({});
    const toast = useToast();
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");

    const filteredDetails = Object.entries(propertyDetails)
        .filter(([key]) => !["id", "imageUrl", "imageAlt"].includes(key))
        .reduce((acc, [key, value]) => {
            acc[key] = value;
            return acc;
        }, {});

    const handleEdit = (field, value) => {
        setEditingField(field);
        setNewValues({ ...newValues, [field]: value });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewValues({ ...newValues, [name]: value });
    };

    const handleSave = async (field) => {
        try {
            // Your logic to save the updated property details
            setEditingField(null);
            toast({
                title: "Success",
                description: "Property detail updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "There was an error updating the property detail",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleCancel = () => {
        setEditingField(null);
    };

    return (
        <TableContainer>
            <Table size="sm">
                <Thead>
                    <Tr>
                        <Th fontSize="sm">Attribute</Th>
                        <Th fontSize="sm">Value</Th>
                        <Th fontSize="sm">Edit</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {Object.entries(filteredDetails).map(([key, value]) => (
                        <Tr key={key} fontSize="sm"> {/* Adjust font size */}
                            <Td>{key.toUpperCase().replace(/_/g, " ")}</Td>
                            <Td>
                                {editingField === key && newValues[key] !== undefined ? (
                                    <Input
                                        name={key}
                                        value={newValues[key]}
                                        bg="lightgray"
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    value
                                )}
                            </Td>
                            <Td>
                                {editingField === key ? (
                                    newValues[key] !== undefined ? (
                                        <Flex>
                                            <Button
                                                size="sm"
                                                colorScheme="green"
                                                onClick={() => handleSave(key)}
                                                mr={2}
                                            >
                                                Save
                                            </Button>
                                            <Button size="sm" colorScheme="red" onClick={handleCancel}>
                                                Cancel
                                            </Button>
                                        </Flex>
                                    ) : (
                                        <Button size="sm" onClick={() => handleEdit(key, value)}>
                                            <Icon as={MdEdit} color={textColorPrimary} h="18px" w="18px" />
                                        </Button>
                                    )
                                ) : (
                                    <Button size="sm" onClick={() => handleEdit(key, value)}>
                                        <Icon as={MdEdit} color={textColorPrimary} h="18px" w="18px" />
                                    </Button>
                                )}
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </TableContainer>
    );
}
