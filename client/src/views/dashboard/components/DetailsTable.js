import React, {useEffect, useState} from 'react';
import {
    ChakraProvider,
    Box,
    Table,
    Tbody,
    Tr,
    Td,
    Input,
    Button,
    Slider,
    Heading,
    Card,
    CardHeader,
    CardBody,
    Select,
    Switch,
    SliderFilledTrack,
    SliderTrack,
    SliderThumb,
} from '@chakra-ui/react';
import {debounce} from 'lodash';

export default function DetailsTable({data, setData, tableName}) {
    const [inputValues, setInputValues] = useState(data);

    useEffect(() => {
        setInputValues(data);
    }, [data]);

    const handleChange = (field, value) => {
        const parsedValue = parseFloat(value) || 0;
        setInputValues(prev => ({
            ...prev,
            [field]: parsedValue,
        }));
        debouncedUpdate(field, parsedValue);
    };

    const debouncedUpdate = debounce((field, value) => {
        setData(prevState => ({
            ...prevState,
            [field]: value,
        }));
    }, 2000);

    const handleSliderChange = (field, value) => {
        setInputValues(prev => ({
            ...prev,
            [field]: value,
        }));
        setData(prevState => ({
            ...prevState,
            [field]: value,
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

    const handleNestedListChange = (field, index, value) => {
        setData(prevState => ({
            ...prevState,
            [field]: prevState[field].map((item, i) => i === index ? parseFloat(value) || 0 : item)
        }));
    };

    const handleAddListItem = (field) => {
        setData(prevState => ({
            ...prevState,
            [field]: [...prevState[field], 0]
        }));
    };

    const handleRemoveListItem = (field, index) => {
        setData(prevState => ({
            ...prevState,
            [field]: prevState[field].filter((_, i) => i !== index)
        }));
    };

    const handleToggleChange = (field) => {
        setData(prevState => ({
            ...prevState,
            [field]: !prevState[field],
        }));
    };

    const fieldNameMapping = {
        appraiser_cost: "Appraiser cost",
        lawyer_cost: "Lawyer cost",
        escort_costs: "Escort costs",
        additional_transaction_costs_dic: "Additional transaction costs",
        renovation_expenses_dic: "Renovation expenses",
        furniture_cost: "Furniture cost",
        broker_purchase_percentage: "Broker purchase percentage",
        broker_rent_percentage: "Broker rent percentage",
        broker_sell_percentage: "Broker sell percentage",
        vacancy_percentage: "Vacancy percentage",
        annual_maintenance_cost_percentage: "Annual maintenance cost percentage",
        annual_life_insurance_cost: "Annual life insurance cost",
        annual_house_insurance_cost: "Annual house insurance cost",
        equity_required_by_percentage: "Equity required by percentage",
        management_fees_percentage: "Management fees percentage",
        years_to_exit: "Years to exit",
        average_interest_in_exit: "Average interest in exit",
        net_monthly_income: "Net monthly income",
        total_debt_payment: "Total debt payment",
        RealEstateInvestmentType: "Real Estate Investment Type",
        total_available_equity: "Total available equity",
        gross_rental_income: "Gross rental income",
        purchase_price: "Purchase price",
        monthly_rent_income: "Monthly rent income",
        square_meters: "Square meters",
        parking_spots: "Parking spots",
        warehouse: "Warehouse",
        balcony_square_meter: "Balcony square meter",
        after_repair_value: "After repair value",
        annual_appreciation_percentage: "Annual appreciation percentage",
        years_until_key_reception: "Years until key reception",
        contractor_payment_distribution: "Contractor payment distribution",
        construction_input_index_annual_growth: "Construction input index annual growth",
    };

    const sliderRangeMapping = {
        appraiser_cost: {min: 0, max: 5000, step: 100},
        lawyer_cost: {min: 0, max: 10000, step: 200},
        escort_costs: {min: 0, max: 8000, step: 100},
        furniture_cost: {min: 0, max: 20000, step: 500},
        broker_purchase_percentage: {min: 0, max: 10, step: 0.1},
        broker_rent_percentage: {min: 0, max: 10, step: 0.1},
        broker_sell_percentage: {min: 0, max: 10, step: 0.1},
        vacancy_percentage: {min: 0, max: 100, step: 1},
        annual_maintenance_cost_percentage: {min: 0, max: 10, step: 0.1},
        annual_life_insurance_cost: {min: 0, max: 5000, step: 100},
        annual_house_insurance_cost: {min: 0, max: 5000, step: 100},
        equity_required_by_percentage: {min: 0, max: 100, step: 1},
        management_fees_percentage: {min: 0, max: 10, step: 0.1},
        years_to_exit: {min: 0, max: 30, step: 1},
        average_interest_in_exit: {min: 0, max: 20, step: 0.1},
        net_monthly_income: {min: 0, max: 20000, step: 500},
        total_debt_payment: {min: 0, max: 20000, step: 500},
        total_available_equity: {min: 0, max: 1000000, step: 10000},
        gross_rental_income: {min: 0, max: 20000, step: 500},
        purchase_price: {min: 0, max: 1000000, step: 10000},
        monthly_rent_income: {min: 0, max: 10000, step: 200},
        square_meters: {min: 0, max: 1000, step: 10},
        parking_spots: {min: 0, max: 10, step: 1},
        balcony_square_meter: {min: 0, max: 200, step: 5},
        after_repair_value: {min: 0, max: 1000000, step: 10000},
        annual_appreciation_percentage: {min: 0, max: 20, step: 0.1},
        years_until_key_reception: {min: 0, max: 10, step: 1},
        construction_input_index_annual_growth: {min: 0, max: 10, step: 0.1},
    };

    const getDisplayName = (key) => {
        return fieldNameMapping[key] || key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());
    };

    return (
        <ChakraProvider>
            <Box p={4} mx={5}>
                <Card>
                    <CardHeader py={1} px={3}>
                        <Heading size="md">{tableName}</Heading>
                    </CardHeader>
                    <CardBody py={1} px={3}>
                        <Table variant="simple" size="sm">
                            <Tbody>
                                {Object.keys(data).map((key, index) => (
                                    <Tr key={index}>
                                        <Td p={0}>{getDisplayName(key)}</Td>
                                        <Td p={0}>
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
                                                            width="calc(50% - 50px)"
                                                            my={1}
                                                            mr={1}
                                                            onChange={e => handleNestedChange(key, subKey, e.target.value)}
                                                        />
                                                    ))}
                                                </Box>
                                            ) : key === 'contractor_payment_distribution' ? (
                                                <Box>
                                                    {data[key].map((value, i) => (
                                                        <Box display="flex" alignItems="center" key={i}>
                                                            <Input
                                                                value={value}
                                                                type="number"
                                                                size="sm"
                                                                bg="gray.100"
                                                                width="80px"
                                                                p={1}
                                                                my={0.5}
                                                                onChange={e => handleNestedListChange(key, i, e.target.value)}
                                                            />
                                                            <Button size="sm" colorScheme="red"
                                                                    onClick={() => handleRemoveListItem(key, i)}
                                                                    ml={2}>-</Button>
                                                        </Box>
                                                    ))}
                                                    <Button size="sm" colorScheme="green"
                                                            onClick={() => handleAddListItem(key)} mt={2}>Add
                                                        Payment</Button>
                                                </Box>
                                            ) : key === 'RealEstateInvestmentType' ? (
                                                <Select
                                                    value={data[key]}
                                                    size="sm"
                                                    bg="gray.100"
                                                    width="80px"
                                                    onChange={e => handleChange(key, e.target.value)}
                                                >
                                                    <option value="House">House</option>
                                                    <option value="Building">Building</option>
                                                    <option value="Field">Field</option>
                                                </Select>
                                            ) : key === 'warehouse' ? (
                                                <Switch
                                                    isChecked={data[key]}
                                                    onChange={() => handleToggleChange(key)}
                                                    size="md"
                                                    colorScheme="teal"
                                                    m={1}
                                                />
                                            ) : (
                                                <Box display="flex" alignItems="center">
                                                    <Input
                                                        value={inputValues[key]}
                                                        type="number"
                                                        size="sm"
                                                        bg="gray.100"
                                                        width="80px"
                                                        p={1}
                                                        my={0.5}
                                                        onChange={e => handleChange(key, e.target.value)}
                                                    />
                                                    <Slider
                                                        value={data[key]}
                                                        min={sliderRangeMapping[key]?.min || 0}
                                                        max={sliderRangeMapping[key]?.max || 10000}
                                                        step={sliderRangeMapping[key]?.step || 1}
                                                        size="sm"
                                                        width="80px"
                                                        ml={2}
                                                        onChange={value => handleSliderChange(key, value)}
                                                    >
                                                        <SliderTrack>
                                                            <SliderFilledTrack bg="teal.500"/>
                                                        </SliderTrack>
                                                        <SliderThumb bg="teal.500"/>
                                                    </Slider>
                                                </Box>
                                            )}
                                        </Td>
                                    </Tr>
                                ))}
                            </Tbody>
                        </Table>
                    </CardBody>
                </Card>
            </Box>
        </ChakraProvider>
    );
}
