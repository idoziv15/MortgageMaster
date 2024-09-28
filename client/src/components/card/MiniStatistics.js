import {
    Flex,
    Stat,
    StatLabel,
    StatNumber,
    useColorModeValue,
    Text,
    Box,
} from "@chakra-ui/react";
import Card from "./Card.js";
import React from "react";

export default function Default(props) {
    const { startContent, endContent, name, growth, value } = props;
    const textColor = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = "secondaryGray.600";

    return (
        <Card p='5px' pl='10px'>
            <Flex
                my='auto'
                h='100%'
                align='center'
                justify='space-between'
                flexWrap="wrap"
            >
                {startContent && (
                    <Flex align='center' minWidth="max-content">
                        {startContent}
                    </Flex>
                )}

                <Box flex='1' minWidth="0" ms={startContent ? "18px" : "0px"}>
                    <Stat my='auto'>
                        <StatLabel
                            lineHeight='100%'
                            color={textColorSecondary}
                            fontSize={{
                                base: "sm",
                            }}
                            isTruncated
                            maxWidth="100%"
                        >
                            {name}
                        </StatLabel>

                        <StatNumber
                            color={textColor}
                            fontSize={{
                                base: "2xl",
                                md: "xl",
                                sm: "lg",
                            }}
                            maxWidth="100%"
                            isTruncated
                        >
                            {value}
                        </StatNumber>

                        {growth && (
                            <Flex align='center'>
                                <Text
                                    color='green.500'
                                    fontSize='xs'
                                    fontWeight='700'
                                    me='5px'
                                >
                                    {growth}
                                </Text>
                                <Text
                                    color='secondaryGray.600'
                                    fontSize='xs'
                                    fontWeight='400'
                                    isTruncated
                                >
                                    since last month
                                </Text>
                            </Flex>
                        )}
                    </Stat>
                </Box>

                {endContent && (
                    <Flex ms='auto' w='max-content'>
                        {endContent}
                    </Flex>
                )}
            </Flex>
        </Card>
    );
}
