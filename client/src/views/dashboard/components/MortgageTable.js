import React from 'react';
import {
    Box,
    Button,
    Menu,
    Text,
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
    GridItem, Tabs, TabList, Tab, TabPanels, TabPanel, IconButton
} from '@chakra-ui/react';
import {AddIcon, ChevronDownIcon} from '@chakra-ui/icons';

export default function MortgageTable({tableName, tracks, addTrack, setTracks}) {
    // const [mortgageType, setMortgageType] = useState('constant_not_linked');
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

    // useEffect(() => {
    //     if (data.mortgage_type) {
    //         setMortgageType(data.mortgage_type);
    //     }
    // }, [data]);

    const handleInputListChange = (id, key, value) => {
        setTracks(prevTracks =>
            prevTracks.map(track =>
                track.id === id
                    ? {...track, data: {...track.data, [key]: value}}
                    : track
            )
        );
    };

    const handleListInputBlur = (id, key) => {
        setTracks(prevTracks =>
            prevTracks.map(track => {
                if (track.id === id) {
                    const rawValue = track.data[key];
                    if (typeof rawValue === 'string') {
                        return {
                            ...track,
                            data: {
                                ...track.data,
                                [key]: rawValue.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v))
                            }
                        };
                    }
                }
                return track;
            })
        );
    };

    const handleSliderChange = (id, key, value) => {
        setTracks(prevTracks =>
            prevTracks.map(track =>
                track.id === id
                    ? {...track, data: {...track.data, [key]: value}}
                    : track
            )
        );
    };

    // const handleSelectMortgageType = (type) => {
    //     setMortgageType(type);
    //     const newFields = mortgageTypes[type].reduce((acc, field) => {
    //         acc[field.key] = data[field.key] !== undefined ? data[field.key] : (field.isList ? [] : null);
    //         return acc;
    //     }, {});
    //     setData(prevData => ({
    //         ...prevData,
    //         ...newFields,
    //         mortgage_type: type
    //     }));
    // };

    const handleSelectMortgageType = (trackId, type) => {
        setTracks(prevTracks =>
            prevTracks.map(track =>
                track.id === trackId ? {...track, data: {...track.data, mortgage_type: type}} : track
            )
        );
    };

    const updateTrack = (id, updatedData) => {
        setTracks((prevTracks) =>
            prevTracks.map(track =>
                track.id === id
                    ? {...track, data: {...track.data, ...updatedData}}
                    : track
            )
        );
    };

    const removeTrack = (id) => {
        setTracks((prevTracks) =>
            prevTracks.filter(track => track.id !== id)
        );
    };

    const renderFields = (track) => {
        const mortgageType = track.data.mortgage_type || 'constant_not_linked';
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
                            value={Array.isArray(track.data[key]) ? track.data[key].join(', ') : track.data[key] || ''}
                            placeholder="Enter values separated with a comma"
                            onChange={(e) => handleInputListChange(track.id, key, e.target.value)}
                            onBlur={() => handleListInputBlur(track.id, key)}
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
                                value={track.data[key] !== null ? track.data[key] : 0}
                                onChange={(e) => handleSliderChange(track.id, key, parseFloat(e.target.value))}
                            />
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
        ));
    };

    return (
        <ChakraProvider>
            <Box p={4}>
                <Card>
                    <CardHeader py={1} px={3} display="flex" justifyContent="space-between" alignItems="center">
                        <Heading size="md">{tableName}</Heading>
                    </CardHeader>

                    <CardBody py={1} px={3}>
                        <Tabs variant="enclosed">
                            <TabList>
                                {tracks.map((track, index) => (
                                    <Tab key={track.id}>Track {index + 1}</Tab>
                                ))}
                                <IconButton
                                    icon={<AddIcon/>}
                                    onClick={addTrack}
                                    colorScheme="teal"
                                    aria-label="Add Track"
                                    size="sm"
                                    ml={2}
                                />

                            </TabList>
                            <TabPanels>
                                {tracks.map((track) => (
                                    <TabPanel key={track.id}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                            <Text fontSize="md" fontWeight="bold">
                                                {track.mortgageType ? `Type: ${track.mortgageType}` : 'No Type Selected'}
                                            </Text>
                                            <Box display="flex" alignItems="center">
                                                <Button
                                                    size="sm"
                                                    onClick={() => setTracks(tracks.filter(t => t.id !== track.id))}
                                                    colorScheme="red"
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
