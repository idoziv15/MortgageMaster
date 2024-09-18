import React, {useMemo} from "react";
import {Box, Flex, Icon, Text, useColorModeValue} from "@chakra-ui/react";
import BarChart from "../../../components/charts/BarChart";
import Card from "../../../components/card/Card.js";
import {RiArrowUpSFill} from "react-icons/ri";

const barChartOptions = {
    chart: {toolbar: {show: false}},
    tooltip: {
        style: {fontSize: "12px"},
        onDatasetHover: {style: {fontSize: "12px"}},
        theme: "dark"
    },
    xaxis: {
        categories: ["Yearly IRR", "ROI", "Annual NOI", "Cash Flow", "Cap Rate", "Loan to Cost", "Loan to Value"],
        show: false,
        labels: {show: true, style: {colors: "#A3AED0", fontSize: "14px", fontWeight: "500"}},
        axisBorder: {show: false},
        axisTicks: {show: false}
    },
    yaxis: {
        show: false,
        color: "black",
        labels: {show: true, style: {colors: "#CBD5E0", fontSize: "14px"}}
    },
    grid: {
        show: false,
        strokeDashArray: 5,
        yaxis: {lines: {show: true}},
        xaxis: {lines: {show: false}}
    },
    fill: {
        type: "gradient",
        gradient: {
            type: "vertical",
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.9,
            colorStops: [
                [{offset: 0, color: "#4318FF", opacity: 1},
                    {offset: 100, color: "rgba(67, 24, 255, 1)", opacity: 0.28}],
            ]
        }
    },
    dataLabels: {enabled: false},
    plotOptions: {bar: {borderRadius: 10, columnWidth: "40px"}}
};

export default function InsightsChart(props) {
    const {insights, ...rest} = props;
    const textColor = useColorModeValue("secondaryGray.900", "white");

    const barChartData = useMemo(() => [
        {
            name: "Insights",
            data: [
                insights['Yearly IRR'] || 40,
                insights['ROI'] || 45,
                insights['Annual NOI'] !== undefined ? insights['Annual NOI'] * -1 : 0,
                insights['Annual cash flow'] || 70,
                insights['Cap rate'] || 60,
                insights['Loan to cost'] || 65,
                insights['Loan to value'] || 85
            ]
        }
    ], [insights]);

    const calculateProfit = () => {
        const totalExpenses = insights['Total expenses'] ?? 0;
        const totalRevenue = insights['Total revenue'] ?? 0;
        const sum = totalExpenses + totalRevenue;
        return sum !== 0 ? ((totalRevenue / sum) * 100).toFixed(2) : 0;
    };

    console.log("BarChart Data:", barChartData[0].data);

    return (
        <Card align='center' direction='column' w='100%' {...rest}>
            <Flex justify='space-between' align='start' px='10px' pt='5px'>
                <Flex flexDirection='column' align='start' me='20px'>
                    <Flex w='100%'>
                        <Text
                            me='auto'
                            color='secondaryGray.600'
                            fontSize='sm'
                            fontWeight='500'>
                            Net Profit
                        </Text>
                    </Flex>
                    <Flex align='end'>
                        <Text
                            color={textColor}
                            fontSize='34px'
                            fontWeight='700'
                            lineHeight='100%'>
                            {insights['Net profit'] ?? 0}
                        </Text>
                        <Text
                            ms='6px'
                            color='secondaryGray.600'
                            fontSize='sm'
                            fontWeight='500'>
                            $
                        </Text>
                    </Flex>
                </Flex>
                <Flex align='center'>
                    <Icon as={RiArrowUpSFill} color='green.500'/>
                    <Text color='green.500' fontSize='sm' fontWeight='700'>
                        {calculateProfit()}%
                    </Text>
                </Flex>
            </Flex>
            <Box h='240px' mt='auto'>
                <BarChart
                    chartData={barChartData}
                    chartOptions={barChartOptions}
                />
            </Box>
        </Card>
    );
}
