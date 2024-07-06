import React from "react";
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button,
    Box, FormControl, FormLabel, FormErrorMessage, FormHelperText, InputGroup, Input, Textarea, Heading
} from '@chakra-ui/react'
import AddBtn from '../buttons/AddAssetBtn'
import AddAssetForm from "../forms/AddAssetForm";

export default function AddAssetModal() {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <>
            <Box position="fixed" bottom="60px" right="30px" zIndex="1000">
                <AddBtn onClick={onOpen}/>
            </Box>
            <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset='slideInBottom'>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>
                        <Heading textAlign="left">Property Information</Heading>
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <AddAssetForm/>
                    </ModalBody>
                    <ModalFooter>
                        {/*<Button colorScheme='blue' mr={3} onClick={onClose} variant='outline'>Close</Button>*/}
                        {/*<Button colorScheme="green" type="submit" width="full">Save</Button>*/}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}