import {
    Flex,
    Stat,
    StatNumber,
    useColorModeValue,
    Box, FormLabel, Avatar, Select,
} from "@chakra-ui/react";
import Card from "./Card.js";
import React, {useState} from "react";
import Usa from "../../assets/img/dashboards/usa.png";
import Eur from "../../assets/img/dashboards/euro_flag.jpeg";
import Gba from "../../assets/img/dashboards/gb_flag.jpeg";
import Shekel from "../../assets/img/dashboards/israel_flag.jpeg";
import Jpy from "../../assets/img/dashboards/japan_flag.png";

export default function CurrencyCard({ handleCurrencyChange }) {
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = "secondaryGray.800";
    const [selectedCurrency, setSelectedCurrency] = useState('usd');
    const currencies = {
        usd: Usa,
        eur: Eur,
        gba: Gba,
        shekel: Shekel,
        jpy: Jpy,
    };

    const onCurrencyChange = (e) => {
        const newCurrency = e.target.value;
        setSelectedCurrency(newCurrency);
        handleCurrencyChange(newCurrency);
    };

    return (
        <Card ml={6} p='5px' pl='10px' maxW='150px'>
            <Flex
                my='auto'
                h='100%'
                align='center'
                justify='space-between'
                flexWrap="wrap"
            >
                <Box flex='1' minWidth="0" ms="0px">
                    <Stat my='auto'>
                        {/*<StatLabel*/}
                        {/*    lineHeight='100%'*/}
                        {/*    color={textColorSecondary}*/}
                        {/*    fontSize={{*/}
                        {/*        base: "sm",*/}
                        {/*    }}*/}
                        {/*    isTruncated*/}
                        {/*    maxWidth="100%"*/}
                        {/*>*/}
                        {/*    {name}*/}
                        {/*</StatLabel>*/}
                        <StatNumber
                            color={textColor}
                            fontSize={{base: "md", md: "xl", sm: "lg"}}
                            maxWidth="100%"
                            isTruncated
                        >
                            Currency
                        </StatNumber>
                    </Stat>
                </Box>
                <Flex me='-16px' mt='10px'>
                    <FormLabel>
                        <Avatar src={currencies[selectedCurrency]} size="sm" />
                    </FormLabel>
                    <Select variant='mini' me='0px' defaultValue='usd' onChange={onCurrencyChange}>
                        {Object.entries(currencies).map(([value, label]) => (
                            <option key={value} value={value}>
                                {value.toUpperCase()}
                            </option>
                        ))}
                    </Select>
                </Flex>
            </Flex>
        </Card>
    );
}
