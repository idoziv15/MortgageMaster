import React, { useState } from 'react';
import {
    ChakraProvider,
    Box,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Input,
    Slider,
    SliderTrack,
    SliderFilledTrack,
    SliderThumb,
    Heading,
    Card,
    CardHeader,
    CardBody,
    Button,
    Spinner,
} from '@chakra-ui/react';

const CostTable = ({ investmentData, investorData, propertyData, otherData, onUpdate }) => {
    const initializeData = (data) => {
        const defaultValue = 0;
        const initializedData = {};
        for (const key in data) {
            initializedData[key] = data[key] !== undefined && data[key] !== null ? data[key] : defaultValue;
        }
        return initializedData;
    };

    const [localData, setLocalData] = useState({
        investment_data: initializeData(investmentData),
        investor_data: initializeData(investorData),
        property_data: initializeData(propertyData),
        other_data: initializeData(otherData),
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (category, field, value) => {
        setLocalData(prevState => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                [field]: parseFloat(value) || 0,
            },
        }));
    };

    const handleSliderChange = (category, field, value) => {
        setLocalData(prevState => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                [field]: value,
            },
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        await onUpdate(localData);
        setLoading(false);
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
        real_estate_investment_type: "Real Estate Investment Type",
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

    const getDisplayName = (key) => {
        return fieldNameMapping[key] || key.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());
    };

    const renderTableRows = (data, category) => (
        Object.keys(data).map((key, index) => (
            <Tr key={index}>
                <Td p={0}>{getDisplayName(key)}</Td>
                <Td p={0}>
                    <Box display="flex" alignItems="center">
                        <Input
                            value={data[key]} type="number" size="sm" bg="gray.100" width="80px" p={1} m={0}
                            onChange={e => handleInputChange(category, key, e.target.value)}
                        />
                        {data[key] !== undefined && data[key] !== null && (
                            <Slider
                                value={data[key]} min={0} max={10000} step={10} size="sm" width="80px" ml={2}
                                onChange={value => handleSliderChange(category, key, value)}
                            >
                                <SliderTrack>
                                    <SliderFilledTrack />
                                </SliderTrack>
                                <SliderThumb />
                            </Slider>
                        )}
                    </Box>
                </Td>
            </Tr>
        ))
    );

    return (
        <ChakraProvider>
            <Box p={4} mx={5}>
                <Card>
                    <CardHeader py={1} px={3}>
                        <Heading size="md">Cost Table</Heading>
                    </CardHeader>
                    <CardBody py={1} px={3}>
                        <Table variant="simple" size="sm">
                            <Thead>
                                <Tr>
                                    <Th px={2}>Attribute</Th>
                                    <Th px={2}>Amount</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {renderTableRows(localData.investment_data, 'investment_data')}
                                {renderTableRows(localData.investor_data, 'investor_data')}
                                {renderTableRows(localData.property_data, 'property_data')}
                                {renderTableRows(localData.other_data, 'other_data')}
                            </Tbody>
                        </Table>
                        <Button mt={4} colorScheme="teal" onClick={handleSubmit} isLoading={loading}>
                            {loading ? <Spinner size="sm" /> : 'Submit'}
                        </Button>
                    </CardBody>
                </Card>
            </Box>
        </ChakraProvider>
    );
};

export default CostTable;
