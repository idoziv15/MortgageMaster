import React, { useState } from "react";
import { Box, Text, useColorModeValue, Input, Button, Flex, Icon, useToast } from "@chakra-ui/react";
import Card from "../../../components/card/Card.js";
import { MdEdit } from "react-icons/md";
import axios from "axios";

export default function UserDetail(props) {
  const { title, value, onUpdateDetail, ...rest } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [newValue, setNewValue] = useState(value);
  const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
  const textColorSecondary = useColorModeValue("gray.400", "gray.400");
  const bg = useColorModeValue("white", "navy.700");
  const toast = useToast();

  const handleSave = async () => {
    try {
      let userId = ''; // TODO: Replace with actual user ID or logic to get user ID
      const response = await axios.put(`http://localhost:5000/user-detail/${userId}`, {
        [title.toLowerCase().replace(" ", "_")]: newValue,
      });
      onUpdateDetail(newValue);
      setIsEditing(false);
      toast({
        title: "Success",
        description: response.data.message || "Detail updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
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
              <Icon as={MdEdit} color='secondaryGray.500' h='18px' w='18px' />
            </Button>
          )}
        </Box>
      )}
    </Card>
  );
}