import {Portal, Box, useDisclosure, useToast, Spinner, Button, Flex, useColorModeValue} from '@chakra-ui/react';
import Footer from '../../components/footer/Footer.js';
import Navbar from '../../components/navbar/NavbarAdmin.js';
import Sidebar from '../../components/sidebar/Sidebar.js';
import {SidebarContext} from '../../contexts/SidebarContext';
import Favicon from '../../components/icons/TabIcon';
import React, {useState, useEffect} from 'react';
import {Route, useNavigate, useParams} from 'react-router-dom';
import routes from '../../routes.js';
import InvestmentSummary from "../../views/dashboard/components/InvestmentSummary";
import axios from 'axios';
import SaveReportModal from "../../views/dashboard/components/SaveReportModal";
import MortgageTable from "../../views/dashboard/components/MortgageTable";
import AdditionalTable from "../../views/dashboard/components/AdditionalTable";
import PropertyTable from "../../views/dashboard/components/PropertyTable";
import InvestorTable from "../../views/dashboard/components/InvestorTable";
import InvestmentTable from "../../views/dashboard/components/InvestmentTable";

export default function Dashboard(props) {
    const {...rest} = props;
    const [fixed] = useState(false);
    const mainBackground = useColorModeValue('#f2f3f5', 'gray.900');
    const boxBackground = useColorModeValue('white', 'gray.800');
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const {onOpen} = useDisclosure();
    const toast = useToast();
    const navigate = useNavigate();
    const {reportId} = useParams();
    const [showModal, setShowModal] = useState(false);
    const [reportName, setReportName] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [nextId, setNextId] = useState(2);

    const [insightsData, setInsightsData] = useState({
        "Price per meter": 0,
        "Loan to cost": 0,
        "Loan to value": 0,
        "Renovation expenses": 0,
        "Purchase additional transactions cost": 0,
        "Purchase tax": 0,
        "Closing costs": 0,
        "Broker purchase cost": 0,
        "Monthly operating expenses": 0,
        "Cash on cash": 0,
        "Net Yearly Cash Flow": 0,
        "Net Monthly Cash Flow": 0,
        "Yearly IRR": 0,
        "Annual rent income": 0,
        "ROI": 0,
        "Monthly NOI": 0,
        "Annual NOI": 0,
        "Monthly rental property taxes": 0,
        "Annual rental property taxes": 0,
        "Cap rate": 0,
        "Gross yield": 0,
        "Monthly insurances expenses": 0,
        "Annual insurances expenses": 0,
        "Monthly maintenance and repairs": 0,
        "Annual maintenance and repairs": 0,
        "Monthly vacancy cost": 0,
        "Annual vacancy cost": 0,
        "Estimated sale price": 0,
        "Selling expenses": 0,
        "Sale proceeds": 0,
        "Total revenue": 0,
        "Annual revenue distribution": 0,
        "Annual operating expenses": 0,
        "Annual cash flow": 0,
        "Mortgage remain balance in exit": 0,
        "Constructor index linked compensation": 0,
        "Total expenses": 0,
        "Equity needed for purchase": 0,
        "Contractor payments": 0,
        "Annual expenses distribution": 0,
        "Monthly property management fees": 0,
        "Annual property management fees": 0,
        "Net profit": 0,
        "Capital gain tax": 0
    });
    const [investmentData, setInvestmentData] = useState({
        'appraiser_cost': {value: 0, range: [0, 1000000], step: 10000},
        'lawyer_cost': {value: 0, range: [0, 1000000], step: 10000},
        'escort_costs': {value: 0, range: [0, 1000000], step: 100000},
        'mortgage_advisor_cost': {value: 0, range: [0, 100000], step: 10000},
        'additional_transaction_costs_dic': {tax: null, fee: null},
        'renovation_expenses_dic': {painting: null, flooring: null},
        'furniture_cost': {value: 0, range: [0, 500000], step: 1000},
        'broker_purchase_percentage': {value: 0, range: [0, 50], step: 1},
        'broker_rent_percentage': {value: 0, range: [0, 50], step: 1},
        'broker_sell_percentage': {value: 0, range: [0, 50], step: 1},
        'vacancy_percentage': {value: 0.1, range: [0, 1], step: 0.01},
        'annual_maintenance_cost_percentage': {value: 0, range: [0, 25], step: 0.1},
        'annual_life_insurance_cost': {value: 0, range: [0, 1000000], step: 1000},
        'annual_house_insurance_cost': {value: 0, range: [0, 1000000], step: 1000},
        'equity_required_by_percentage': {value: 0, range: [0, 100], step: 1},
        'management_fees_percentage': {value: 0, range: [0, 20], step: 0.1},
        'years_to_exit': {value: 0, range: [0, 80], step: 5},
        'average_interest_in_exit': {value: 0, range: [0, 20], step: 0.1}
    });
    const [investorData, setInvestorData] = useState({
        'net_monthly_income': {value: 0, range: [0, 1000000], step: 1000},
        'total_debt_payment': {value: 0, range: [0, 10000000], step: 10000},
        'real_estate_investment_type': {value: 'single apartment'},
        'total_available_equity': {value: 0, range: [0, 100000000], step: 10000},
        'gross_rental_income': {value: 0, range: [0, 1000000], step: 1000},
        'yearly_revenue': {value: []},
        'yearly_expenses': {value: []}
    });
    const [propertyData, setPropertyData] = useState({
        'purchase_price': {value: 0, range: [0, 100000000], step: 100000},
        'monthly_rent_income': {value: 0, range: [0, 50000], step: 1000},
        'square_meters': {value: 0, range: [0, 10000], step: 10},
        'parking_spots': {value: 0, range: [0, 1000], step: 1},
        'warehouse': {value: false},
        'balcony_square_meter': {value: 0, range: [0, 1000], step: 10},
        'after_repair_value': {value: 0, range: [0, 100000000], step: 100000},
        'annual_appreciation_percentage': {value: 0, range: [0, 100], step: 1}
    });
    const [mortgageData, setMortgageData] = useState({
        'mortgage_advisor_cost': 0,
        'interest_rate': 3.5,
        'num_payments': 0,
        'initial_loan_amount': 0,
        'interest_only_period': 0,
        'linked_index': [],
        'forecasting_interest_rate': [],
        'interest_changing_period': 0,
        'average_interest_when_taken': null,
        'mortgage_type': 'constant_not_linked'
    });
    const [mortgageTracks, setMortgageTracks] = useState([
        {
            id: Date.now(),
            data: {
                'mortgage_advisor_cost': 0,
                'interest_rate': 3.5,
                'num_payments': 0,
                'initial_loan_amount': 0,
                'interest_only_period': 0,
                'linked_index': [],
                'forecasting_interest_rate': [],
                'interest_changing_period': 0,
                'average_interest_when_taken': null,
                'mortgage_type': 'constant_not_linked'
            }
        }
    ]);
    const [otherData, setOtherData] = useState({
        'years_until_key_reception': {value: 0, range: [0, 50], step: 1},
        'contractor_payment_distribution': {value: []},
        'construction_input_index_annual_growth': {value: 0, range: [0, 10], step: 0.1}
    });

    const addMortgageTrack = () => {
        setMortgageTracks(prevTracks => [
            ...prevTracks,
            {
                id: Date.now(),
                data: {
                    'mortgage_advisor_cost': 0,
                    'interest_rate': 3.5,
                    'num_payments': 0,
                    'initial_loan_amount': 0,
                    'interest_only_period': 0,
                    'linked_index': [],
                    'forecasting_interest_rate': [],
                    'interest_changing_period': 0,
                    'average_interest_when_taken': null,
                    'mortgage_type': 'constant_not_linked'
                }
            }
        ]);
    };

    const getToken = () => {
        // Check if token is in sessionStorage
        let token = sessionStorage.getItem('token');

        // If token is not found in sessionStorage, check localStorage
        if (!token) {
            token = localStorage.getItem('token');
        }

        return token;
    };

    const filterValues = (data) => {
        return Object.entries(data).reduce((acc, [key, field]) => {
            if (typeof field === 'object' && field !== null) {
                if ('value' in field) {
                    acc[key] = field.value;
                } else {
                    acc[key] = Object.fromEntries(
                        Object.entries(field).map(([subKey, subValue]) => [subKey, subValue])
                    );
                }
            } else {
                acc[key] = field;
            }
            return acc;
        }, {});
    };

    const updateBMM = async (newData) => {
        setLoading(true);
        let dataToUpdate = {
            investment_data: filterValues(investmentData),
            investor_data: filterValues(investorData),
            property_data: filterValues(propertyData),
            mortgage_data: mortgageData,
            other_data: filterValues(otherData)
        };

        try {
            const token = getToken();
            const res = await axios.put(`${process.env.REACT_APP_SERVER_URL}/bmm`, dataToUpdate, {
                headers: {Authorization: `Bearer ${token}`},
            });
            const updatedInsights = res.data.insights;
            setInsightsData(updatedInsights);
            setLoading(false);
        } catch (e) {
            console.error('Error updating BMM', e);
            toast({
                title: 'Error updating data',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            setLoading(false);
        }
    };

    const fetchReportData = async (reportId) => {
        try {
            setLoading(true);
            const token = getToken();
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/report/${reportId}`, {
                headers: {Authorization: `Bearer ${token}`},
            })
            const reportData = response.data.report.data;
            const insights = reportData.insightsData;
            const investment = reportData.investmentData;
            const investor = reportData.investorData;
            const property = reportData.propertyData;
            const mortgage = reportData.mortgageData;
            const other = reportData.otherData;
            setInsightsData(insights);
            setInvestmentData(investment);
            setInvestorData(investor);
            setPropertyData(property);
            setMortgageData(mortgage);
            setOtherData(other);
            setReportName(response.data.report.name);
            setReportDescription(response.data.report.description);
        } catch (error) {
            console.error('Error fetching report data', error);
            setLoading(false);
            toast({
                title: 'Error fetching report data',
                description: 'An error occurred while fetching report data.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (reportId) {
            fetchReportData(reportId);
        }
    }, [reportId]);

    const handleReset = () => {
        setInsightsData({
            "Price per meter": 0,
            "Loan to cost": 0,
            "Loan to value": 0,
            "Renovation expenses": 0,
            "Purchase additional transactions cost": 0,
            "Purchase tax": 0,
            "Closing costs": 0,
            "Broker purchase cost": 0,
            "Monthly operating expenses": 0,
            "Cash on cash": 0,
            "Net Yearly Cash Flow": 0,
            "Net Monthly Cash Flow": 0,
            "Yearly IRR": 0,
            "Annual rent income": 0,
            "ROI": 0,
            "Monthly NOI": 0,
            "Annual NOI": 0,
            "Monthly rental property taxes": 0,
            "Annual rental property taxes": 0,
            "Cap rate": 0,
            "Gross yield": 0,
            "Monthly insurances expenses": 0,
            "Annual insurances expenses": 0,
            "Monthly maintenance and repairs": 0,
            "Annual maintenance and repairs": 0,
            "Monthly vacancy cost": 0,
            "Annual vacancy cost": 0,
            "Estimated sale price": 0,
            "Selling expenses": 0,
            "Sale proceeds": 0,
            "Total revenue": 0,
            "Annual revenue distribution": 0,
            "Annual operating expenses": 0,
            "Annual cash flow": 0,
            "Mortgage remain balance in exit": 0,
            "Constructor index linked compensation": 0,
            "Total expenses": 0,
            "Equity needed for purchase": 0,
            "Contractor payments": 0,
            "Annual expenses distribution": 0,
            "Monthly property management fees": 0,
            "Annual property management fees": 0,
            "Net profit": 0,
            "Capital gain tax": 0
        });

        setInvestmentData({
            'appraiser_cost': {value: 0, range: [0, 1000000], step: 10000},
            'lawyer_cost': {value: 0, range: [0, 1000000], step: 10000},
            'escort_costs': {value: 0, range: [0, 1000000], step: 100000},
            'mortgage_advisor_cost': {value: 0, range: [0, 100000], step: 10000},
            'additional_transaction_costs_dic': {tax: {value: null}, fee: {value: null}},
            'renovation_expenses_dic': {painting: {value: null}, flooring: {value: null}},
            'furniture_cost': {value: 0, range: [0, 500000], step: 1000},
            'broker_purchase_percentage': {value: 0, range: [0, 50], step: 1},
            'broker_rent_percentage': {value: 0, range: [0, 50], step: 1},
            'broker_sell_percentage': {value: 0, range: [0, 50], step: 1},
            'vacancy_percentage': {value: 0.1, range: [0, 1], step: 0.01},
            'annual_maintenance_cost_percentage': {value: 0, range: [0, 25], step: 0.1},
            'annual_life_insurance_cost': {value: 0, range: [0, 1000000], step: 1000},
            'annual_house_insurance_cost': {value: 0, range: [0, 1000000], step: 1000},
            'equity_required_by_percentage': {value: 0, range: [0, 100], step: 1},
            'management_fees_percentage': {value: 0, range: [0, 20], step: 0.1},
            'years_to_exit': {value: 0, range: [0, 80], step: 5},
            'average_interest_in_exit': {value: 0, range: [0, 20], step: 0.1}
        });

        setInvestorData({
            'net_monthly_income': {value: 0, range: [0, 1000000], step: 1000},
            'total_debt_payment': {value: 0, range: [0, 10000000], step: 10000},
            'real_estate_investment_type': {value: 'single apartment'},
            'total_available_equity': {value: 0, range: [0, 100000000], step: 10000},
            'gross_rental_income': {value: 0, range: [0, 1000000], step: 1000},
            'yearly_revenue': {value: []},
            'yearly_expenses': {value: []}
        });

        setPropertyData({
            'purchase_price': {value: 0, range: [0, 100000000], step: 100000},
            'monthly_rent_income': {value: 0, range: [0, 50000], step: 1000},
            'square_meters': {value: 0, range: [0, 10000], step: 10},
            'parking_spots': {value: 0, range: [0, 1000], step: 1},
            'warehouse': {value: false},
            'balcony_square_meter': {value: 0, range: [0, 1000], step: 10},
            'after_repair_value': {value: 0, range: [0, 100000000], step: 100000},
            'annual_appreciation_percentage': {value: 0, range: [0, 100], step: 1}
        });

        setMortgageData({
            'mortgage_advisor_cost': 0,
            'interest_rate': 3.5,
            'num_payments': 0,
            'initial_loan_amount': 0,
            'interest_only_period': 0,
            'linked_index': [],
            'forecasting_interest_rate': [],
            'interest_changing_period': 0,
            'average_interest_when_taken': null,
            'mortgage_type': 'constant_not_linked'
        });

        setOtherData({
            'years_until_key_reception': {value: 0, range: [0, 50], step: 1},
            'contractor_payment_distribution': {value: []},
            'construction_input_index_annual_growth': {value: 0, range: [0, 10], step: 0.1}
        });
    };

    const generateReport = () => ({
        name: reportName,
        description: reportDescription,
        data: {
            insightsData: filterValues(insightsData),
            investmentData: filterValues(investmentData),
            investorData: filterValues(investorData),
            propertyData: filterValues(propertyData),
            mortgageData: filterValues(mortgageData),
            otherData: filterValues(otherData)
        }
    });

    const fetchUserData = async () => {
        // Try to get the token from sessionStorage first, then from localStorage
        const token = getToken();
        if (token) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                throw error;
            }
        } else {
            throw new Error('No token found');
        }
    };

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const data = await fetchUserData();
                setUserData(data);
            } catch (error) {
                toast({
                    title: 'Failed to load user data',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/sign-in');
            }
        };
        loadUserData();
    }, []);

    const handleSave = () => {
        setShowModal(true);
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleSaveReport = async () => {
        setLoading(true);
        try {
            const reportData = generateReport();
            const token = getToken();

            // Check if reportId is available
            const url = reportId ? `${process.env.REACT_APP_SERVER_URL}/report/${reportId}` : `${process.env.REACT_APP_SERVER_URL}/report`;
            const method = reportId ? 'put' : 'post';

            // Send a POST request to save the report
            const response = await axios({
                method,
                url,
                data: reportData,
                headers: {Authorization: `Bearer ${token}`},
            });

            // Handle success
            toast({
                title: reportId ? 'Report updated successfully' : 'Report saved successfully',
                description: 'You can now see the report at My reports.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error saving report', error);
            toast({
                title: 'Error saving report',
                description: 'An error occurred while saving the report.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
            handleCloseModal();
        }
    };

    const getActiveRoute = (routes) => {
        let activeRoute = 'Main Dashboard';
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveRoute = getActiveRoute(routes[i].items);
                if (collapseActiveRoute !== activeRoute) {
                    return collapseActiveRoute;
                }
            } else if (routes[i].category) {
                let categoryActiveRoute = getActiveRoute(routes[i].items);
                if (categoryActiveRoute !== activeRoute) {
                    return categoryActiveRoute;
                }
            } else {
                if (window.location.href.indexOf(routes[i].path) !== -1) {
                    return routes[i].name;
                }
            }
        }
        return activeRoute;
    };

    const getActiveNavbar = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveNavbar = getActiveNavbar(routes[i].items);
                if (collapseActiveNavbar !== activeNavbar) {
                    return collapseActiveNavbar;
                }
            } else if (routes[i].category) {
                let categoryActiveNavbar = getActiveNavbar(routes[i].items);
                if (categoryActiveNavbar !== activeNavbar) {
                    return categoryActiveNavbar;
                }
            } else {
                if (window.location.href.indexOf(routes[i].path) !== -1) {
                    return routes[i].secondary;
                }
            }
        }
        return activeNavbar;
    };

    const getActiveNavbarText = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
                if (collapseActiveNavbar !== activeNavbar) {
                    return collapseActiveNavbar;
                }
            } else if (routes[i].category) {
                let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
                if (categoryActiveNavbar !== activeNavbar) {
                    return categoryActiveNavbar;
                }
            } else {
                if (window.location.href.indexOf(routes[i].path) !== -1) {
                    return routes[i].messageNavbar;
                }
            }
        }
        return activeNavbar;
    };

    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.layout === '/') {
                return <Route path={prop.path} component={prop.component} key={key}/>;
            }
            if (prop.collapse) {
                return getRoutes(prop.items);
            }
            if (prop.category) {
                return getRoutes(prop.items);
            } else {
                return null;
            }
        });
    };

    if (!userData) {
        return (
            <>
                <Favicon/>
                <Flex justifyContent="center" alignItems="center" height="100vh">
                    <Spinner size="xl"/>
                </Flex>
            </>
        );
    }

    return (
        <>
            <Favicon/>
            <Box>
                <Box>
                    <SidebarContext.Provider
                        value={{
                            toggleSidebar,
                            setToggleSidebar
                        }}>
                        <Sidebar routes={routes} display='none' {...rest} />
                        <Box
                            float='right'
                            minHeight='100vh'
                            height='100%'
                            overflow='auto'
                            position='relative'
                            maxHeight='100%'
                            background={mainBackground}
                            w={{base: '100%', xl: 'calc( 100% - 290px )'}}
                            maxWidth={{base: '100%', xl: 'calc( 100% - 290px )'}}
                            transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
                            transitionDuration='.2s, .2s, .35s'
                            transitionProperty='top, bottom, width'
                            transitionTimingFunction='linear, linear, ease'
                            pt='110px'>
                            <Portal>
                                <Box>
                                    <Navbar
                                        onOpen={onOpen}
                                        brandText={getActiveRoute(routes)}
                                        secondary={getActiveNavbar(routes)}
                                        message={getActiveNavbarText(routes)}
                                        fixed={fixed}
                                        currUser={userData}
                                        {...rest}
                                    />
                                </Box>
                            </Portal>
                            <Flex>
                                {/* Left Side */}
                                <Box flex='1'>
                                    <InvestmentTable data={investmentData} tableName={'Investment Details'}
                                                     setData={setInvestmentData}/>
                                    <AdditionalTable data={otherData} tableName={'Additional Details'}
                                                     setData={setOtherData}/>
                                </Box>
                                {/* Right Side */}
                                <Box flex='1'>
                                    <InvestorTable data={investorData} tableName={'Investor Details'}
                                                   setData={setInvestorData}/>
                                    <PropertyTable data={propertyData} tableName={'Property Details'}
                                                   setData={setPropertyData}/>
                                    {/*<MortgageTable tableName={'Mortgage Details'} data={mortgageData}*/}
                                    {/*               setData={setMortgageData}/>*/}
                                    <MortgageTable
                                        tableName="Mortgage Details"
                                        tracks={mortgageTracks}
                                        addTrack={addMortgageTrack}
                                        setTracks={setMortgageTracks}
                                    />
                                </Box>
                            </Flex>
                            <Flex justifyContent="center" mt={4} py={10} w='95%' mx='auto'
                                  background={boxBackground}
                            >
                                <Button colorScheme="teal" onClick={updateBMM} isLoading={loading} mr={10}>
                                    {loading ? <Spinner size="sm"/> : 'Calculate'}
                                </Button>
                                <Button colorScheme="blue" variant='outline' onClick={handleReset} mr={2}>
                                    Reset
                                </Button>
                                <Button colorScheme="green" variant='outline' onClick={handleSave}>
                                    Save
                                </Button>
                                {showModal && (
                                    <SaveReportModal
                                        isOpen={showModal}
                                        onClose={handleCloseModal}
                                        reportName={reportName}
                                        setReportName={setReportName}
                                        reportDescription={reportDescription}
                                        setReportDescription={setReportDescription}
                                        handleSaveReport={handleSaveReport}
                                    />
                                )}
                            </Flex>
                            <InvestmentSummary insights={insightsData} investmentData={investmentData}
                                               investorData={investorData} propertyData={propertyData}
                                               mortgageData={mortgageData} otherData={otherData}/>
                            <Box mt="auto">
                                <Footer/>
                            </Box>
                        </Box>
                    </SidebarContext.Provider>
                </Box>
            </Box>
        </>
    );
}
