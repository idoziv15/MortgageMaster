import React from "react";
import {
    useDisclosure,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Flex,
    ModalOverlay,
    ModalContent,
    ModalHeader, Heading, ModalCloseButton, ModalBody, ModalFooter, Modal
} from '@chakra-ui/react'

export default function SaveReportModal({isOpen, onClose, reportName, setReportName, reportDescription, setReportDescription, handleSaveReport}) {

    return (
        <Modal isCentered onClose={onClose} isOpen={isOpen} motionPreset='slideInBottom'>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    <Heading textAlign="left">Save Current Report</Heading>
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    <FormControl>
                        <FormLabel>Report Name</FormLabel>
                        <Input value={reportName ? reportName : ''} onChange={(e) => setReportName(e.target.value)}/>
                    </FormControl>
                    <FormControl mt={4}>
                        <FormLabel>Report Description</FormLabel>
                        <Textarea value={reportDescription ? reportDescription : ''}
                                  onChange={(e) => setReportDescription(e.target.value)}/>
                    </FormControl>
                    <Flex mt={4} justifyContent="flex-end">
                        <Button mr={4} onClick={onClose}>Cancel</Button>
                        <Button colorScheme="blue" onClick={handleSaveReport}>Save Report</Button>
                    </Flex>
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    );
}
