import React, {useState} from 'react';
import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
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
import {ChevronDownIcon} from '@chakra-ui/icons';

export default function MortgageTable({tableName}) {
    const initialData = {
        interest_rate: 3.5,
        num_payments: 0,
        initial_loan_amount: 0,
        linked_index: [],
        forecasting_interest_rate: [],
        interest_changing_period: 0,
        average_interest_when_taken: null,
        interest_only_period: 0,
    };

    const [mortgageType, setMortgageType] = useState('constant_not_linked');
    const [mortgageData, setMortgageData] = useState(initialData);

    const mortgageTypes = {
        constant_not_linked: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 20], step: 0.1},
            {label: 'Number of Payments', key: 'num_payments', range: [0, 1000], step: 5},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, 10000000], step: 100000},
            {
                label: 'Average Interest When Taken',
                key: 'average_interest_when_taken',
                range: [0, 10],
                step: 0.1,
                optional: true
            },
            {label: 'Interest Only Period', key: 'interest_only_period', range: [0, 24], step: 1}
        ],
        constant_linked: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 20], step: 0.1},
            {label: 'Number of Payments', key: 'num_payments', range: [0, 1000], step: 5},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, 10000000], step: 100000},
            {label: 'Linked Index', key: 'linked_index', isList: true, optional: true},
            {
                label: 'Average Interest When Taken',
                key: 'average_interest_when_taken',
                range: [0, 10],
                step: 0.1,
                optional: true
            },
            {label: 'Interest Only Period', key: 'interest_only_period', range: [0, 24], step: 1}
        ],
        change_linked: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 20], step: 0.1},
            {label: 'Number of Payments', key: 'num_payments', range: [0, 1000], step: 5},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, 10000000], step: 100000},
            {label: 'Linked Index', key: 'linked_index', isList: true, optional: true},
            {label: 'Forecasting Interest Rate', key: 'forecasting_interest_rate', isList: true, optional: true},
            {label: 'Interest Changing Period', key: 'interest_changing_period', range: [0, 30], step: 1},
            {
                label: 'Average Interest When Taken',
                key: 'average_interest_when_taken',
                range: [0, 10],
                step: 0.1,
                optional: true
            },
            {label: 'Interest Only Period', key: 'interest_only_period', range: [0, 24], step: 1}
        ],
        change_not_linked: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 20], step: 0.1},
            {label: 'Number of Payments', key: 'num_payments', range: [0, 1000], step: 5},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, 10000000], step: 100000},
            {label: 'Forecasting Interest Rate', key: 'forecasting_interest_rate', isList: true, optional: true},
            {label: 'Interest Changing Period', key: 'interest_changing_period', range: [0, 30], step: 1},
            {
                label: 'Average Interest When Taken',
                key: 'average_interest_when_taken',
                range: [0, 10],
                step: 0.1,
                optional: true
            },
            {label: 'Interest Only Period', key: 'interest_only_period', range: [0, 24], step: 1}
        ],
        eligibility: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 20], step: 0.1},
            {label: 'Number of Payments', key: 'num_payments', range: [0, 1000], step: 5},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, 10000000], step: 100000},
            {label: 'Linked Index', key: 'linked_index', isList: true, optional: true},
            {
                label: 'Average Interest When Taken',
                key: 'average_interest_when_taken',
                range: [0, 10],
                step: 0.1,
                optional: true
            }
        ],
        prime: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 20], step: 0.1},
            {label: 'Number of Payments', key: 'num_payments', range: [0, 1000], step: 5},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, 10000000], step: 100000},
            {label: 'Forecasting Interest Rate', key: 'forecasting_interest_rate', isList: true, optional: true},
            {
                label: 'Average Interest When Taken',
                key: 'average_interest_when_taken',
                range: [0, 10],
                step: 0.1,
                optional: true
            },
            {label: 'Interest Only Period', key: 'interest_only_period', range: [0, 24], step: 1}
        ]
    };

    const handleInputListChange = (key, value) => {
        // Split the input value by commas and map to numbers
        const values = value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));

        setMortgageData(prevData => ({
            ...prevData,
            [key]: values
        }));
    };

    const handleInputChange = (key, value) => {
        // Convert value to number if it's a number field
        const newValue = key === 'interest_rate' || key === 'num_payments' || key === 'initial_loan_amount'
            ? parseFloat(value)
            : value; // For non-number fields, use the string value directly

        setMortgageData(prevData => ({
            ...prevData,
            [key]: newValue
        }));
    };


    const handleSliderChange = (key, value) => {
        setMortgageData(prevData => ({
            ...prevData,
            [key]: value
        }));
    };

    const handleSelectMortgageType = (type) => {
        const newFields = mortgageTypes[type].reduce((acc, field) => {
            acc[field.key] = initialData[field.key] !== undefined ? initialData[field.key] : null;
            return acc;
        }, {});

        setMortgageType(type);
        setMortgageData(newFields);
    };

    const renderFields = () => {
        return mortgageTypes[mortgageType].map(({label, key, isList, optional, range, step}) => (
            <Grid templateColumns="repeat(3, 1fr)" gap={4} alignItems="center" key={key}>
                <GridItem>
                    <FormLabel m={0} fontSize="sm">{label} {optional && '(Optional)'}</FormLabel>
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
                            value={mortgageData[key].join(', ')}
                            placeholder="Enter values separated with a comma"
                            onChange={(e) => {
                                handleInputListChange(key, e.target.value);
                            }}
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
                                value={mortgageData[key]}
                                onChange={(e) => handleSliderChange(key, parseFloat(e.target.value))}
                            />
                        </GridItem>
                        <GridItem>
                            <Slider
                                value={mortgageData[key]}
                                onChange={(value) => handleSliderChange(key, value)}
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
        ));
    };


    return (
        <ChakraProvider>
            <Box p={4}>
                <Card>
                    <CardHeader py={1} px={3} display="flex" justifyContent="space-between" alignItems="center">
                        <Heading size="md">{tableName}</Heading>
                        <Menu>
                            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} colorScheme="teal" size="sm" mt={2}>
                                Choose Type
                            </MenuButton>
                            <MenuList zIndex={2}>
                                <MenuItem onClick={() => handleSelectMortgageType('constant_not_linked')}>Constant Not
                                    Linked</MenuItem>
                                <MenuItem onClick={() => handleSelectMortgageType('constant_linked')}>Constant
                                    Linked</MenuItem>
                                <MenuItem onClick={() => handleSelectMortgageType('change_linked')}>Change
                                    Linked</MenuItem>
                                <MenuItem onClick={() => handleSelectMortgageType('change_not_linked')}>Change Not
                                    Linked</MenuItem>
                                <MenuItem onClick={() => handleSelectMortgageType('eligibility')}>Eligibility</MenuItem>
                                <MenuItem onClick={() => handleSelectMortgageType('prime')}>Prime</MenuItem>
                            </MenuList>
                        </Menu>
                    </CardHeader>

                    <CardBody py={1} px={3}>
                        {renderFields()}
                    </CardBody>
                </Card>
            </Box>
        </ChakraProvider>
    );
}
