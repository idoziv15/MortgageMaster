import {Box, Button, Flex, Icon, Text, useColorModeValue} from "@chakra-ui/react";
import Card from "../../../components/card/Card.js";
import BarChart from "../../../components/charts/BarChart";
import React, {useEffect, useState} from "react";
import {MdBarChart} from "react-icons/md";

const barChartOptionsConsumption = {
    chart: {stacked: true, toolbar: {show: false}},
    tooltip: {
        style: {fontSize: "12px", fontFamily: undefined},
        onDatasetHover: {style: {fontSize: "12px", fontFamily: undefined}},
        theme: "dark"
    },
    xaxis: {
        categories: ["17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"],
        show: false,
        labels: {show: true, style: {colors: "#A3AED0", fontSize: "14px", fontWeight: "500"}},
        axisBorder: {show: false},
        axisTicks: {show: false},
    },
    yaxis: {
        show: false,
        color: "black",
        labels: {show: false, style: {colors: "#A3AED0", fontSize: "14px", fontWeight: "500"}}
    },
    grid: {
        borderColor: "rgba(163, 174, 208, 0.3)",
        show: true,
        yaxis: {lines: {show: false, opacity: 0.5}},
        row: {opacity: 0.5},
        xaxis: {lines: {show: false}}
    },
    fill: {type: "solid", colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"]},
    legend: {show: false},
    colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
    dataLabels: {enabled: false},
    plotOptions: {bar: {borderRadius: 10, columnWidth: "20px"}}
};

export default function WeeklyRevenue(props) {
    const {investorData, ...rest} = props;
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const iconColor = useColorModeValue("brand.500", "white");
    const bgButton = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    const bgHover = useColorModeValue({bg: "secondaryGray.400"}, {bg: "whiteAlpha.50"});
    const bgFocus = useColorModeValue({bg: "secondaryGray.300"}, {bg: "whiteAlpha.100"});

    const [barChartDataConsumption, setBarChartDataConsumption] = useState([
        {name: "Net Monthly Income", data: [400, 370, 330, 390, 320, 350, 360, 320, 380, 400, 200, 300]},
        {name: "Gross Rental Income", data: [400, 370, 330, 390, 320, 350, 360, 320, 380, 400, 200, 300]},
        // {name: "Total Income", data: [400, 370, 330, 390, 320, 350, 360, 320, 380, 400, 200, 300]}
        // {name: "Net Monthly Income", data: [0,0,0,0,0,0,0,0,0,0,0,0]},
        // {name: "Gross Rental Income", data: [0,0,0,0,0,0,0,0,0,0,0,0]},
        // {name: "Total Income", data: [0,0,0,0,0,0,0,0,0,0,0,0]}
    ]);

    useEffect(() => {
        const total = [];
        for (let i = 0; i < investorData.net_monthly_income.length; i++) {
            total.push(investorData.net_monthly_income[i] + investorData.gross_rental_income[i]);
        }

        setBarChartDataConsumption([
            {name: "Net Monthly Income", data: investorData.net_monthly_income},
            {name: "Gross Rental Income", data: investorData.gross_rental_income},
            // {name: "Total Income", data: total}
        ]);
    }, [investorData.net_monthly_income, investorData.gross_rental_income]);

    return (
        <Card align='center' direction='column' w='100%' {...rest}>
            <Flex align='center' w='100%' px='15px' py='10px'>
                <Text
                    me='auto'
                    color={textColor}
                    fontSize='xl'
                    fontWeight='700'
                    lineHeight='100%'>
                    Yearly Revenue
                </Text>
                <Button
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

            <Box h='240px' mt='auto'>
                <BarChart
                    chartData={barChartDataConsumption}
                    chartOptions={barChartOptionsConsumption}
                />
            </Box>
        </Card>
    );
}
