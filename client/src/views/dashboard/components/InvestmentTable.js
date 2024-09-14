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
    GridItem, Switch, Select
} from '@chakra-ui/react';

export default function InvestmentTable({tableName, data, setData}) {
    const handleInputChange = (key, value) => {
        setData(prevData => ({
            ...prevData,
            [key]: {
                ...prevData[key],
                value: value
            }
        }));
    };

    const handleNestedChange = (field, subfield, value) => {
        setData(prevState => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                [subfield]: parseFloat(value) || 0,
            },
        }));
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
                            const isOptional = false;
                            const label = key.replace(/_/g, ' ');

                            return (
                                <Grid templateColumns="repeat(3, 1fr)" gap={4} alignItems="center" key={key}>
                                    <GridItem>
                                        <FormLabel m={0} fontSize="sm">{label} {isOptional && '(Optional)'}</FormLabel>
                                    </GridItem>
                                    {key === 'additional_transaction_costs_dic' || key === 'renovation_expenses_dic' ? (
                                        <Box display="flex" alignItems="center">
                                            {Object.keys(data[key]).map(subKey => (
                                                <Input
                                                    key={subKey}
                                                    placeholder={subKey}
                                                    value={data[key][subKey] || ''}
                                                    type="number"
                                                    size="sm"
                                                    bg="gray.100"
                                                    width="calc(44%)"
                                                    my={1}
                                                    mr={1}
                                                    onChange={e => handleNestedChange(key, subKey, e.target.value)}
                                                />
                                            ))}
                                        </Box>
                                    ) : (
                                        <>
                                            <GridItem>
                                                <Input
                                                    size="sm"
                                                    type="number"
                                                    bg="gray.100"
                                                    width="90%"
                                                    p={1}
                                                    my={0.5}
                                                    value={value !== null ? value : 0}
                                                    onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
                                                />
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
