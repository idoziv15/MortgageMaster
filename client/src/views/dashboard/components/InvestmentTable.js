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
    GridItem, Switch, Select, Tooltip, InputRightElement, Icon, InputGroup
} from '@chakra-ui/react';
import {
    MdAttachMoney,
    MdBusinessCenter,
    MdGavel,
    MdHomeRepairService,
    MdHandyman,
    MdShield,
    MdEvent,
    MdPercent
} from 'react-icons/md';
import {FaHandsHelping, FaUserTie, FaCouch, FaRegHandshake} from 'react-icons/fa';

export default function InvestmentTable({
                                            tableName, data, setData, propertyData,
                                            isFirstInvestment, setIsFirstInvestment, chosenCurrency
                                        }) {
    const [purchasePrice, setPurchasePrice] = useState(propertyData.purchase_price.value);
    const resetCosts = ['appraiser_cost', 'lawyer_cost', 'escort_costs', 'mortgage_advisor_cost',
        'broker_purchase_percentage', 'broker_sell_percentage', 'broker_rent_percentage',
        'additional_transaction_costs', 'renovation_expenses'];
    const iconMapping = {
        'appraiser_cost': chosenCurrency.icon,
        'lawyer_cost': MdGavel,
        'escort_costs': FaHandsHelping,
        'mortgage_advisor_cost': FaUserTie,
        'additional_transaction_costs': chosenCurrency.icon,
        'renovation_expenses': MdHomeRepairService,
        'furniture_cost': FaCouch,
        'broker_purchase_percentage': FaRegHandshake,
        'broker_rent_percentage': MdBusinessCenter,
        'broker_sell_percentage': MdBusinessCenter,
        'vacancy_percentage': MdPercent,
        'annual_maintenance_cost_percentage': MdHandyman,
        'annual_life_insurance_cost': MdShield,
        'annual_house_insurance_cost': MdShield,
        'management_fees_percentage': MdPercent,
        'years_to_exit': MdEvent
    };
    const tooltipMap = {
        'appraiser_cost': "Cost associated with hiring an appraiser to assess the property's value.",
        'lawyer_cost': "Fees for legal services related to the property transaction.",
        'escort_costs': "Expenses incurred for escort services during property viewings or transactions.",
        'mortgage_advisor_cost': "Fees paid to a mortgage advisor for assistance in obtaining financing.",
        'additional_transaction_costs': "Extra costs that may arise during the transaction process.",
        'renovation_expenses': "Total costs associated with renovating the property.",
        'furniture_cost': "Estimated costs for furnishing the property.",
        'broker_purchase_percentage': "Percentage of the purchase price paid to brokers as commission.",
        'broker_rent_percentage': "Percentage of the rent paid to brokers for rental services.",
        'broker_sell_percentage': "Percentage of the selling price paid to brokers upon sale.",
        'vacancy_percentage': "Percentage of time the property is expected to be vacant.",
        'annual_maintenance_cost_percentage': "Percentage of annual revenue allocated for maintenance expenses.",
        'annual_life_insurance_cost': "Cost of life insurance associated with the property investment.",
        'annual_house_insurance_cost': "Insurance costs for the house on an annual basis.",
        'management_fees_percentage': "Percentage of revenue allocated for property management fees.",
        'years_to_exit': "Estimated number of years until the investment is sold or exited."
    };

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
                                    colorScheme="teal"
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
                                    <GridItem>
                                        <Tooltip
                                            label="Change purchase price to be greater than 0"
                                            isDisabled={!isDisabled}
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
                                                    value={value !== null ? value : 0}
                                                    onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
                                                    isDisabled={isDisabled}
                                                    max={isDisabled ? maxRange : range ? range[1] : 100}
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
