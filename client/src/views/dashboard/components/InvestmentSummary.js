import React, {useEffect, useState} from 'react';
import {Box, Heading, useColorModeValue, Icon, SimpleGrid} from '@chakra-ui/react';
import MiniStatistics from '../../../components/card/MiniStatistics';
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
    MdAssessment
} from "react-icons/md";
import WeeklyRevenue from "../../properties/components/WeeklyRevenue";
import Usa from "../../../assets/img/dashboards/usa.png";
import TotalSpent from "./TotalSpent";
import CheckTable from "./CheckTable";
import tableDataCheck from "../variables/tableDataCheck.json";
import InsightsChart from "./InsightsChart";
import PieCard from "./PieCard";
import ComplexTable from "../../../layouts/reports/components/ReportsTable";
import tableDataComplex from "../variables/tableDataComplex.json";
import Tasks from "../../../layouts/reports/components/Tasks";
import MiniCalendar from "../../../components/calendar/MiniCalendar";
import ListStatistics from "../../../components/card/ListStatistics";

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
};

const symbolMapping = {
    "Price per meter": "$",
    "Loan to cost": "%",
    "Loan to value": "%",
    "Renovation expenses": "$",
    "Purchase additional transactions cost": "$",
    "Purchase tax": "$",
    "Closing costs": "$",
    "Broker purchase cost": "$",
    "Monthly operating expenses": "$",
    "Cash on cash": "%",
    "Net Yearly Cash Flow": "$",
    "Net Monthly Cash Flow": "$",
    "Yearly IRR": "%",
    "Annual rent income": "$",
    "ROI": "%",
    "Monthly NOI": "$",
    "Annual NOI": "$",
    "Monthly rental property taxes": "$",
    "Annual rental property taxes": "$",
    "Cap rate": "%",
    "Gross yield": "%",
    "Monthly insurances expenses": "$",
    "Annual insurances expenses": "$",
    "Monthly maintenance and repairs": "$",
    "Annual maintenance and repairs": "$",
    "Monthly vacancy cost": "$",
    "Annual vacancy cost": "$",
    "Estimated sale price": "$",
    "Selling expenses": "$",
    "Sale proceeds": "$",
    "Total revenue": "$",
    "Annual revenue distribution": "$",
    "Annual operating expenses": "$",
    "Annual cash flow": "$",
    "Mortgage remain balance in exit": "$",
    "Constructor index linked compensation": "$",
    "Total expenses": "$",
    "Equity needed for purchase": "$",
    "Contractor payments": "$",
    "Annual expenses distribution": "$",
    "Monthly property management fees": "$",
    "Annual property management fees": "$",
    "Net profit": "$",
    "Capital gain tax": "$",
};

const getSymbol = (name) => {
    return symbolMapping[name] || '';
};

const getComponentIcon = (name, boxBg, brandColor) => {
    const IconComponent = iconMapping[name];
    return (
        <IconBox w='36px' h='36px' bg={boxBg} icon={<Icon w='27px' h='27px' as={IconComponent} color={brandColor}/>}/>
    );
};

const InvestmentSummary = ({insights, investmentData, investorData, propertyData, mortgageTracks, otherData}) => {
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

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
                                values={value.map((val) => val + symbol)}
                                startContent={getComponentIcon(key, boxBg, brandColor)}
                            />
                        );
                    } else if (typeof value === 'object' && value !== null) {
                        return (
                            <ListStatistics
                                key={index}
                                name={key}
                                values={Object.values(value).map((subValue) => subValue + symbol)}
                                startContent={getComponentIcon(key, boxBg, brandColor)}
                            />
                        );
                    } else {
                        return (
                            <MiniStatistics
                                key={index}
                                name={key}
                                value={value + symbol}
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