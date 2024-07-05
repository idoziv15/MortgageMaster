import {Text, useColorModeValue} from "@chakra-ui/react";
import Card from "../../../components/card/Card.js";
import React from "react";
import InvestorDetail from "./InvestorDetail";

export default function InvestorDetails(props) {
    const {demiInvestor, ...rest} = props
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = "gray.400";
    const cardShadow = useColorModeValue(
        "0px 18px 40px rgba(112, 144, 176, 0.12)",
        "unset"
    );
    return (
        <Card mb={{base: "0px", "2xl": "20px"}}>
            <Text
                color={textColorPrimary}
                fontWeight='bold'
                fontSize='2xl'
                mt='10px'
                mb='4px'>
                Investor Profile
            </Text>
            <Text color={textColorSecondary} fontSize='md' me='26px' mb='20px'>
                Here you can see and edit your investor profile
            </Text>
            <InvestorDetail investorDetails={demiInvestor}/>
            {/*<InvestorDetail*/}
            {/*  boxShadow={cardShadow}*/}
            {/*  mb='10px'*/}
            {/*  image={Project2}*/}
            {/*  ranking='2'*/}
            {/*  link='#'*/}
            {/*  title='Greatest way to a good Economy'*/}
            {/*/>*/}
            {/*<InvestorDetail*/}
            {/*  boxShadow={cardShadow}*/}
            {/*  image={Project3}*/}
            {/*  ranking='3'*/}
            {/*  link='#'*/}
            {/*  title='Most essential tips for Burnout'*/}
            {/*/>*/}
        </Card>
    );
}