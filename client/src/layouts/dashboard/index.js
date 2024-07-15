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
import DetailsTable from "../../views/dashboard/components/DetailsTable";
import SaveReportModal from "../../views/dashboard/components/SaveReportModal";

export default function Dashboard(props) {
    const {...rest} = props;
    const [fixed] = useState(false);
    const mainBackground = useColorModeValue('gray.100', 'gray.900');
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
        'appraiser_cost': 0,
        'lawyer_cost': 0,
        'escort_costs': 0,
        'additional_transaction_costs_dic': {'tax': null, 'fee': null},
        'renovation_expenses_dic': {'painting': null, 'flooring': null},
        'furniture_cost': 0,
        'broker_purchase_percentage': 0,
        'broker_rent_percentage': 0,
        'broker_sell_percentage': 0,
        'vacancy_percentage': 0.1,
        'annual_maintenance_cost_percentage': 0,
        'annual_life_insurance_cost': 0,
        'annual_house_insurance_cost': 0,
        'equity_required_by_percentage': 0,
        'management_fees_percentage': 0,
        'years_to_exit': 0,
        'average_interest_in_exit': 0
    });
    const [investorData, setInvestorData] = useState({
        'net_monthly_income': 0,
        'total_debt_payment': 0,
        'RealEstateInvestmentType': 'house',
        'total_available_equity': 0,
        'gross_rental_income': 0,
    });
    const [propertyData, setPropertyData] = useState({
        'purchase_price': 0,
        'monthly_rent_income': 0,
        'square_meters': 0,
        'parking_spots': 0,
        'warehouse': false,
        'balcony_square_meter': 0,
        'after_repair_value': 0,
        'annual_appreciation_percentage': 0
    });
    const [mortgageData, setMortgageData] = useState({
        'mortgage_advisor_cost': 0,
        'interest_rate': 3.5,
        'num_payments': 0,
        'initial_loan_amount': 0,
        'interest_only_period': 0
    });
    const [otherData, setOtherData] = useState({
        'years_until_key_reception': 0,
        'contractor_payment_distribution': [],
        'construction_input_index_annual_growth': 0,
    });
    const [loading, setLoading] = useState(false);

    const getToken = () => {
        // Check if token is in sessionStorage
        let token = sessionStorage.getItem('token');

        // If token is not found in sessionStorage, check localStorage
        if (!token) {
            token = localStorage.getItem('token');
        }

        return token;
    };

    const updateBMM = async (newData) => {
        setLoading(true);
        let dataToUpdate = {
            investment_data: investmentData,
            investor_data: investorData,
            property_data: propertyData,
            mortgage_data: mortgageData,
            other_data: otherData,
        };

        if (newData.investment_data) {
            dataToUpdate.investment_data = {...investmentData, ...newData.investment_data};
        } else if (newData.investor_data) {
            dataToUpdate.investor_data = {...investorData, ...newData.investor_data};
        } else if (newData.property_data) {
            dataToUpdate.property_data = {...propertyData, ...newData.property_data};
        } else if (newData.mortgage_data) {
            dataToUpdate.mortgage_data = {...mortgageData, ...newData.mortgage_data};
        } else if (newData.other_data) {
            dataToUpdate.other_data = {...otherData, ...newData.other_data};
        }

        try {
            const token = getToken();
            const res = await axios.put('http://localhost:5000/dashboard/bmm_update', dataToUpdate, {
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
            const response = await axios.get(`http://localhost:5000/report/${reportId}`, {
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
            setLoading(false);
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
        }
    };

    useEffect(() => {
        if (reportId) {
            fetchReportData(reportId);
        }
    }, [reportId]);

    const handleReset = () => {
        // Reset all data logic
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
            'appraiser_cost': 0,
            'lawyer_cost': 0,
            'escort_costs': 0,
            'additional_transaction_costs_dic': {'tax': null, 'fee': null},
            'renovation_expenses_dic': {'painting': null, 'flooring': null},
            'furniture_cost': 0,
            'broker_purchase_percentage': 0,
            'broker_rent_percentage': 0,
            'broker_sell_percentage': 0,
            'vacancy_percentage': 0.1,
            'annual_maintenance_cost_percentage': 0,
            'annual_life_insurance_cost': 0,
            'annual_house_insurance_cost': 0,
            'equity_required_by_percentage': 0,
            'management_fees_percentage': 0,
            'years_to_exit': 0,
            'average_interest_in_exit': 0
        });

        setInvestorData({
            'net_monthly_income': 0,
            'total_debt_payment': 0,
            'RealEstateInvestmentType': 'house',
            'total_available_equity': 0,
            'gross_rental_income': 0,
        });

        setPropertyData({
            'purchase_price': 0,
            'monthly_rent_income': 0,
            'square_meters': 0,
            'parking_spots': 0,
            'warehouse': false,
            'balcony_square_meter': 0,
            'after_repair_value': 0,
            'annual_appreciation_percentage': 0
        });

        setMortgageData({
            'mortgage_advisor_cost': 0,
            'interest_rate': 3.5,
            'num_payments': 0,
            'initial_loan_amount': 0,
            'interest_only_period': 0
        });

        setOtherData({
            'years_until_key_reception': 0,
            'contractor_payment_distribution': [],
            'construction_input_index_annual_growth': 0,
        });
    };

    const generateReport = () => ({
        name: reportName,
        description: reportDescription,
        data: {
            insightsData,
            investmentData,
            investorData,
            propertyData,
            mortgageData,
            otherData
        }
    });

    const fetchUserData = async () => {
        // Try to get the token from sessionStorage first, then from localStorage
        const token = getToken();
        if (token) {
            try {
                const response = await axios.get('http://localhost:5000/user', {
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
            // Send a POST request to save the report
            const response = await axios.post(`http://localhost:5000/report`, reportData, {
                headers: {Authorization: `Bearer ${token}`},
            });

            // Handle success
            toast({
                title: 'Report saved successfully',
                description: 'Your report has been saved successfully.',
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
                <Favicon />
                <Flex justifyContent="center" alignItems="center" height="100vh">
                    <Spinner size="xl"/>
                </Flex>
            </>
        );
    }

    return (
        <>
            <Favicon />
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
                                <DetailsTable data={investmentData} tableName={'Investment Details'}
                                              setData={setInvestmentData}/>
                                <DetailsTable data={otherData} tableName={'Additional Details'} setData={setOtherData}/>
                            </Box>
                            {/* Right Side */}
                            <Box flex='1'>
                                <DetailsTable data={investorData} tableName={'Investor Details'}
                                              setData={setInvestorData}/>
                                <DetailsTable data={propertyData} tableName={'Property Details'}
                                              setData={setPropertyData}/>
                                <DetailsTable data={mortgageData} tableName={'Mortgage Details'}
                                              setData={setMortgageData}/>
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
                                    setReportName={setReportName}
                                    setReportDescription={setReportDescription}
                                    handleSaveReport={handleSaveReport}
                                />
                            )}
                        </Flex>
                        <InvestmentSummary insights={insightsData}/>
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
