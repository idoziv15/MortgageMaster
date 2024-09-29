import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardBody,
    CardHeader,
    ChakraProvider,
    FormLabel,
    Grid,
    GridItem,
    Heading, Icon,
    IconButton,
    Input, InputGroup, InputRightElement,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Slider,
    SliderFilledTrack,
    SliderThumb,
    SliderTrack,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text, Tooltip,
    useToast
} from '@chakra-ui/react';
import {AddIcon, ChevronDownIcon} from '@chakra-ui/icons';
import {
    MdPercent,
    MdAccessTime,
    MdAttachMoney,
    MdTimelapse,
    MdShowChart,
    MdChangeCircle,
    MdOutlineInsertChart,
    MdTrendingFlat
} from 'react-icons/md';

const iconMapping = {
    'interest_rate': MdPercent,
    'mortgage_duration': MdAccessTime,
    'initial_loan_amount': MdAttachMoney,
    'interest_only_period': MdTimelapse,
    'linked_index': MdShowChart,
    'forecasting_interest_rate': MdChangeCircle,
    'interest_changing_period': MdAccessTime,
    'average_interest_when_taken': MdOutlineInsertChart,
    'mortgage_type': MdTrendingFlat
};

const tooltipMap = {
    'interest_rate': "The interest rate applied to this mortgage track loan.",
    'mortgage_duration': "The duration of the mortgage in years.",
    'initial_loan_amount': "The total amount you are borrowing for this mortgage track.",
    'interest_only_period': "The period during which you only pay the interest on the loan, not the principal. Aka Grace mortgage",
    'linked_index': "The financial index to which the interest rate is linked, affecting rate adjustments.",
    'forecasting_interest_rate': "The anticipated interest rate for future periods based on market trends.",
    'interest_changing_period': "The intervals at which the interest rate may change (e.g., annually, semi-annually).",
    'mortgage_type': "The type of mortgage selected (Constant Not Linked, Constant Linked, Change Not Linked, Change Linked, Eligibility or Prime."
};

