import React from "react";
import {
    Flex,
    Table,
    Progress,
    Icon,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    Tooltip,
    useColorModeValue
} from "@chakra-ui/react";
import {MdCheckCircle, MdCancel, MdOutlineError} from "react-icons/md";
import Card from "../../../components/card/Card.js";

export default function ReportsTable({reports}) {
    const calculateProgress = (report) => {
        const countFilledFields = (data) => {
            let totalFields = 0;
            let filledFields = 0;

            const traverse = (obj) => {
                Object.values(obj).forEach((value) => {
                    if (typeof value === 'object' && value !== null) {
                        traverse(value);
                    } else {
                        totalFields++;
                        if (value !== null && value !== 0 && value !== '') {
                            filledFields++;
                        }
                    }
                });
            };

            traverse(data);
            return {totalFields, filledFields};
        };

        const {totalFields, filledFields} = countFilledFields(report.data);
        return (filledFields / totalFields) * 100;
    };
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");

    return (
        <Card direction='column' w='100%' p='20px' overflowX={{sm: "scroll", lg: "hidden"}}>
            <Flex px='25px' justify='space-between' mb='10px' align='center'>
                <Text color={textColor} fontSize='22px' fontWeight='700' lineHeight='100%'>
                    Reports Table
                </Text>
            </Flex>
            <Table variant='simple' color='gray.500'>
                <Thead>
                    <Tr>
                        <Th pe='10px' borderColor={borderColor}>Name</Th>
                        <Th pe='10px' borderColor={borderColor}>Status</Th>
                        <Th pe='10px' borderColor={borderColor}>Last Updated</Th>
                        <Th pe='10px' borderColor={borderColor}>Progress</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {reports.map((report, index) => {
                        const progress = calculateProgress(report);

                        return (
                            <Tr key={index}>
                                <Td fontSize='sm' fontWeight='700' color={textColor} py={0} pl={5}>{report.name}</Td>
                                <Td fontSize='sm' fontWeight='700' color={textColor} py={0} px={2}>
                                    <Flex align='center'>
                                        <Icon
                                            w='24px'
                                            h='24px'
                                            me='5px'
                                            color={
                                                progress > 85 ? "green.500" :
                                                    progress < 15 ? "red.500" :
                                                        "yellow.500"
                                            }
                                            as={
                                                progress > 85 ? MdCheckCircle :
                                                    progress < 15 ? MdCancel :
                                                        MdOutlineError
                                            }
                                        />
                                        <Text color={textColor} fontSize='sm' fontWeight='700'>
                                            {progress > 85 ? 'Active' :
                                                progress < 15 ? 'Inactive' :
                                                    'Incomplete'}
                                        </Text>
                                    </Flex>
                                </Td>

                                <Td fontSize='sm' fontWeight='700' color={textColor} py={0} pl={7}>
                                    {report.lastUpdated ? new Date(report.lastUpdated).toLocaleDateString() : 'N/A'}
                                </Td>
                                <Td fontSize='sm' fontWeight='700'>
                                    <Tooltip label={`${progress.toFixed(2)}%`} aria-label='Progress tooltip'>
                                        <Flex align='center'>
                                            <Progress
                                                variant='table'
                                                colorScheme='brandScheme'
                                                h='8px'
                                                w='108px'
                                                value={progress}
                                            />
                                        </Flex>
                                    </Tooltip>
                                </Td>
                            </Tr>
                        );
                    })}
                </Tbody>
            </Table>
        </Card>
    );
}
