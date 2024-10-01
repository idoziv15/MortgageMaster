import React from 'react';
import {
    Box,
    Input,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    FormLabel,
    ChakraProvider,
    Card,
    Heading,
    CardHeader,
    CardBody,
    Grid,
    GridItem, Select, InputGroup, InputRightElement, Icon, Tooltip
} from '@chakra-ui/react';
import {MdAttachMoney} from "react-icons/md";

const tooltipMap = {
    'net_monthly_income': "The total income received by the investor on a monthly basis after taxes.",
    'total_debt_payment': "The total monthly debt payments the investor is obligated to pay.",
    'total_available_equity': "The total equity available to the investor for financing new investments.",
    'gross_rental_income': "The total income generated from rental properties before any expenses.",
    'yearly_revenue': "The projected revenue generated by the investor's properties on an annual basis.",
    'yearly_expenses': "The projected expenses incurred by the investor's properties on an annual basis."
};

export default function InvestorTable({tableName, data, setData, chosenCurrency}) {
    const handleInputChange = (key, value) => {
        setData(prevData => {
            if (prevData[key].value === value) return prevData;
            return {
                ...prevData,
                [key]: {
                    ...prevData[key],
                    value: value
                }
            };
        });
    };

    const handleListInputBlur = (key) => {
        const rawValue = data[key].value;
        if (typeof rawValue === 'string') {
            setData(prevData => ({
                ...prevData,
                [key]: {
                    ...prevData[key],
                    value: rawValue.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
                }
            }));
        }
    };

    return (
        <ChakraProvider>
            <Box p={4}>
                <Card pt={2}>
                    <CardHeader py={1} px={3} display="flex" justifyContent="space-between" alignItems="center">
                        <Heading size="md">{tableName}</Heading>
                    </CardHeader>
                    <CardBody py={1} px={3}>
                        {Object.entries(data).map(([key, field]) => {
                            const {value, range, step} = field;
                            const isList = Array.isArray(value);
                            const isOptional = false;
                            const label = key.replace(/_/g, ' ');
                            const tooltipText = tooltipMap[key];

                            return (
                                <Grid templateColumns="repeat(3, 1fr)" gap={4} alignItems="center" key={key}>
                                    <GridItem>
                                        <Tooltip label={tooltipText} fontSize="md" placement='right-start' hasArrow>
                                            <FormLabel m={0}
                                                       fontSize="sm">{label} {isOptional && '(Optional)'}</FormLabel>
                                        </Tooltip>
                                    </GridItem>
                                    {isList ? (
                                        <GridItem colSpan={2}>
                                            <Input
                                                key={`${key}-list`}
                                                size="sm"
                                                type="text"
                                                bg="gray.100"
                                                width="100%"
                                                p={1}
                                                my={0.5}
                                                value={value.join(', ')}
                                                placeholder="Enter values separated with a comma"
                                                onChange={(e) => handleInputChange(key, e.target.value.split(',').map(item => item.trim()))}
                                                onBlur={() => handleListInputBlur(key)}
                                            />
                                        </GridItem>
                                    ) : (
                                        <>
                                            <GridItem>
                                                <InputGroup>
                                                    <Input
                                                        key={`${key}-input`}
                                                        size="sm"
                                                        type="number"
                                                        bg="gray.100"
                                                        width="90%"
                                                        p={1}
                                                        my={0.5}
                                                        value={value !== null ? value : 0}
                                                        onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
                                                    />
                                                    <InputRightElement pl={3} pointerEvents="none">
                                                        <Icon as={chosenCurrency.icon} color="gray.500"/>
                                                    </InputRightElement>
                                                </InputGroup>
                                            </GridItem>
                                            <GridItem>
                                                <Slider
                                                    value={value !== null ? value : 0}
                                                    onChange={(value) => handleInputChange(key, value)}
                                                    min={range ? range[0] : 0}
                                                    max={range ? range[1] : 100}
                                                    step={step || 0.1}
                                                    size="sm"
                                                    width="90%"
                                                >
                                                    <SliderTrack>
                                                        <SliderFilledTrack bg="teal.500"/>
                                                    </SliderTrack>
                                                    <SliderThumb bg="teal.500"/>
                                                </Slider>
                                            </GridItem>
                                        </>
                                    )}
                                </Grid>
                            );
                        })}
                    </CardBody>
                </Card>
            </Box>
        </ChakraProvider>
    );
}
