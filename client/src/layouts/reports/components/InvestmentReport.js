import {
    Badge,
    Box,
    Button,
    CardBody,
    CardFooter,
    Divider,
    Flex,
    Heading,
    Stack,
    Text,
    Image,
    Card,
    useColorModeValue,
    Input,
    useToast,
    Spinner,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody, Textarea, IconButton,
} from "@chakra-ui/react";
import React, {useEffect, useRef, useState} from "react";
import moment from "moment";
import {TimeIcon} from "@chakra-ui/icons";
import {FaArrowRight, FaEdit, FaCheck, FaTrash, FaDownload, FaChevronUp, FaChevronDown} from "react-icons/fa";
import reportImg from "../../../assets/img/reports/report_preview.svg";
import {Link} from "react-router-dom";
import axios from "axios";

export default function InvestmentReport({report, onDelete}) {
    const badgeColor = useColorModeValue("red.500", "red.300");
    const [lastUpdatedDate, setLastUpdatedDate] = useState(moment(report['created_at']));
    const isNew = moment().diff(lastUpdatedDate, 'hours') < 24;

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(report.name);
    const [description, setDescription] = useState(report.description);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const textRef = useRef(null);
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
        setLoading(true);
        const token = getToken();
        try {
            const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/investment_report/${report._id}`, {
                name,
                description
            }, {
                headers: {Authorization: `Bearer ${token}`}
            });
            if (response.status === 200) {
                setLastUpdatedDate(moment());
                toast({
                    title: "Success",
                    description: "Report updated successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setIsEditing(false);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update report.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setLoading(false);
    };

    const handleCancel = () => {
        setName(report.name);
        setDescription(report.description);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const token = getToken();
        try {
            const response = await axios.delete(`${process.env.REACT_APP_SERVER_URL}/investment_report/${report._id}`, {
                headers: {Authorization: `Bearer ${token}`}
            });
            if (response.status === 200) {
                toast({
                    title: "Success",
                    description: "Report deleted successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                onDelete(report._id);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete report.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
        setIsDeleting(false);
    };

    const handleDownloadReport = async () => {
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');

            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/report/${report._id}/download`, {
                headers: {Authorization: `Bearer ${token}`},
                responseType: 'blob',  // To handle binary data
            });

            // Create a download link and click it programmatically
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${report.name}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();

        } catch (error) {
            console.error('Error downloading report:', error);
            toast({
                title: 'Error downloading report',
                description: 'An error occurred while trying to download the report.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (textRef.current) {
            const isOverflow = textRef.current.scrollHeight > textRef.current.clientHeight;
            setIsOverflowing(isOverflow);
        }
    }, [description, isEditing]);

    return (
        <Card maxW='xs' position="relative"
              transition="transform 0.2s"
              _hover={{transform: "scale(1.05)"}}
              borderRadius="md"
              boxShadow="lg"
              cursor="pointer"
        >
            {isNew && (
                <Badge
                    position="absolute"
                    top="-10px"
                    right="-10px"
                    bg={badgeColor}
                    color="white"
                    borderRadius="full"
                    px="2"
                    py="1"
                >
                    NEW
                </Badge>
            )}
            <CardBody py={3}>
                <Image src={reportImg} alt='Report preview' borderRadius='sm' width="100%" objectFit="cover"/>
                <Stack mt='6' spacing='1'>
                    {isEditing ? (
                        <>
                            <Input size='sm' value={name}
                                   onChange={(e) => setName(e.target.value)}
                            />
                            <Textarea size='sm' value={description}
                                      onChange={(e) => setDescription(e.target.value)}
                            />
                        </>
                    ) : (
                        <>
                            <Heading size='sm'>{name}</Heading>
                            <Text size='sm' ref={textRef} noOfLines={isExpanded ? undefined : 1}>
                                {isOverflowing && (
                                    <IconButton
                                        size="sm"
                                        aria-label={isExpanded ? "Collapse" : "Expand"}
                                        icon={isExpanded ? <FaChevronUp/> : <FaChevronDown/>}
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        variant="ghost"
                                        alignSelf="start"
                                    />
                                )}
                                {description}
                            </Text>
                        </>
                    )}
                    <Flex align="center" color="blue.600" fontSize="sm">
                        <TimeIcon mr="2"/>
                        <Text>{lastUpdatedDate.format('MMM Do, h:mm a')}</Text>
                    </Flex>
                </Stack>
            </CardBody>
            <Divider/>
            <CardFooter p={2} display="flex" justifyContent="space-between">
                <Link to={`/report/${report._id}`}>
                    <Button size='sm' variant='solid' colorScheme='blue'>
                        View
                        <Box as={FaArrowRight} ml={1}/>
                    </Button>
                </Link>
                {isEditing ? (
                    <Flex>
                        <Button size='sm' variant='solid' colorScheme='green' onClick={handleSave} ml={2}>
                            <FaCheck/>
                        </Button>
                        <Button size='sm' variant='outline' colorScheme='red' onClick={handleCancel} ml={2}>
                            X
                        </Button>
                    </Flex>
                ) : (
                    <Flex>
                        <Button size='sm' variant='outline' colorScheme='green' onClick={() => handleDownloadReport()}
                                ml={2}>
                            <FaDownload/>
                        </Button>
                        <Button size='sm' variant='outline' colorScheme='blue' onClick={() => setIsEditing(true)}
                                ml={2}>
                            <FaEdit/>
                        </Button>
                        <Button size='sm' variant='outline' colorScheme='red' onClick={handleDelete} ml={2}>
                            <FaTrash/>
                        </Button>
                    </Flex>
                )}
            </CardFooter>
            {loading && (
                <Modal isOpen={loading} onClose={() => {
                }} isCentered>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalBody display="flex" justifyContent="center" alignItems="center" py={10}>
                            <Spinner size="xl"/>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
            {isDeleting && (
                <Modal isOpen={isDeleting} onClose={() => {
                }} isCentered>
                    <ModalOverlay/>
                    <ModalContent>
                        <ModalBody display="flex" justifyContent="center" alignItems="center" py={10}>
                            <Spinner size="xl"/>
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </Card>
    );
}
