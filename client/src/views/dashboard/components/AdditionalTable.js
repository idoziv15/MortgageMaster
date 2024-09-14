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
    GridItem
} from '@chakra-ui/react';

export default function AdditionalTable({tableName, data, setData}) {
    const handleInputChange = (key, value) => {
        setData(prevData => ({
            ...prevData,
            [key]: {
                ...prevData[key],
                value: value
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

    return (
        <ChakraProvider>
            <Box p={4}>
                <Card>
                    <CardHeader py={1} px={3} display="flex" justifyContent="space-between" alignItems="center">
                        <Heading size="md">{tableName}</Heading>
                    </CardHeader>
                    <CardBody py={1} px={3}>
                        {Object.entries(data).map(([key, field]) => {
                            const {value, range, step} = field;
                            const isList = Array.isArray(value);
                            const isOptional = false;
                            const label = key.replace(/_/g, ' ');

                            return (
                                <Grid templateColumns="repeat(3, 1fr)" gap={4} alignItems="center" key={key}>
                                    <GridItem>
                                        <FormLabel m={0} fontSize="sm">{label} {isOptional && '(Optional)'}</FormLabel>
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
                                                onChange={(e) => handleInputChange(key, e.target.value.split(',').map(item => item.trim()))}
                                                onBlur={() => handleListInputBlur(key)}
                                            />
                                        </GridItem>
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
