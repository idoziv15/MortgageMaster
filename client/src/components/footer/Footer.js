import React from "react";
import {Flex, Link, List, ListItem, Text, useColorModeValue} from "@chakra-ui/react";

export default function Footer() {
    const textColor = useColorModeValue("gray.400", "white");
    return (
        <Flex
            zIndex='3'
            flexDirection={{
                base: "column",
                xl: "row",
            }}
            alignItems={{
                base: "center",
                xl: "start",
            }}
            justifyContent='space-between'
            px={{base: "30px", md: "50px"}}
            pb='30px'>
            <Text
                color={textColor}
                textAlign={{
                    base: "center",
                    xl: "start",
                }}
                mb={{base: "20px", xl: "0px"}}>
                {" "}
                &copy; {1900 + new Date().getYear()}
                <Text as='span' fontWeight='500' ms='4px'>
                    Master Mortgage. All Rights Reserved. Made by Ido Ziv.
                </Text>
            </Text>
            <List display='flex'>
                <ListItem
                    me={{
                        base: "20px",
                        md: "44px",
                    }}>
                    <Link
                        fontWeight='500'
                        color={textColor}
                        href=''>
                        Support
                    </Link>
                </ListItem>
                <ListItem
                    me={{
                        base: "20px",
                        md: "44px",
                    }}>
                    <Link
                        fontWeight='500'
                        color={textColor}
                        href=''>
                        Terms of Use
                    </Link>
                </ListItem>
                <ListItem>
                    <Link
                        fontWeight='500'
                        color={textColor}
                        href=''>
                        Blog
                    </Link>
                </ListItem>
            </List>
        </Flex>
    );
}
