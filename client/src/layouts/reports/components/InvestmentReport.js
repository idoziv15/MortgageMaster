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
    ModalBody,
} from "@chakra-ui/react";
import React, {useState} from "react";
import moment from "moment";
import {TimeIcon} from "@chakra-ui/icons";
import {FaArrowRight, FaEdit} from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import reportImg from "../../../assets/img/reports/report_preview.svg";
import {Link} from "react-router-dom";
import axios from "axios";

export default function InvestmentReport({report}) {
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const badgeColor = useColorModeValue("red.500", "red.300");
    const [lastUpdatedDate, setLastUpdatedDate] = useState(moment(report.lastUpdated));
    const isNew = moment().diff(lastUpdatedDate, 'hours') < 24;

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(report.name);
    const [description, setDescription] = useState(report.description);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const handleSave = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:5000/investment_report/${report.id}`, {
                name,
                description
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

    return (
        <Card maxW='xs' position="relative">
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
                            <Input
                                size='sm'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                size='sm'
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </>
                    ) : (
                        <>
                            <Heading size='sm'>{name}</Heading>
                            <Text size='sm'>{description}</Text>
                        </>
                    )}
                    <Flex align="center" color="blue.600" fontSize="sm">
                        <TimeIcon mr="2"/>
                        <Text>{lastUpdatedDate.format('MMM Do, h:mm a')}</Text>
                    </Flex>
                </Stack>
            </CardBody>
            <Divider/>
            <CardFooter py={2} display="flex" justifyContent="space-between">
                <Link to={`/report/${report.id}`}>
                    <Button size='sm' variant='solid' colorScheme='blue'>
                        View report
                        <Box as={FaArrowRight} ml={2}/>
                    </Button>
                </Link>
                {isEditing ? (
                    <Flex>
                        <Button size='sm' variant='solid' colorScheme='green' onClick={handleSave} ml={2}>
                            <FaCheck />
                        </Button>
                        <Button size='sm' variant='outline' colorScheme='red' onClick={handleCancel} ml={2}>
                            X
                        </Button>
                    </Flex>
                ) : (
                    <Button size='sm' variant='outline' colorScheme='blue' onClick={() => setIsEditing(true)} ml={2}>
                        <FaEdit/>
                    </Button>
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
        </Card>
    );
}
