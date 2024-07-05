import React from "react";
import {
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure, Button,
    Box, Heading
} from '@chakra-ui/react'
import AddInvestorBtn from '../buttons/AddInvestorBtn'
import AddInvestorForm from "../forms/AddInvestorForm";

export default function AddInvestorProfileModal() {
    const {isOpen, onOpen, onClose} = useDisclosure()
    return (
        <>
            <Box position="fixed" bottom="60px" right="30px" zIndex="1000">
                <AddInvestorBtn onClick={onOpen}/>
            </Box>
            <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset='slideInBottom'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>
                        <Heading textAlign="left">Investor Profile</Heading>
                    </ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <AddInvestorForm/>
                    </ModalBody>
                    <ModalFooter>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}