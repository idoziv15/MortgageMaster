import {
    Box,
    Button,
    Flex,
    Icon,
    Text,
    useColorModeValue,
} from "@chakra-ui/react";
import Card from "../../../components/card/Card.js";
import LineChart from "../../../components/charts/LineChart";
import React, {useEffect, useState} from "react";
import {IoCheckmarkCircle} from "react-icons/io5";
import {MdBarChart, MdOutlineCalendarToday, MdTrendingDown} from "react-icons/md";
import {RiArrowUpSFill, RiArrowDownFill} from "react-icons/ri";

const lineChartOptionsTotalSpent = {
    chart: {
        toolbar: {show: false},
        dropShadow: {enabled: true, top: 13, left: 0, blur: 10, opacity: 0.1, color: "#4318FF"}
    },
    colors: ["#4318FF", "#39B8FF"],
    markers: {
        size: 0, colors: "white", strokeColors: "#7551FF", strokeWidth: 3, strokeOpacity: 0.9, strokeDashArray: 0,
        fillOpacity: 1, discrete: [], shape: "circle", radius: 2, offsetX: 0, offsetY: 0, showNullDataPoints: true,
    },
    tooltip: {theme: "dark"},
    dataLabels: {enabled: false},
    stroke: {curve: "smooth", type: "line"},
    xaxis: {
        type: "numeric",
        categories: ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"],
        labels: {style: {colors: "#A3AED0", fontSize: "12px", fontWeight: "500"}},
        axisBorder: {show: false},
        axisTicks: {show: false}
    },
    yaxis: {show: false},
    legend: {show: false},
    grid: {show: false, column: {color: ["#7551FF", "#39B8FF"], opacity: 0.5}},
    color: ["#7551FF", "#39B8FF"]
};

export default function TotalSpent(props) {
    const {investorData, ...rest} = props;
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = useColorModeValue("secondaryGray.600", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const iconColor = useColorModeValue("brand.500", "white");
    const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const bgHover = useColorModeValue({bg: "secondaryGray.400"}, {bg: "whiteAlpha.50"});
    const bgFocus = useColorModeValue({bg: "secondaryGray.300"}, {bg: "whiteAlpha.100"});
    const [lineChartDataTotalSpent, setLineChartDataTotalSpent] = useState([
        { name: "Revenue", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { name: "Profit", data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] }
    ]);

    useEffect(() => {
        const revenueData = investorData.yearly_revenue.value || [];
        const expensesData = investorData.yearly_expenses.value || [];
        console.log(investorData)
        console.log(revenueData)
        const profitData = revenueData.map((revenue, index) => revenue - (expensesData[index] || 0));

        setLineChartDataTotalSpent([
            { name: "Revenue", data: revenueData },
            { name: "Profit", data: profitData }
        ]);
    }, [investorData.yearly_revenue, investorData.yearly_expenses]);
    const calculatePercentageDifference = (debtPayment, netIncome, grossRentalIncome) => {
        const totalIncome = netIncome + grossRentalIncome;
        const difference = totalIncome - debtPayment;
        let result = [0, totalIncome];
        result[0] = totalIncome !== 0 ? (difference / totalIncome) * 100 : difference;
        return result;
    };

    const percentage = calculatePercentageDifference(
        investorData.total_debt_payment.value,
        investorData.net_monthly_income.value,
        investorData.gross_rental_income.value
    );

    return (
        <Card
            justifyContent='center'
            align='center'
            direction='column'
            w='100%'
            mb='0px'
            {...rest}>
            <Flex justify='space-between' ps='0px' pe='20px' pt='5px'>
                <Flex align='center' w='100%'>
                    <Button
                        bg={boxBg}
                        fontSize='sm'
                        fontWeight='500'
                        color={textColorSecondary}
                        borderRadius='7px'>
                        <Icon
                            as={MdOutlineCalendarToday}
                            color={textColorSecondary}
                            me='4px'
                        />
                        This Month
                    </Button>
                    <Button
                        ms='auto'
                        align='center'
                        justifyContent='center'
                        bg={bgButton}
                        _hover={bgHover}
                        _focus={bgFocus}
                        _active={bgFocus}
                        w='37px'
                        h='37px'
                        lineHeight='100%'
                        borderRadius='10px'
                        {...rest}>
                        <Icon as={MdBarChart} color={iconColor} w='24px' h='24px'/>
                    </Button>
                </Flex>
            </Flex>
            <Flex w='100%' flexDirection={{base: "column", lg: "row"}}>
                <Flex flexDirection='column' me='20px' mt='28px'>
                    <Text
                        color={textColor}
                        fontSize='34px'
                        textAlign='start'
                        fontWeight='700'
                        lineHeight='100%'>
                        ${investorData['total_debt_payment'].value / 1000} K
                    </Text>
                    <Flex align='center' mb='3px'>
                        <Text
                            color='secondaryGray.600'
                            fontSize='sm'
                            fontWeight='500'
                            mt='4px'
                            me='12px'>
                            Total Spent
                        </Text>
                        <Flex align='center'>
                            <Icon as={percentage[0] > 0 ? RiArrowUpSFill : RiArrowDownFill}
                                  color={percentage[0] > 0 ? 'green.500' : 'red.500'} me='2px'
                                  mt='2px'/>
                            <Text color={percentage[0] > 0 ? 'green.500' : 'red.500'} fontSize='sm' fontWeight='700'>
                                {percentage[1] === 0 ? `${percentage[1]}$` : `${percentage[0].toFixed(2)}%`}
                            </Text>
                        </Flex>
                    </Flex>

                    <Flex align='center'>
                        <Icon as={percentage[0] > 0 ? IoCheckmarkCircle : MdTrendingDown}
                              color={percentage[0] > 0 ? 'green.500' : 'red.500'} me='4px'/>
                        <Text color={percentage[0] > 0 ? 'green.500' : 'red.500'} fontSize='md' fontWeight='700'>
                            {percentage[0] > 0 ? 'Positive Profit' : 'Loss profit'}
                        </Text>
                    </Flex>
                </Flex>
                <Box minH='260px' minW='75%' mt='auto'>
                    <LineChart
                        key={JSON.stringify(lineChartDataTotalSpent)}
                        chartData={lineChartDataTotalSpent}
                        chartOptions={lineChartOptionsTotalSpent}
                    />
                </Box>
            </Flex>
        </Card>
    );
}
