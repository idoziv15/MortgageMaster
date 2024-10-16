import {Avatar, Box, Flex, FormLabel, Icon, Select, SimpleGrid, Text, useColorModeValue} from "@chakra-ui/react";
import Usa from "../../assets/img/dashboards/usa.png";
import MiniCalendar from "../../components/calendar/MiniCalendar";
import MiniStatistics from "../../components/card/MiniStatistics";
import IconBox from "../../components/icons/IconBox";
import React from "react";
import {MdAddTask, MdAttachMoney, MdBarChart, MdFileCopy} from "react-icons/md";
import CheckTable from "./components/CheckTable";
import ComplexTable from "./components/ComplexTable";
import DailyTraffic from "./components/DailyTraffic";
import PieCard from "./components/PieCard";
import Tasks from "./components/Tasks";
import TotalSpent from "./components/TotalSpent";
import PropertyDetails from "./components/PropertyDetails";
import WeeklyRevenue from "./components/WeeklyRevenue";
import {columnsDataCheck, columnsDataComplex} from "./variables/columnsData";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";
import PropertyDetailTable from "./components/PropertyDetailTable";
import InvestorDetail from "../profile/components/InvestorDetail";
import Card from "../../components/card/Card";
import InsightsGrid from "./components/InsightsGrid";

export default function PropertyReports({property, insights}) {
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    return (
        <Box pt={{base: "10px", md: "5px", xl: "5px"}} w='95%' m='auto'>
            {/*<SimpleGrid columns={1} gap='20px' mb='20px'>*/}
            {/*    /!*<PropertyDetails property={property}/>*!/*/}
            {/*    <PropertyDetailTable propertyDetails={property}/>*/}
            {/*</SimpleGrid>*/}
            <Card mb="20px">
                <PropertyDetailTable propertyDetails={property}/>
            </Card>
            {/*<SimpleGrid columns={{base: 1, md: 2, lg: 3, "2xl": 6}} gap='20px' mb='20px'>*/}
            {/*    {Object.entries(insights).map(([key, value], index) => (*/}
            {/*        <MiniStatistics*/}
            {/*            key={index}*/}
            {/*            name={key}*/}
            {/*            value={value}*/}
            {/*        />*/}
            {/*    ))}*/}
            {/*</SimpleGrid>*/}
            <InsightsGrid insights={insights} />
            <SimpleGrid columns={{base: 1, md: 2, lg: 3, "2xl": 6}} gap='20px' mb='20px'>
                <MiniStatistics
                    startContent={
                        <IconBox
                            w='56px'
                            h='56px'
                            bg={boxBg}
                            icon={
                                <Icon w='32px' h='32px' as={MdBarChart} color={brandColor}/>
                            }
                        />
                    }
                    name='Earnings'
                    value='$350.4'
                />
                <MiniStatistics
                    startContent={
                        <IconBox
                            w='56px'
                            h='56px'
                            bg={boxBg}
                            icon={
                                <Icon w='32px' h='32px' as={MdAttachMoney} color={brandColor}/>
                            }
                        />
                    }
                    name='Spend this month'
                    value='$642.39'
                />
                <MiniStatistics growth='+23%' name='Sales' value='$574.34'/>
                <MiniStatistics
                    endContent={
                        <Flex me='-16px' mt='10px'>
                            <FormLabel htmlFor='balance'>
                                <Avatar src={Usa}/>
                            </FormLabel>
                            <Select
                                id='balance'
                                variant='mini'
                                mt='5px'
                                me='0px'
                                defaultValue='usd'>
                                <option value='usd'>USD</option>
                                <option value='eur'>EUR</option>
                                <option value='gba'>GBA</option>
                            </Select>
                        </Flex>
                    }
                    name='Your balance'
                    value='$1,000'
                />
                <MiniStatistics
                    startContent={
                        <IconBox
                            w='56px'
                            h='56px'
                            bg='linear-gradient(90deg, #4481EB 0%, #04BEFE 100%)'
                            icon={<Icon w='28px' h='28px' as={MdAddTask} color='white'/>}
                        />
                    }
                    name='New Tasks'
                    value='154'
                />
                <MiniStatistics
                    startContent={
                        <IconBox
                            w='56px'
                            h='56px'
                            bg={boxBg}
                            icon={
                                <Icon w='32px' h='32px' as={MdFileCopy} color={brandColor}/>
                            }
                        />
                    }
                    name='Total Projects'
                    value='2935'
                />
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
            <SimpleGrid columns={{base: 1, md: 1, xl: 2}} gap='20px' mb='20px'>
                <ComplexTable
                    columnsData={columnsDataComplex}
                    tableData={tableDataComplex}
                />
                <SimpleGrid columns={{base: 1, md: 2, xl: 2}} gap='20px'>
                    <Tasks/>
                    <MiniCalendar h='100%' minW='100%' selectRange={false}/>
                </SimpleGrid>
            </SimpleGrid>
        </Box>
    );
}
