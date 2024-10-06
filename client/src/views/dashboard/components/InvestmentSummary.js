import React, {useEffect, useState} from 'react';
import {Box, Heading, useColorModeValue, Icon, SimpleGrid, ChakraProvider, Spinner} from '@chakra-ui/react';
import IconBox from "../../../components/icons/IconBox";
import {
    MdAttachMoney,
    MdBarChart,
    MdAccountBalance,
    MdSecurity,
    MdBuild,
    MdHotel,
    MdMonetizationOn,
    MdShowChart,
    MdPieChart,
    MdTrendingUp,
    MdHome,
    MdBusinessCenter,
    MdMoneyOff,
    MdReceipt,
    MdPerson,
    MdAssessment, MdEuro
} from "react-icons/md";
import WeeklyRevenue from "../../properties/components/WeeklyRevenue";
import TotalSpent from "./TotalSpent";
import InsightsChart from "./InsightsChart";
import PieCard from "./PieCard";
import ListStatistics from "../../../components/card/ListStatistics";
import MiniStatistics from '../../../components/card/MiniStatistics';
import {PiCurrencyGbp, PiCurrencyJpyLight} from "react-icons/pi";
import {BiShekel} from "react-icons/bi";

const InvestmentSummary = ({insights, investorData, chosenCurrency}) => {
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const currencyIcons = {
        usd: '$',
        eur: '€',
        gbp: '£',
        ils: '₪',
        jpy: '¥'
    };
    const iconMapping = {
        "Price per meter": MdAttachMoney,
        "Loan to cost": MdAttachMoney,
        "Loan to value": MdAttachMoney,
        "Renovation expenses": MdBuild,
        "Purchase additional transactions cost": MdReceipt,
        "Purchase tax": MdMoneyOff,
        "Closing costs": MdMonetizationOn,
        "Broker purchase cost": MdPerson,
        "Monthly operating expenses": MdShowChart,
        "Cash on cash": MdTrendingUp,
        "Net Yearly Cash Flow": MdAccountBalance,
        "Net Monthly Cash Flow": MdAccountBalance,
        "Yearly IRR": MdAssessment,
        "Annual rent income": MdHome,
        "ROI": MdShowChart,
        "Monthly NOI": MdTrendingUp,
        "Annual NOI": MdBarChart,
        "Monthly rental property taxes": MdAttachMoney,
        "Annual rental property taxes": MdAttachMoney,
        "Cap rate": MdShowChart,
        "Gross yield": MdShowChart,
        "Monthly insurances expenses": MdSecurity,
        "Annual insurances expenses": MdSecurity,
        "Monthly maintenance and repairs": MdBuild,
        "Annual maintenance and repairs": MdBuild,
        "Monthly vacancy cost": MdHotel,
        "Annual vacancy cost": MdHotel,
        "Estimated sale price": MdAttachMoney,
        "Selling expenses": MdMonetizationOn,
        "Sale proceeds": MdAttachMoney,
        "Total revenue": MdShowChart,
        "Annual revenue distribution": MdPieChart,
        "Annual operating expenses": MdShowChart,
        "Annual cash flow": MdTrendingUp,
        "Mortgage remain balance in exit": MdHome,
        "Constructor index linked compensation": MdAttachMoney,
        "Total expenses": MdShowChart,
        "Equity needed for purchase": MdAccountBalance,
        "Contractor payments": MdBuild,
        "Annual expenses distribution": MdPieChart,
        "Monthly property management fees": MdBusinessCenter,
        "Annual property management fees": MdBusinessCenter,
        "Net profit": MdTrendingUp,
        "Capital gain tax": MdMoneyOff,
    }

    const getComponentIcon = (name, boxBg, brandColor) => {
        const IconComponent = iconMapping[name];
        return (
            <IconBox w='36px' h='36px' bg={boxBg}
                     icon={<Icon w='27px' h='27px' as={IconComponent} color={brandColor}/>}/>
        );
    };
    const getSymbol = (name) => {
        const symbol = currencyIcons[chosenCurrency.currency] || '$';
        const symbolMapping = {
            "Price per meter": symbol,
            "Loan to cost": "%",
            "Loan to value": "%",
            "Renovation expenses": symbol,
            "Purchase additional transactions cost": symbol,
            "Purchase tax": symbol,
            "Closing costs": symbol,
            "Broker purchase cost": symbol,
            "Monthly operating expenses": symbol,
            "Cash on cash": "%",
            "Net Yearly Cash Flow": symbol,
            "Net Monthly Cash Flow": symbol,
            "Yearly IRR": "%",
            "Annual rent income": symbol,
            "ROI": "%",
            "Monthly NOI": symbol,
            "Annual NOI": symbol,
            "Monthly rental property taxes": symbol,
            "Annual rental property taxes": symbol,
            "Cap rate": "%",
            "Gross yield": "%",
            "Monthly insurances expenses": symbol,
            "Annual insurances expenses": symbol,
            "Monthly maintenance and repairs": symbol,
            "Annual maintenance and repairs": symbol,
            "Monthly vacancy cost": symbol,
            "Annual vacancy cost": symbol,
            "Estimated sale price": symbol,
            "Selling expenses": symbol,
            "Sale proceeds": symbol,
            "Total revenue": symbol,
            "Annual revenue distribution": symbol,
            "Annual operating expenses": symbol,
            "Annual cash flow": symbol,
            "Mortgage remain balance in exit": symbol,
            "Constructor index linked compensation": symbol,
            "Total expenses": symbol,
            "Equity needed for purchase": symbol,
            "Contractor payments": symbol,
            "Annual expenses distribution": symbol,
            "Monthly property management fees": symbol,
            "Annual property management fees": symbol,
            "Net profit": symbol,
            "Capital gain tax": symbol,
        };
        return symbolMapping[name] || '$';
    };

    if (!insights || !investorData) {
        return (
            <ChakraProvider>
                <Box p={4} display="flex" justifyContent="center" alignItems="center">
                    <Spinner size="xl" />
                </Box>
            </ChakraProvider>
        );
    }

    return (
        <Box p={7}>
            <Heading>Investment Summary</Heading>
            <SimpleGrid
                columns={{base: 1, md: 3, lg: 5, "2xl": 6}}
                gap='20px'
                mt='10px'
                mb='20px'>
                {Object.entries(insights).map(([key, value], index) => {
                    const symbol = getSymbol(key);

                    if (Array.isArray(value)) {
                        return (
                            <ListStatistics
                                key={index}
                                name={key}
                                values={value.map((val) => val + ' ' + symbol)}
                                startContent={getComponentIcon(key, boxBg, brandColor)}
                            />
                        );
                    } else if (typeof value === 'object' && value !== null) {
                        return (
                            <ListStatistics
                                key={index}
                                name={key}
                                values={Object.values(value).map((subValue) => subValue + ' ' + symbol)}
                                startContent={getComponentIcon(key, boxBg, brandColor)}
                            />
                        );
                    } else {
                        return (
                            <MiniStatistics
                                key={index}
                                name={key}
                                value={value + ' ' + symbol}
                                startContent={getComponentIcon(key, boxBg, brandColor)}
                            />
                        );
                    }
                })}
            </SimpleGrid>
            <SimpleGrid columns={{base: 1, md: 2, xl: 2}} gap='20px' mb='20px'>
                <TotalSpent investorData={investorData}/>
                <WeeklyRevenue investorData={investorData}/>
            </SimpleGrid>
            <SimpleGrid columns={{base: 1, md: 2, xl: 2}} gap='20px'>
                <InsightsChart insights={insights}/>
                <PieCard/>
            </SimpleGrid>
        </Box>
    );
};

export default InvestmentSummary;