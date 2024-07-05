import {Portal, Box, useDisclosure, useToast, Spinner, Button, Flex, useColorModeValue} from '@chakra-ui/react';
import Footer from '../../components/footer/Footer.js';
import Navbar from '../../components/navbar/NavbarAdmin.js';
import Sidebar from '../../components/sidebar/Sidebar.js';
import {SidebarContext} from '../../contexts/SidebarContext';
import React, {useState, useEffect} from 'react';
import {Route, useParams} from 'react-router-dom';
import routes from '../../routes.js';
import InvestmentSummary from "../../views/dashboard/components/InvestmentSummary";
import axios from 'axios';
import DetailsTable from "../../views/dashboard/components/DetailsTable";
import CostTable from "../../views/dashboard/components/CostTable";
import InsightsGrid from "../../views/properties/components/InsightsGrid";
import InsightsReports from "../../views/dashboard/InsightsReports";

export default function Dashboard(props) {
    const {...rest} = props;
    const [fixed] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const {onOpen} = useDisclosure();
    const toast = useToast();
    const {reportId} = useParams();

    const [insightsData, setInsightsData] = useState({
        "Price per meter": 8584,
        "Loan to cost": 9637,
        "Loan to value": 4417,
        "Renovation expenses": 6055,
        "Purchase additional transactions cost": 4929,
        "Purchase tax": 8437,
        "Closing costs": 5350,
        "Broker purchase cost": 5572,
        "Monthly operating expenses": 8959,
        "Cash on cash": 2084,
        "Net Yearly Cash Flow": 8503,
        "Net Monthly Cash Flow": 4195,
        "Yearly IRR": 8714,
        "Annual rent income": 7911,
        "ROI": 977,
        "Monthly NOI": 9853,
        "Annual NOI": 7348,
        "Monthly rental property taxes": 6706,
        "Annual rental property taxes": 7061,
        "Cap rate": 6056,
        "Gross yield": 9545,
        "Monthly insurances expenses": 4656,
        "Annual insurances expenses": 1682,
        "Monthly maintenance and repairs": 9658,
        "Annual maintenance and repairs": 4657,
        "Monthly vacancy cost": 6515,
        "Annual vacancy cost": 5830,
        "Estimated sale price": 4799,
        "Selling expenses": 8609,
        "Sale proceeds": 2429,
        "Total revenue": 2109,
        "Annual revenue distribution": 4367,
        "Annual operating expenses": 4183,
        "Annual cash flow": 2111,
        "Mortgage remain balance in exit": 2830,
        "Constructor index linked compensation": 7011,
        "Total expenses": 3090,
        "Equity needed for purchase": 2789,
        "Contractor payments": 3483,
        "Annual expenses distribution": 2966,
        "Monthly property management fees": 8243,
        "Annual property management fees": 8937,
        "Net profit": 1848,
        "Capital gain tax": 9829
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

    const fetchInitialData = async () => {
        try {
            // Create a request with the current states
            let req = {
                investment_data: investmentData,
                investor_data: investorData,
                property_data: propertyData,
                mortgage_data: mortgageData,
                other_data: otherData,
            };

            const response = await axios.post('http://localhost:5000/dashboard/bmm', req);
            const insights = response.data.insights;
            setInsightsData(insights);
        } catch (error) {
            console.error('Error fetching initial data', error);
            toast({
                title: 'Error fetching initial data',
                description: 'An error occurred while fetching initial data.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
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
            const res = await axios.put('http://localhost:5000/dashboard/bmm_update', dataToUpdate);
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
            const response = await axios.get(`http://localhost:5000/report/${reportId}`);
            const reportData = response.data.report.data;
            setInsightsData(reportData.insightsData);
            setInvestmentData(reportData.investmentData);
            setInvestorData(reportData.investorData);
            setPropertyData(reportData.propertyData);
            setMortgageData(reportData.mortgageData);
            setOtherData(reportData.otherData);
        } catch (error) {
            console.error('Error fetching report data', error);
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
        } else {
            fetchInitialData();
        }
    }, [reportId]);

    const handleReset = () => {
        // Reset all data logic
        setInvestmentData({
            appraiser_cost: 0,
            lawyer_cost: 0,
            escort_costs: 0,
            additional_transaction_costs_dic: {tax: null, fee: null},
            renovation_expenses_dic: {painting: null, flooring: null},
            furniture_cost: 0,
            broker_purchase_percentage: 0,
            broker_rent_percentage: 0,
            broker_sell_percentage: 0,
            vacancy_percentage: 0.1,
            annual_maintenance_cost_percentage: 0,
            annual_life_insurance_cost: 0,
            annual_house_insurance_cost: 0,
            equity_required_by_percentage: 0,
            management_fees_percentage: 0,
            years_to_exit: 0,
            average_interest_in_exit: 0,
        });

        setInvestorData({
            net_monthly_income: 0,
            total_debt_payment: 0,
            RealEstateInvestmentType: 'house',
            total_available_equity: 0,
            gross_rental_income: 0,
        });

        setPropertyData({
            purchase_price: 0,
            monthly_rent_income: 0,
            square_meters: 0,
            parking_spots: 0,
            warehouse: false,
            balcony_square_meter: 0,
            after_repair_value: 0,
            annual_appreciation_percentage: 0,
        });

        setMortgageData({
            mortgage_advisor_cost: 0,
            interest_rate: 3.5,
            num_payments: 0,
            initial_loan_amount: 0,
            interest_only_period: 0,
        });

        setOtherData({
            years_until_key_reception: 0,
            contractor_payment_distribution: 0,
            construction_input_index_annual_growth: 0,
        });
    };

    const handleSave = () => {
        console.log('Save button clicked');
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

    return (
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
                        background={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
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
                                    {...rest}
                                />
                            </Box>
                        </Portal>
                        {/*<InsightsReports />*/}
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
                        <Flex justifyContent="center" mt={4}>
                            <Button colorScheme="teal" onClick={updateBMM} isLoading={loading} mr={2}>
                                {loading ? <Spinner size="sm"/> : 'Calculate'}
                            </Button>
                            <Button colorScheme="blue" onClick={handleReset} mr={2}>
                                Reset
                            </Button>
                            <Button colorScheme="green" onClick={handleSave}>
                                Save
                            </Button>
                        </Flex>
                        <InvestmentSummary insights={insightsData}/>
                        <Box mt="auto">
                            <Footer/>
                        </Box>
                    </Box>
                </SidebarContext.Provider>
            </Box>
        </Box>
    );
}
