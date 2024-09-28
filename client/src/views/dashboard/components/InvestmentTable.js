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
    GridItem, Switch, Select
} from '@chakra-ui/react';

export default function InvestmentTable({tableName, data, setData, propertyData, isFirstInvestment, setIsFirstInvestment}) {
    const [purchasePrice, setPurchasePrice] = useState(propertyData.purchase_price.value);
    const resetCosts = ['appraiser_cost', 'lawyer_cost', 'escort_costs', 'mortgage_advisor_cost',
        'broker_purchase_percentage', 'broker_sell_percentage', 'broker_rent_percentage',
        'additional_transaction_costs', 'renovation_expenses'];
    const handleInputChange = (key, value) => {
        const maxValues = {
            furniture_cost: purchasePrice * 0.3
        };

        if (purchasePrice === 0) {
            // Reset the value to 0 for keys in resetCosts, furniture_cost, and broker_rent_percentage
            if (resetCosts.includes(key) || key === 'furniture_cost') {
                value = 0;
            }
        } else if (key in maxValues) {
            value = Math.min(value, maxValues[key]);
        }

        setData(prevData => ({
            ...prevData,
            [key]: {
                ...prevData[key],
                value: value
            }
        }));
    };

    useEffect(() => {
        const maxAllowedValue = purchasePrice * 0.1;

        resetCosts.forEach(cost => {
            const currentValue = data[cost]?.value || 0;

            // Only update if the current value exceeds the max allowed
            if (currentValue > maxAllowedValue) {
                setData(prevData => ({
                    ...prevData,
                    [cost]: {
                        ...prevData[cost],
                        value: maxAllowedValue
                    }
                }));
            }
        });

        if (data.furniture_cost?.value > purchasePrice * 0.3) {
            setData(prevData => ({
                ...prevData,
                furniture_cost: {
                    ...prevData.furniture_cost,
                    value: purchasePrice * 0.3
                }
            }));
        }

        if (data.broker_rent_percentage?.value > purchasePrice * 0.2) {
            setData(prevData => ({
                ...prevData,
                broker_rent_percentage: {
                    ...prevData.broker_rent_percentage,
                    value: purchasePrice * 0.2
                }
            }));
        }

    }, [purchasePrice, data, setData]);

    useEffect(() => {
        setPurchasePrice(propertyData.purchase_price.value);
    }, [propertyData.purchase_price.value]);

    return (
        <ChakraProvider>
            <Box p={4}>
                <Card pt={2}>
                    <CardHeader py={1} px={3} display="flex" justifyContent="space-between" alignItems="center">
                        <Heading size="md">{tableName}</Heading>
                    </CardHeader>
                    <CardBody py={1} px={3}>
                        <Grid templateColumns="repeat(3, 1fr)" gap={4} alignItems="center">
                            <GridItem>
                                <FormLabel m={0} fontSize="sm">Is this your first property investment?</FormLabel>
                            </GridItem>
                            <GridItem>
                                <Switch
                                    my={0.5}
                                    isChecked={isFirstInvestment}
                                    onChange={() => setIsFirstInvestment(!isFirstInvestment)}
                                />
                            </GridItem>
                        </Grid>
                        {Object.entries(data).map(([key, field]) => {
                            const {value, range, step} = field;
                            const isDisabled = purchasePrice === 0 && resetCosts.includes(key);
                            const maxRange = purchasePrice * 0.1;
                            const isOptional = false;
                            const label = key.replace(/_/g, ' ');

                            return (
                                <Grid templateColumns="repeat(3, 1fr)" gap={4} alignItems="center" key={key}>
                                    <GridItem>
                                        <FormLabel m={0} fontSize="sm">{label} {isOptional && '(Optional)'}</FormLabel>
                                    </GridItem>
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
                                            isDisabled={isDisabled}
                                            max={isDisabled ? maxRange : range ? range[1] : 100}
                                        />
                                    </GridItem>
                                    <GridItem>
                                        <Slider
                                            value={value !== null ? value : 0}
                                            onChange={(value) => handleInputChange(key, value)}
                                            min={range ? range[0] : 0}
                                            max={isDisabled ? maxRange : range ? range[1] : 100}
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
                                </Grid>
                            );
                        })}
                    </CardBody>
                </Card>
            </Box>
        </ChakraProvider>
    );
}
