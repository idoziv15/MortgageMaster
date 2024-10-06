import {
    Portal,
    Box,
    useDisclosure,
    useToast,
    Spinner,
    Button,
    Flex,
    useColorModeValue,
} from '@chakra-ui/react';
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
import CurrencyCard from "../../components/card/CurrencyCard";
import {MdAttachMoney, MdEuro} from "react-icons/md";
import {PiCurrencyJpyLight} from "react-icons/pi";
import {BiShekel, BiPound} from "react-icons/bi";

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
    const [activeTab, setActiveTab] = useState(0);
    const [isFirstInvestment, setIsFirstInvestment] = useState(false);
    const [chosenCurrency, setChosenCurrency] = useState({currency: 'usd', icon: MdAttachMoney});
    const [conversionRates, setConversionRates] = useState({
        usd: 1,
        eur: 0.85,
        gbp: 0.75,
        ils: 0.5,
        jpy: 0.4
    });
    const currencyIcons = {
        usd: MdAttachMoney,
        eur: MdEuro,
        gbp: BiPound,
        ils: BiShekel,
        jpy: PiCurrencyJpyLight
    };

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
        'additional_transaction_costs': {value: 0, range: [0, 1000000], step: 1000},
        'renovation_expenses': {value: 0, range: [0, 1000000], step: 1000},
        'furniture_cost': {value: 0, range: [0, 500000], step: 1000},
        'broker_purchase_percentage': {value: 0, range: [0, 10], step: 1},
        'broker_rent_percentage': {value: 0, range: [0, 20], step: 1},
        'broker_sell_percentage': {value: 0, range: [0, 10], step: 1},
        'vacancy_percentage': {value: 5, range: [0, 100], step: 1},
        'annual_maintenance_cost_percentage': {value: 5, range: [0, 100], step: 1},
        'annual_life_insurance_cost': {value: 0, range: [0, 50000], step: 1000},
        'annual_house_insurance_cost': {value: 0, range: [0, 50000], step: 1000},
        'management_fees_percentage': {value: 0, range: [0, 20], step: 0.5},
        'years_to_exit': {value: 0, range: [0, 30], step: 5}
    });
    const [investorData, setInvestorData] = useState({
        'net_monthly_income': {value: 0, range: [0, 100000], step: 1000},
        'total_debt_payment': {value: 0, range: [0, 10000000], step: 10000},
        'total_available_equity': {value: 0, range: [0, 100000000], step: 10000},
        'gross_rental_income': {value: 0, range: [0, 100000], step: 1000},
        'yearly_revenue': {value: []},
        'yearly_expenses': {value: []}
    });
    const [propertyData, setPropertyData] = useState({
        'purchase_price': {value: 0, range: [0, 20000000], step: 100000},
        'monthly_rent_income': {value: 0, range: [0, 20000], step: 1000},
        'real_estate_investment_type': {value: 'single apartment'},
        'square_meters': {value: 0, range: [0, 200], step: 10},
        'parking_spots': {value: 0, range: [0, 4], step: 1},
        'warehouse': {value: false},
        'balcony_square_meter': {value: 0, range: [0, 100], step: 10},
        'after_repair_value': {value: 0, range: [0, 100000000], step: 100000},
        'annual_appreciation_percentage': {value: 3.5, range: [0, 15], step: 1}
    });
    const [mortgageTracks, setMortgageTracks] = useState([
        {
            id: Date.now(),
            data: {
                'interest_rate': 3.5,
                'mortgage_duration': 0,
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
        'years_until_key_reception': {value: 0, range: [0, 30], step: 1},
        'contractor_payment_distribution': {value: []},
        'construction_input_index_annual_growth': {value: 4, range: [0, 10], step: 0.1}
    });
    const isMonetaryField = (field) => {
        const monetaryFields = [
            "Price per meter", "Renovation expenses", "Purchase additional transactions cost",
            "Purchase tax", "Closing costs", "Broker purchase cost", "Monthly operating expenses",
            "Net Yearly Cash Flow", "Net Monthly Cash Flow", "Annual rent income",
            "Monthly NOI", "Annual NOI", "Monthly rental property taxes",
            "Annual rental property taxes", "Estimated sale price", "Selling expenses",
            "Sale proceeds", "Total revenue", "Annual operating expenses",
            "Annual cash flow", "Mortgage remain balance in exit",
            "Total expenses", "Equity needed for purchase", "Constructor index linked compensation",
            "Contractor payments", "Monthly property management fees", "Annual property management fees",
            "Net profit", "Capital gain tax"
        ];
        return monetaryFields.map(field => field.toLowerCase().trim()).includes(field.toLowerCase().trim());
    };
    const convertCurrency = (currentRate, targetRate) => {
        const conversionFactor = targetRate / currentRate;
        const convertedData = {};

        // Iterate over the insightsData
        Object.keys(insightsData).forEach((key) => {
            const value = insightsData[key];
            if (isMonetaryField(key)) {
                if (typeof value === 'number') {
                    convertedData[key] = (value * conversionFactor).toFixed(2);
                } else if (typeof value === 'string') {
                    const parsedValue = parseFloat(value.replace(/,/g, ''));
                    if (!isNaN(parsedValue)) {
                        convertedData[key] = (parsedValue * conversionFactor).toFixed(2);
                    }
                } else if (Array.isArray(value)) {
                    convertedData[key] = value.map((val) => {
                        if (typeof val === 'number') {
                            return (val * conversionFactor).toFixed(2);
                        } else if (typeof val === 'string') {
                            const parsedVal = parseFloat(val.replace(/,/g, ''));
                            if (!isNaN(parsedVal)) {
                                return (parsedVal * conversionFactor).toFixed(2);
                            }
                        }
                        return val;
                    });
                } else {
                    convertedData[key] = value;
                }
            } else {
                convertedData[key] = value;
            }
        });

        return convertedData;
    };
    const handleCurrencyChange = (newCurrency) => {
        const currentRate = conversionRates[chosenCurrency.currency];
        const targetRate = conversionRates[newCurrency];

        if (currentRate && targetRate) {
            setChosenCurrency({currency: newCurrency, icon: currencyIcons[newCurrency] || MdAttachMoney});
            const convertedData = convertCurrency(currentRate, targetRate);
            setInsightsData(formatInsights(convertedData));
        }
    };
    const fetchCurrencyRates = async () => {
        const API_KEY = process.env.REACT_APP_CONVERSION_KEY;
        const BASE_CURRENCY = 'USD';

        try {
            const response = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${BASE_CURRENCY}`);
            const data = await response.json();

            if (data.result === 'success') {
                const updatedRates = {
                    usd: data.conversion_rates.USD,
                    eur: data.conversion_rates.EUR,
                    gbp: data.conversion_rates.GBP,
                    ils: data.conversion_rates.ILS,
                    jpy: data.conversion_rates.JPY,
                };

                setConversionRates(updatedRates);
            } else {
                console.error("Error fetching conversion rates:", data.error);
            }
        } catch (error) {
            console.error("Error fetching conversion rates:", error);
        }
    };

    useEffect(() => {
        fetchCurrencyRates();
    }, []);
    const addMortgageTrack = () => {
        if (mortgageTracks.length >= 7) {
            toast({
                title: "Track Limit Reached.",
                description: "You can only add up to 7 mortgage tracks.",
                status: "warning",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        const newTrack = {
            id: Date.now(),
            data: {
                // 'mortgage_advisor_cost': 0,
                'interest_rate': 3.5,
                // 'num_payments': 0,
                'mortgage_duration': 0,
                'initial_loan_amount': 0,
                'interest_only_period': 0,
                'linked_index': [],
                'forecasting_interest_rate': [],
                'interest_changing_period': 0,
                'average_interest_when_taken': null,
                'mortgage_type': 'constant_not_linked'
            }
        };
        setMortgageTracks(prevTracks => {
            const updatedTracks = [...prevTracks, newTrack];
            setActiveTab(updatedTracks.length - 1);
            return updatedTracks;
        });
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
            if ((key === 'linked_index' || key === 'forecasting_interest_rate') && Object.keys(field).length === 0 && field.constructor === Object) {
                acc[key] = [];
            }
            // Check if it's an object and has a 'value' property
            else if (typeof field === 'object' && field !== null) {
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

    const validateTracksTotalAmount = () => {
        const maxLoanAmount = 0.75 * propertyData.purchase_price.value;
        // Calculate the total initial loan amount from all tracks
        const totalLoanAmount = mortgageTracks.reduce((sum, track) => {
            return sum + (track.data.initial_loan_amount || 0);
        }, 0);

        // Check if the total loan amount exceeds 75% of the purchase price
        if (totalLoanAmount > maxLoanAmount) {
            // Show toast error
            toast({
                title: "Loan Amount Exceeded",
                description: `The total loan amount exceeds 75% of the property purchase price.`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });

            return false;
        }

        return true;
    };

    function validateConstractorPayments() {
        const paymentList = otherData.contractor_payment_distribution.value;
        const yearsUntilKeyReception = otherData.years_until_key_reception.value;

        // Check if list size matches years_until_key_reception + 1
        if (isFirstInvestment && (yearsUntilKeyReception + 1) === paymentList.length) {
            // Calculate the sum of the payment distribution list
            const paymentSum = paymentList.reduce((acc, curr) => acc + parseFloat(curr), 0);

            // Check if the sum of the payment list is 1
            if (paymentSum === 1) {
                return true;
            }
        }

        // Show toast error if either condition fails
        toast({
            title: "Invalid contractor payments distribution.",
            description: `The contractor payments distribution list size should be equal to years until key reception 
            plus one. Also, the sum of the payments should be 1.`,
            status: "error",
            duration: 5000,
            isClosable: true,
        });
        return false;
    }

    function formatInsights(insights) {
        const formattedInsights = {};

        Object.entries(insights).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                formattedInsights[key] = value.map(item => formatNumber(item));
            } else {
                formattedInsights[key] = formatNumber(value);
            }
        });

        return formattedInsights;
    }

    function formatNumber(value) {
        if (typeof value === 'number') {
            let formattedValue = value.toFixed(2);
            const numberValue = parseFloat(formattedValue);
            if (Math.abs(numberValue) >= 1000) {
                return numberValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            }
            return formattedValue;
        }
        return value;
    }

    const calculateBMM = async () => {
        setLoading(true);
        let isTracksValid = validateTracksTotalAmount();
        let isConstractorPaymentsValid = isFirstInvestment ? validateConstractorPayments() : true;
        if (!isTracksValid || !isConstractorPaymentsValid) {
            setLoading(false);
            return;
        }

        let dataToUpdate = isFirstInvestment ? {
            investment_data: filterValues(investmentData),
            investor_data: filterValues(investorData),
            property_data: filterValues(propertyData),
            mortgage_data: mortgageTracks.map(track => filterValues(track.data)),
            other_data: filterValues(otherData)
        } : {
            investment_data: filterValues(investmentData),
            investor_data: filterValues(investorData),
            property_data: filterValues(propertyData),
            mortgage_data: mortgageTracks.map(track => filterValues(track.data)),
            other_data: filterValues({
                'years_until_key_reception': {value: 0, range: [0, 50], step: 1},
                'contractor_payment_distribution': {value: []},
                'construction_input_index_annual_growth': {value: 0, range: [0, 10], step: 0.1}
            })
        };

        try {
            const token = getToken();
            const res = await axios.put(`${process.env.REACT_APP_SERVER_URL}/bmm`, dataToUpdate, {
                headers: {Authorization: `Bearer ${token}`},
            });
            const updatedInsights = res.data.insights;
            setInsightsData(formatInsights(updatedInsights));
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

    function formatInvestor(data) {
        return {
            'net_monthly_income': {value: data.net_monthly_income ?? 0, range: [0, 100000], step: 1000},
            'total_debt_payment': {value: data.total_debt_payment ?? 0, range: [0, 10000000], step: 10000},
            'total_available_equity': {value: data.total_available_equity ?? 0, range: [0, 100000000], step: 10000},
            'gross_rental_income': {value: data.gross_rental_income ?? 0, range: [0, 100000], step: 1000},
            'yearly_revenue': {value: data.yearly_revenue ?? []},
            'yearly_expenses': {value: data.yearly_expenses ?? []}
        };
    }

    function formatInsightsData(data) {
        return {
            "Price per meter": data["Price per meter"] ?? 0,
            "Loan to cost": data["Loan to cost"] ?? 0,
            "Loan to value": data["Loan to value"] ?? 0,
            "Renovation expenses": data["Renovation expenses"] ?? 0,
            "Purchase additional transactions cost": data["Purchase additional transactions cost"] ?? 0,
            "Purchase tax": data["Purchase tax"] ?? 0,
            "Closing costs": data["Closing costs"] ?? 0,
            "Broker purchase cost": data["Broker purchase cost"] ?? 0,
            "Monthly operating expenses": data["Monthly operating expenses"] ?? 0,
            "Cash on cash": data["Cash on cash"] ?? 0,
            "Net Yearly Cash Flow": data["Net Yearly Cash Flow"] ?? 0,
            "Net Monthly Cash Flow": data["Net Monthly Cash Flow"] ?? 0,
            "Yearly IRR": data["Yearly IRR"] ?? 0,
            "Annual rent income": data["Annual rent income"] ?? 0,
            "ROI": data["ROI"] ?? 0,
            "Monthly NOI": data["Monthly NOI"] ?? 0,
            "Annual NOI": data["Annual NOI"] ?? 0,
            "Monthly rental property taxes": data["Monthly rental property taxes"] ?? 0,
            "Annual rental property taxes": data["Annual rental property taxes"] ?? 0,
            "Cap rate": data["Cap rate"] ?? 0,
            "Gross yield": data["Gross yield"] ?? 0,
            "Monthly insurances expenses": data["Monthly insurances expenses"] ?? 0,
            "Annual insurances expenses": data["Annual insurances expenses"] ?? 0,
            "Monthly maintenance and repairs": data["Monthly maintenance and repairs"] ?? 0,
            "Annual maintenance and repairs": data["Annual maintenance and repairs"] ?? 0,
            "Monthly vacancy cost": data["Monthly vacancy cost"] ?? 0,
            "Annual vacancy cost": data["Annual vacancy cost"] ?? 0,
            "Estimated sale price": data["Estimated sale price"] ?? 0,
            "Selling expenses": data["Selling expenses"] ?? 0,
            "Sale proceeds": data["Sale proceeds"] ?? 0,
            "Total revenue": data["Total revenue"] ?? 0,
            "Annual revenue distribution": data["Annual revenue distribution"] ?? 0,
            "Annual operating expenses": data["Annual operating expenses"] ?? 0,
            "Annual cash flow": data["Annual cash flow"] ?? 0,
            "Mortgage remain balance in exit": data["Mortgage remain balance in exit"] ?? 0,
            "Constructor index linked compensation": data["Constructor index linked compensation"] ?? 0,
            "Total expenses": data["Total expenses"] ?? 0,
            "Equity needed for purchase": data["Equity needed for purchase"] ?? 0,
            "Contractor payments": data["Contractor payments"] ?? 0,
            "Annual expenses distribution": data["Annual expenses distribution"] ?? 0,
            "Monthly property management fees": data["Monthly property management fees"] ?? 0,
            "Annual property management fees": data["Annual property management fees"] ?? 0,
            "Net profit": data["Net profit"] ?? 0,
            "Capital gain tax": data["Capital gain tax"] ?? 0
        };
    }

    function formatInvestment(data) {
        return {
            'appraiser_cost': {value: data.appraiser_cost ?? 0, range: [0, 1000000], step: 10000},
            'lawyer_cost': {value: data.lawyer_cost ?? 0, range: [0, 1000000], step: 10000},
            'escort_costs': {value: data.escort_costs ?? 0, range: [0, 1000000], step: 100000},
            'mortgage_advisor_cost': {value: data.mortgage_advisor_cost ?? 0, range: [0, 100000], step: 10000},
            'additional_transaction_costs': {
                value: data.additional_transaction_costs ?? 0,
                range: [0, 1000000],
                step: 1000
            },
            'renovation_expenses': {value: data.renovation_expenses ?? 0, range: [0, 1000000], step: 1000},
            'furniture_cost': {value: data.furniture_cost ?? 0, range: [0, 500000], step: 1000},
            'broker_purchase_percentage': {value: data.broker_purchase_percentage ?? 0, range: [0, 10], step: 1},
            'broker_rent_percentage': {value: data.broker_rent_percentage ?? 0, range: [0, 20], step: 1},
            'broker_sell_percentage': {value: data.broker_sell_percentage ?? 0, range: [0, 10], step: 1},
            'vacancy_percentage': {value: data.vacancy_percentage ?? 5, range: [0, 100], step: 1},
            'annual_maintenance_cost_percentage': {
                value: data.annual_maintenance_cost_percentage ?? 5,
                range: [0, 100],
                step: 1
            },
            'annual_life_insurance_cost': {value: data.annual_life_insurance_cost ?? 0, range: [0, 50000], step: 1000},
            'annual_house_insurance_cost': {
                value: data.annual_house_insurance_cost ?? 0,
                range: [0, 50000],
                step: 1000
            },
            'management_fees_percentage': {value: data.management_fees_percentage ?? 0, range: [0, 20], step: 0.5},
            'years_to_exit': {value: data.years_to_exit ?? 0, range: [0, 30], step: 5}
        };
    }

    function formatProperty(data) {
        return {
            'purchase_price': {value: data.purchase_price ?? 0, range: [0, 20000000], step: 100000},
            'monthly_rent_income': {value: data.monthly_rent_income ?? 0, range: [0, 20000], step: 1000},
            'real_estate_investment_type': {value: data.real_estate_investment_type ?? 'single apartment'},
            'square_meters': {value: data.square_meters ?? 0, range: [0, 200], step: 10},
            'parking_spots': {value: data.parking_spots ?? 0, range: [0, 4], step: 1},
            'warehouse': {value: data.warehouse ?? false},
            'balcony_square_meter': {value: data.balcony_square_meter ?? 0, range: [0, 100], step: 10},
            'after_repair_value': {value: data.after_repair_value ?? 0, range: [0, 100000000], step: 100000},
            'annual_appreciation_percentage': {
                value: data.annual_appreciation_percentage ?? 3.5,
                range: [0, 15],
                step: 1
            }
        };
    }

    function formatOther(data) {
        return {
            'years_until_key_reception': {value: data.years_until_key_reception ?? 0, range: [0, 30], step: 1},
            'contractor_payment_distribution': {
                value: data.contractor_payment_distribution ?? [],
                range: [0, 100],
                step: 5
            },
            'construction_input_index_annual_growth': {
                value: data.construction_input_index_annual_growth ?? 0,
                range: [0, 15],
                step: 0.5
            }
        };
    }

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
            const mortgage = reportData.mortgageTracks;
            const other = reportData.otherData;

            setInsightsData(formatInsightsData(insights));
            setInvestmentData(formatInvestment(investment));
            setInvestorData(formatInvestor(investor));
            setPropertyData(formatProperty(property));
            setMortgageTracks(mortgage);
            setOtherData(formatOther(other));

            setReportName(response.data.report.name);
            setReportDescription(response.data.report.description);
            setIsFirstInvestment(response.data.report.isFirstInvestment);
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
            'additional_transaction_costs': {value: 0, range: [0, 1000000], step: 1000},
            'renovation_expenses': {value: 0, range: [0, 1000000], step: 1000},
            'furniture_cost': {value: 0, range: [0, 500000], step: 1000},
            'broker_purchase_percentage': {value: 0, range: [0, 10], step: 1},
            'broker_rent_percentage': {value: 0, range: [0, 20], step: 1},
            'broker_sell_percentage': {value: 0, range: [0, 10], step: 1},
            'vacancy_percentage': {value: 5, range: [0, 100], step: 1},
            'annual_maintenance_cost_percentage': {value: 5, range: [0, 100], step: 1},
            'annual_life_insurance_cost': {value: 0, range: [0, 50000], step: 1000},
            'annual_house_insurance_cost': {value: 0, range: [0, 50000], step: 1000},
            'management_fees_percentage': {value: 0, range: [0, 20], step: 0.5},
            'years_to_exit': {value: 0, range: [0, 30], step: 5}
        });

        setInvestorData({
            'net_monthly_income': {value: 0, range: [0, 1000000], step: 1000},
            'total_debt_payment': {value: 0, range: [0, 10000000], step: 10000},
            'total_available_equity': {value: 0, range: [0, 100000000], step: 10000},
            'gross_rental_income': {value: 0, range: [0, 1000000], step: 1000},
            'yearly_revenue': {value: []},
            'yearly_expenses': {value: []}
        });

        setPropertyData({
            'purchase_price': {value: 0, range: [0, 100000000], step: 100000},
            'monthly_rent_income': {value: 0, range: [0, 50000], step: 1000},
            'real_estate_investment_type': {value: 'single apartment'},
            'square_meters': {value: 0, range: [0, 10000], step: 10},
            'parking_spots': {value: 0, range: [0, 1000], step: 1},
            'warehouse': {value: false},
            'balcony_square_meter': {value: 0, range: [0, 1000], step: 10},
            'after_repair_value': {value: 0, range: [0, 100000000], step: 100000},
            'annual_appreciation_percentage': {value: 0, range: [0, 100], step: 1}
        });

        setMortgageTracks([
            {
                id: Date.now(),
                data: {
                    'interest_rate': 3.5,
                    'mortgage_duration': 0,
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
            mortgageTracks: mortgageTracks.map(track => ({
                id: track.id,
                data: filterValues(track.data)
            })),
            otherData: filterValues(otherData)
        },
        isFirstInvestment: isFirstInvestment
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
                            <Flex direction='column' w='100%'>
                                <CurrencyCard handleCurrencyChange={handleCurrencyChange}/>
                                <Flex direction='row' w='100%'>
                                    {/* Left Side */}
                                    <Box flex='1'>
                                        <InvestorTable data={investorData} tableName={'Investor Details'}
                                                       setData={setInvestorData} chosenCurrency={chosenCurrency}
                                        />
                                        <PropertyTable data={propertyData} tableName={'Property Details'}
                                                       setData={setPropertyData} chosenCurrency={chosenCurrency}
                                        />
                                        <MortgageTable
                                            tableName="Mortgage Details"
                                            tracks={mortgageTracks}
                                            addTrack={addMortgageTrack}
                                            setTracks={setMortgageTracks}
                                            activeTab={activeTab}
                                            setActiveTab={setActiveTab}
                                            propertyData={propertyData}
                                            chosenCurrency={chosenCurrency}
                                        />
                                    </Box>
                                    {/* Right Side */}
                                    <Box flex='1'>
                                        <InvestmentTable data={investmentData} tableName={'Investment Details'}
                                                         setData={setInvestmentData} propertyData={propertyData}
                                                         isFirstInvestment={isFirstInvestment}
                                                         setIsFirstInvestment={setIsFirstInvestment}
                                                         chosenCurrency={chosenCurrency}
                                        />
                                        {isFirstInvestment && (
                                            <AdditionalTable
                                                data={otherData}
                                                tableName={'Additional Details'}
                                                setData={setOtherData}
                                                investmentData={investmentData}
                                            />
                                        )}
                                    </Box>
                                </Flex>
                            </Flex>
                            <Flex justifyContent="center" mt={4} py={10} w='95%' mx='auto'
                                  background={boxBackground}
                            >
                                <Button colorScheme="teal" onClick={calculateBMM} isLoading={loading} mr={10}>
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
                                               mortgageTracks={mortgageTracks} otherData={otherData}
                                               chosenCurrency={chosenCurrency}/>
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
