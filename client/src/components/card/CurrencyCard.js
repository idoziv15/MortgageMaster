import {
    Flex,
    useColorModeValue,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Image
} from "@chakra-ui/react";
import React, {useState} from "react";
import USA from "../../assets/img/dashboards/usa.png";
import EUR from "../../assets/img/dashboards/euro_flag.jpeg";
import GBP from "../../assets/img/dashboards/gb_flag.jpeg";
import ILS from "../../assets/img/dashboards/israel_flag.jpeg";
import JPY from "../../assets/img/dashboards/japan_flag.png";
import {ChevronDownIcon} from "@chakra-ui/icons";

export default function CurrencyCard({handleCurrencyChange}) {
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const [selectedCurrency, setSelectedCurrency] = useState('usd');
    const currencies = {
        usd: USA,
        eur: EUR,
        gbp: GBP,
        ils: ILS,
        jpy: JPY
    };

    const onCurrencyChange = (newCurrency) => {
        setSelectedCurrency(newCurrency);
        handleCurrencyChange(newCurrency);
    };

    return (
        <Flex
            my='auto'
            h='100%'
            align='center'
            justify='space-between'
            flexWrap="wrap"
            ml={6} p='5px' pl='10px' maxW='150px'
        >
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} color={textColor} variant='outline' bg="white">
                    Currency <Avatar src={currencies[selectedCurrency]} size="xs" ml={2}/>
                </MenuButton>
                <MenuList>
                    {Object.entries(currencies).map(([label, value]) => (
                        <MenuItem
                            key={label}
                            onClick={() => onCurrencyChange(label)}
                            _hover={{bg: "gray.200"}}
                            _active={{bg: "gray.300"}}
                        >
                            <Image
                                boxSize='2rem'
                                borderRadius='full'
                                src={value}
                                alt={label}
                                mr='12px'
                            />
                            <span>{label.toUpperCase()}</span>
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </Flex>
    );
}
