import React, {useEffect, useState} from 'react';
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
    GridItem, Tooltip, InputRightElement, Icon, InputGroup
} from '@chakra-ui/react';
import {MdCalendarToday, MdPayments, MdTrendingUp} from 'react-icons/md';

export default function AdditionalTable({tableName, data, setData, investmentData}) {
    const otherIconMapping = {
        'years_until_key_reception': MdCalendarToday,
        'contractor_payment_distribution': MdPayments,
        'construction_input_index_annual_growth': MdTrendingUp
    };
    const tooltipMap = {
        'years_until_key_reception': "The estimated number of years until the property keys are received.",
        'contractor_payment_distribution': "The distribution of payments made to contractors throughout the project.",
        'construction_input_index_annual_growth': "The projected annual growth rate of construction input indices affecting project costs."
    };
    const [yearsToExit, setYearsToExit] = useState(investmentData.years_to_exit.value);
    const [inputValues, setInputValues] = useState({});

    useEffect(() => {
        const initialValues = Object.keys(data).reduce((acc, key) => {
            acc[key] = data[key].value || 0;
            return acc;
        }, {});
        setInputValues(initialValues);
    }, [data]);
    const handleInputChange = (key, value) => {
        if (key === 'years_until_key_reception' && value > yearsToExit) {
            // Set value to years_to_exit if it exceeds the limit
            value = yearsToExit;
        }

        setInputValues((prevValues) => ({
            ...prevValues,
            [key]: value
        }));
    };

    const handleInputBlur = (key) => {
        setData(prevData => ({
            ...prevData,
            [key]: {
                ...prevData[key],
                value: inputValues[key]
            }
        }));
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

    const handleInputListChange = (key, value) => {
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

    useEffect(() => {
        setYearsToExit(investmentData.years_to_exit.value);

        // Check if years_until_key_reception exceeds the new years_to_exit value
        const yearsUntilKeyReception = data.years_until_key_reception?.value;
        if (yearsUntilKeyReception > investmentData.years_to_exit.value) {
            // Lower it to match the new years_to_exit value
            setData(prevData => ({
                ...prevData,
                years_until_key_reception: {
                    ...prevData.years_until_key_reception,
                    value: investmentData.years_to_exit.value
                }
            }));
        }
    }, [investmentData.years_to_exit.value]);

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
                            const maxLimit = key === 'years_until_key_reception' ? yearsToExit : (range ? range[1] : 30);
                            const IconComponent = otherIconMapping[key];
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
                                                size="sm"
                                                type="text"
                                                bg="gray.100"
                                                width="100%"
                                                p={1}
                                                my={0.5}
                                                value={value.join(', ')}
                                                placeholder="Enter values separated with a comma"
                                                onChange={(e) => handleInputListChange(key, e.target.value.split(',').map(item => item.trim()))}
                                                onBlur={() => handleListInputBlur(key)}
                                            />
                                        </GridItem>
                                    ) : (
                                        <>
                                            <GridItem>
                                                <Tooltip
                                                    label="Has to be lower or equal to years to exit"
                                                    placement="top"
                                                >
                                                    <InputGroup>
                                                        <Input
                                                            size="sm"
                                                            type="number"
                                                            bg="gray.100"
                                                            width="90%"
                                                            p={1}
                                                            my={0.5}
                                                            value={inputValues[key]}
                                                            onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
                                                            onBlur={() => handleInputBlur(key)}
                                                            max={maxLimit}
                                                        />
                                                        {IconComponent && (
                                                            <InputRightElement pointerEvents="none" pl="1rem">
                                                                <Icon as={IconComponent} color="gray.500"/>
                                                            </InputRightElement>
                                                        )}
                                                    </InputGroup>
                                                </Tooltip>
                                            </GridItem>
                                            <GridItem>
                                                <Slider
                                                    value={value !== null ? value : 0}
                                                    onChange={(value) => handleInputListChange(key, value)}
                                                    min={range ? range[0] : 0}
                                                    max={maxLimit}
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
    )
        ;
}