export default function MortgageTable({tableName, tracks, addTrack, setTracks, activeTab, setActiveTab, propertyData}) {
    const toast = useToast();
    const [purchasePrice, setPurchasePrice] = useState(propertyData.purchase_price.value);
    const [maxInitialLoanAmount, setMaxInitialLoanAmount] = useState(propertyData.purchase_price.value * 0.7);
    const mortgageTypes = {
        constant_not_linked: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 10], step: 0.1},
            {label: 'Mortgage Duration (years)', key: 'mortgage_duration', range: [0, 30], step: 1},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, maxInitialLoanAmount], step: 10000},
            {label: 'Interest Only Period (Months)', key: 'interest_only_period', range: [0, 240], step: 1}
        ],
        constant_linked: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 10], step: 0.1},
            {label: 'Mortgage Duration (years)', key: 'mortgage_duration', range: [0, 30], step: 1},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, maxInitialLoanAmount], step: 10000},
            {label: 'Linked Index', key: 'linked_index', isList: true, optional: true},
            {label: 'Interest Only Period (Months)', key: 'interest_only_period', range: [0, 240], step: 1}
        ],
        change_linked: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 10], step: 0.1},
            {label: 'Mortgage Duration (years)', key: 'mortgage_duration', range: [0, 30], step: 1},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, maxInitialLoanAmount], step: 10000},
            {label: 'Linked Index', key: 'linked_index', isList: true, optional: true},
            {label: 'Forecasting Interest Rate', key: 'forecasting_interest_rate', isList: true, optional: true},
            {label: 'Interest Changing Period', key: 'interest_changing_period', range: [0, 30], step: 1},
            {label: 'Interest Only Period (Months)', key: 'interest_only_period', range: [0, 240], step: 1}
        ],
        change_not_linked: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 10], step: 0.1},
            {label: 'Mortgage Duration (years)', key: 'mortgage_duration', range: [0, 30], step: 1},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, maxInitialLoanAmount], step: 10000},
            {label: 'Forecasting Interest Rate', key: 'forecasting_interest_rate', isList: true, optional: true},
            {label: 'Interest Changing Period', key: 'interest_changing_period', range: [0, 30], step: 1},
            {label: 'Interest Only Period (Months)', key: 'interest_only_period', range: [0, 240], step: 1}
        ],
        eligibility: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 10], step: 0.1},
            {label: 'Mortgage Duration (years)', key: 'mortgage_duration', range: [0, 30], step: 1},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, maxInitialLoanAmount], step: 10000},
            {label: 'Linked Index', key: 'linked_index', isList: true, optional: true},
        ],
        prime: [
            {label: 'Interest Rate', key: 'interest_rate', range: [0, 10], step: 0.1},
            {label: 'Mortgage Duration (years)', key: 'mortgage_duration', range: [0, 30], step: 1},
            {label: 'Initial Loan Amount', key: 'initial_loan_amount', range: [0, maxInitialLoanAmount], step: 10000},
            {label: 'Forecasting Interest Rate', key: 'forecasting_interest_rate', isList: true, optional: true},
            {label: 'Interest Only Period (Months)', key: 'interest_only_period', range: [0, 240], step: 1}
        ]
    };
    const prerequisites = ['interest_only_period', 'interest_changing_period', 'forecasting_interest_rate', 'linked_index'];

    useEffect(() => {
        setPurchasePrice(propertyData.purchase_price.value);
        setMaxInitialLoanAmount(propertyData.purchase_price.value * 0.7);
    }, [propertyData.purchase_price.value]);

    const handleInputValidation = (track, key, value) => {
        const errors = [];
        const maxPeriod = track.data.mortgage_duration * 12;

        // 1. Validate initial loan amount <= 70% of purchase price
        if (key === 'initial_loan_amount' && propertyData.purchase_price) {
            const maxLoanAmount = propertyData.purchase_price * 0.7;
            if (value > maxLoanAmount) {
                errors.push(`Initial loan amount exceeds 70% of purchase price (${maxLoanAmount})`);
            }
        }

        // 2. Validate interest-only period <= mortgage_period * 12
        if (key === 'interest_only_period' && track.data.mortgage_duration) {
            if (value > maxPeriod) {
                errors.push(`Interest-only period cannot exceed ${maxPeriod} months.`);
            }
        }

        // 3. Validate linked index size
        if (key === 'linked_index' && Array.isArray(value)) {
            if (value.length !== maxPeriod) {
                errors.push(`Linked index should have ${maxPeriod} entries.`);
            }
        }

        // 4. Validate forecasting interest rate size
        if (key === 'forecasting_interest_rate' && Array.isArray(value)) {
            if (value.length !== maxPeriod) {
                errors.push(`Forecasting interest rate should have ${maxPeriod} entries.`);
            }
        }

        // 5. Validate interest changing period
        if (key === 'interest_changing_period' && track.data.interest_changing_period) {
            if (value > maxPeriod) {
                errors.push(`Interest-only changing cannot exceed ${maxPeriod} months.`);
            }
        }

        // Return errors
        return errors;
    };

    const handleInputListChange = (id, key, value) => {
        setTracks(prevTracks => {
            return prevTracks.map(track => {
                if (track.id === id) {
                    // Validate input before updating
                    const parsedValue = key === 'linked_index' || key === 'forecasting_interest_rate'
                        ? value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
                        : parseFloat(value);

                    // Check for validation errors
                    const errors = handleInputValidation(track, key, parsedValue);

                    if (errors.length === 0) {
                        return {
                            ...track,
                            data: {
                                ...track.data,
                                [key]: parsedValue
                            }
                        };
                    } else {
                        // Display validation errors
                        toast({
                            title: "Validation Error",
                            description: errors.join(" "),
                            status: "error",
                            duration: 8000,
                            isClosable: true
                        });
                        return track;
                    }
                }
                return track;
            });
        });
    };

    const handleListInputBlur = (id, key) => {
        setTracks(prevTracks =>
            prevTracks.map(track => {
                if (track.id === id) {
                    const rawValue = track.data[key];
                    if (typeof rawValue === 'string') {
                        const parsedValue = rawValue.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
                        const errors = handleInputValidation(track, key, parsedValue);

                        if (errors.length === 0) {
                            return {
                                ...track,
                                data: {
                                    ...track.data,
                                    [key]: parsedValue
                                }
                            };
                        } else {
                            // Display validation errors
                            toast({
                                title: "Validation Error",
                                description: errors.join(" "),
                                status: "error",
                                duration: 8000,
                                isClosable: true
                            });
                            return track;
                        }
                    }
                }
                return track;
            })
        );
    };

    const handleSliderChange = (trackId, key, value) => {
        setTracks(prevTracks =>
            prevTracks.map(track => {
                if (track.id === trackId) {
                    const errors = handleInputValidation(track, key, value);

                    if (errors.length === 0) {
                        return {
                            ...track,
                            data: {
                                ...track.data,
                                [key]: value
                            }
                        };
                    } else {
                        // Display validation errors
                        toast({
                            title: "Validation Error",
                            description: errors.join(" "),
                            status: "error",
                            duration: 8000,
                            isClosable: true
                        });
                        return track;
                    }
                }
                return track;
            })
        );
    };

    const handleSelectMortgageType = (trackId, type) => {
        setTracks(prevTracks =>
            prevTracks.map(track =>
                track.id === trackId ? {...track, data: {...track.data, mortgage_type: type}} : track
            )
        );
    };

    const removeTrack = (trackId) => {
        if (tracks.length === 1) {
            toast({
                title: "Cannot remove track.",
                description: "At least one mortgage track is required.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } else {
            setTracks((prevTracks) => {
                const indexToRemove = prevTracks.findIndex(track => track.id === trackId);
                const updatedTracks = prevTracks.filter(track => track.id !== trackId);
                const newIndex = indexToRemove > 0 ? indexToRemove - 1 : 0;
                setActiveTab(newIndex);
                return updatedTracks;
            });
        }
    };

    const renderFields = (track) => {
        const mortgageType = track.data.mortgage_type || 'constant_not_linked';
        return mortgageTypes[mortgageType].map(({label, key, isList, optional, range, step}) => {
            const IconComponent = iconMapping[key];
            const tooltipText = tooltipMap[key];

            return (
                <Grid templateColumns="repeat(3, 1fr)" gap={4} alignItems="center" key={key}>
                    <GridItem>
                        <Tooltip label={tooltipText} fontSize="md" placement='left-start' hasArrow>
                            <FormLabel m={0} fontSize="sm">
                                {label} {optional && '(Optional)'}
                            </FormLabel>
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
                                value={Array.isArray(track.data[key]) ? track.data[key].join(', ') : track.data[key] || ''}
                                placeholder="Enter values separated with a comma"
                                onChange={(e) => handleInputListChange(track.id, key, e.target.value)}
                                onBlur={() => handleListInputBlur(track.id, key)}
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
                                        value={track.data[key] !== null ? track.data[key] : 0}
                                        isDisabled={
                                            (key === 'initial_loan_amount' && purchasePrice === 0) ||
                                            (prerequisites.includes(key) && track.data['mortgage_duration'] === 0)
                                        }
                                        onChange={(e) => handleSliderChange(track.id, key, parseFloat(e.target.value))}
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
                                    value={track.data[key] !== null ? track.data[key] : 0}
                                    onChange={(value) => handleSliderChange(track.id, key, value)}
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
            )
        })
    };

    return (
        <ChakraProvider>
            <Box p={4}>
                <Card pt={2}>
                    <CardHeader py={1} px={3} display="flex" justifyContent="space-between" alignItems="center">
                        <Heading size="md">{tableName}</Heading>
                    </CardHeader>

                    <CardBody py={1} px={3}>
                        <Tabs variant="enclosed" index={activeTab} onChange={index => setActiveTab(index)}>
                            <TabList>
                                {tracks.map((track, index) => (
                                    <Tab key={track.id} colorScheme='teal'>Track {index + 1}</Tab>
                                ))}
                                <IconButton
                                    icon={<AddIcon/>}
                                    onClick={addTrack}
                                    colorScheme="teal"
                                    aria-label="Add Track"
                                    size="sm"
                                    ml={2}
                                    variant='outline'
                                    isRound
                                />
                            </TabList>
                            <TabPanels>
                                {tracks.map((track) => (
                                    <TabPanel key={track.id}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                            <Text fontSize="md" fontWeight="bold">
                                                {track.data.mortgage_type.replace(/_/g, ' ').toUpperCase()}
                                            </Text>
                                            <Box display="flex" alignItems="center">
                                                <Button
                                                    size="sm"
                                                    onClick={() => removeTrack(track.id)}
                                                    colorScheme='teal'
                                                    variant='outline'
                                                    mr={2}
                                                >
                                                    Remove
                                                </Button>
                                                <Menu>
                                                    <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}
                                                                colorScheme="teal" size="sm">
                                                        Choose Type
                                                    </MenuButton>
                                                    <MenuList zIndex={2}>
                                                        <MenuItem
                                                            onClick={() => handleSelectMortgageType(track.id, 'constant_not_linked')}>
                                                            Constant Not Linked
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => handleSelectMortgageType(track.id, 'constant_linked')}>
                                                            Constant Linked
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => handleSelectMortgageType(track.id, 'change_linked')}>
                                                            Change Linked
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => handleSelectMortgageType(track.id, 'change_not_linked')}>
                                                            Change Not Linked
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => handleSelectMortgageType(track.id, 'eligibility')}>
                                                            Eligibility
                                                        </MenuItem>
                                                        <MenuItem
                                                            onClick={() => handleSelectMortgageType(track.id, 'prime')}>
                                                            Prime
                                                        </MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            </Box>
                                        </Box>
                                        <Box mt={4}>
                                            {renderFields(track)}
                                        </Box>
                                    </TabPanel>
                                ))}
                            </TabPanels>
                        </Tabs>
                    </CardBody>
                </Card>
            </Box>
        </ChakraProvider>
    );
}
