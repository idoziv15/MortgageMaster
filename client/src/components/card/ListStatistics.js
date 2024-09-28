import {
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    IconButton,
} from "@chakra-ui/react";
import {ChevronDownIcon} from "@chakra-ui/icons";
import Card from "./Card.js";
import React from "react";

export default function ListStatistics(props) {
    const {startContent, name, values} = props;

    const textColor = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = "secondaryGray.600";

    return (
        <Card p='5px' pl='10px'>
            <Flex
                my='auto'
                h='100%'
                align='center'
                justify={{base: "center", xl: "center"}}>
                <Flex align='center'>
                    {startContent}
                </Flex>

                <Stat my='auto' ms={startContent ? "18px" : "0px"}>
                    <StatLabel
                        lineHeight='100%'
                        color={textColorSecondary}
                        fontSize={{
                            base: "sm",
                        }}>
                        {name}
                    </StatLabel>

                    <Flex align='center'>
                        <StatNumber
                            color={textColor}
                            fontSize={{
                                base: "xl",
                                md: "lg",
                            }}>
                            {values[0]}
                        </StatNumber>

                        {values.length > 1 && (
                            <Menu>
                                <MenuButton
                                    as={IconButton}
                                    aria-label="More values"
                                    icon={<ChevronDownIcon/>}
                                    size="sm"
                                    variant="ghost"
                                    ml={2}
                                />
                                <MenuList>
                                    {values.slice(1).map((value, index) => (
                                        <MenuItem key={index}>
                                            <StatNumber
                                                color={textColor}
                                                fontSize={{
                                                    base: "md",
                                                    md: "sm",
                                                }}>
                                                {value}
                                            </StatNumber>
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Menu>
                        )}
                    </Flex>
                </Stat>
            </Flex>
        </Card>
    );
}
