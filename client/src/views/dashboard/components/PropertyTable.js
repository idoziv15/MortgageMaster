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
    GridItem, Switch, Select, useToast, Icon, InputGroup, InputRightElement, Tooltip
} from '@chakra-ui/react';
import {
    MdAttachMoney,
    MdBalcony,
    MdLocalParking,
    MdPercent,
    MdRealEstateAgent,
    MdWarehouse
} from "react-icons/md";
import {TbRulerMeasure} from "react-icons/tb";

export default function PropertyTable({tableName, data, setData, chosenCurrency}) {
    const toast = useToast();
    const iconMapping = {
        'purchase_price': chosenCurrency.icon,
        'monthly_rent_income': chosenCurrency.icon,
        'real_estate_investment_type': MdRealEstateAgent,
        'square_meters': TbRulerMeasure,
        'warehouse': MdWarehouse,
        'parking_spots': MdLocalParking,
        'balcony_square_meter': MdBalcony,
        'after_repair_value': chosenCurrency.icon,
        'annual_appreciation_percentage': MdPercent
    };

    const tooltipMap = {
    'purchase_price': "The total price for purchasing the property.",
    'monthly_rent_income': "The expected monthly rental income from the property.",
    'real_estate_investment_type': "The type of real estate investment (e.g., single apartment, multi-family, etc.).",
    'square_meters': "The total area of the property measured in square meters.",
    'parking_spots': "The number of parking spots available with the property.",
    'warehouse': "Indicates whether the property includes a warehouse (true/false).",
    'balcony_square_meter': "The area of the balcony measured in square meters.",
    'after_repair_value': "The estimated market value of the property after repairs and renovations.",
    'annual_appreciation_percentage': "The projected percentage increase in property value each year."
};
    const handleInputChange = (key, value) => {
        // Validate after_repair_value
        if (key === 'after_repair_value' && value < data.purchase_price.value) {
            toast({
                title: "Invalid Value",
                description: "After Repair Value must be at least equal to the Purchase Price.",
                status: "error",
                duration: 4000,
                isClosable: true,
            });
            return;
        }

        // Handle change for purchase_price and adjust after_repair_value accordingly
        if (key === 'purchase_price') {
            setData(prevData => {
                const updatedAfterRepairValue = prevData.after_repair_value.value < value ? value : prevData.after_repair_value.value;

                return {
                    ...prevData,
                    [key]: {
                        ...prevData[key],
                        value: value
                    },
                    after_repair_value: {
                        ...prevData.after_repair_value,
                        value: updatedAfterRepairValue
                    }
                };
            });
            return;
        }

        setData(prevData => ({
            ...prevData,
            [key]: {
                ...prevData[key],
                value: value
            }
        }));
    };

    const handleToggleChange = (key) => {
        setData(prevState => ({
            ...prevState,
            [key]: {
                ...prevState[key],
                value: !prevState[key].value
            }
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
                            const isString = typeof value === 'string';
                            const isBoolean = typeof value === 'boolean';
                            const isOptional = false;
                            const label = key.replace(/_/g, ' ');
                            const IconComponent = iconMapping[key];
                            const tooltipText = tooltipMap[key];

                            return (
                                <Grid templateColumns="repeat(3, 1fr)" gap={4} alignItems="center" key={key}>
                                    <GridItem>
                                        <Tooltip label={tooltipText} fontSize="md" placement='right-start' hasArrow>
                                            <FormLabel m={0}
                                                       fontSize="sm">{label} {isOptional && '(Optional)'}</FormLabel>
                                        </Tooltip>
                                    </GridItem>
                                    {isString ? (
                                        <GridItem colSpan={2}>
                                            <Select value={value} size="sm" bg="gray.100" width="43%"
                                                    onChange={e => handleInputChange(key, e.target.value)}>
                                                <option value="single apartment">Single Apartment</option>
                                                <option value="alternative apartment">Alternative Apartment</option>
                                                <option value="additional apartment">Additional Apartment</option>
                                            </Select>
                                        </GridItem>
                                    ) : isBoolean ? (
                                        <GridItem colSpan={2}>
                                            <Switch
                                                isChecked={data[key].value}
                                                onChange={() => handleToggleChange(key)}
                                                size="md"
                                                colorScheme="teal"
                                                m={1}
                                            />
                                        </GridItem>
                                    ) : (
                                        <>
                                            <GridItem>
                                                <InputGroup>
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
                                                    {IconComponent &&
                                                        <InputRightElement pointerEvents="none" pl="1rem">
                                                            <Icon as={IconComponent} color="gray.500"/>
                                                        </InputRightElement>
                                                    }
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
