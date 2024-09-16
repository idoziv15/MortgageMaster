import React from 'react';
import {
    ChakraProvider,
    Box,
    Heading,
    Card,
    CardHeader,
    CardBody,
    useColorModeValue,
    Icon,
    SimpleGrid, Flex, FormLabel, Avatar, Select,
} from '@chakra-ui/react';
import MiniStatistics from '../../../components/card/MiniStatistics';
import IconBox from "../../../components/icons/IconBox";
import {
    MdAddTask,
    MdAttachMoney,
    MdBarChart,
    MdFileCopy,
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
import {columnsDataCheck, columnsDataComplex} from "../variables/columnsData";
import tableDataCheck from "../variables/tableDataCheck.json";
import DailyTraffic from "./DailyTraffic";
import PieCard from "./PieCard";
import ComplexTable from "./ComplexTable";
import tableDataComplex from "../variables/tableDataComplex.json";
import Tasks from "../../../layouts/reports/components/Tasks";
import MiniCalendar from "../../../components/calendar/MiniCalendar";

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

const getComponentIcon = (name, boxBg, brandColor) => {
    const IconComponent = iconMapping[name];
    return (
        <IconBox w='36px' h='36px' bg={boxBg} icon={<Icon w='27px' h='27px' as={IconComponent} color={brandColor}/>} />
    );
};
const InvestmentSummary = ({insights}) => {
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");

    return (
        // <ChakraProvider>
        //     <Box p={4} mx={5}>
        //         <Card>
        //             <CardHeader py={1} px={3}>
        //                 <Heading size="md">Investment Summary</Heading>
        //             </CardHeader>
        //             <CardBody py={1} px={3}>
        //                 <SimpleGrid columns={{base: 1, md: 2, lg: 3, "2xl": 6}} gap="20px" mb="20px">
        //                     {Object.entries(insights).map(([key, value], index) => {
        //                         const Component = componentMapping[key] || MiniStatistics;
        //                         return (
        //                             <Component
        //                                 key={index}
        //                                 name={key}
        //                                 value={value}
        //                                 startContent={
        //                                     <IconBox w="56px" h="56px" bg={boxBg}
        //                                              icon={
        //                                                  <Icon w="32px" h="32px" as={MdBarChart} color={brandColor}/>
        //                                              }
        //                                     />
        //                                 }
        //                             />
        //                         );
        //                     })}
        //                 </SimpleGrid>
        //             </CardBody>
        //         </Card>
        //     </Box>
        // </ChakraProvider>
        <Box p={7}>
            <Heading>Investment Summary</Heading>
            <SimpleGrid
                columns={{base: 1, md: 3, lg: 5, "2xl": 6}}
                gap='20px'
                mt='10px'
                mb='20px'>
                {Object.entries(insights).map(([key, value], index) => (
                    <MiniStatistics
                        key={index}
                        name={key}
                        value={'$' + value}
                        startContent={getComponentIcon(key, boxBg, brandColor)}
                    />
                ))}
            </SimpleGrid>

            <SimpleGrid columns={{base: 1, md: 2, xl: 2}} gap='20px' mb='20px'>
                <TotalSpent/>
                <WeeklyRevenue/>
            </SimpleGrid>
            <SimpleGrid columns={{base: 1, md: 1, xl: 2}} gap='20px' mb='20px'>
                <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck}/>
                <SimpleGrid columns={{base: 1, md: 2, xl: 2}} gap='20px'>
                    <DailyTraffic/>
                    <PieCard/>
                </SimpleGrid>
            </SimpleGrid>
        </Box>
    );
};

export default InvestmentSummary;

// <SimpleGrid columns={{base: 1, md: 2, lg: 3, "2xl": 6}} gap="20px" mb="20px">
//     {Object.entries(insights).map(([key, value], index) => (
//         <MiniStatistics
//             key={index}
//             name={key}
//             value={value}
//             startContent={
//                 <IconBox w="56px" h="56px" bg={boxBg}
//                          icon={
//                              <Icon w="32px" h="32px" as={MdBarChart} color={brandColor}/>
//                          }
//                 />
//             }
//         />
//     ))}
// </SimpleGrid>