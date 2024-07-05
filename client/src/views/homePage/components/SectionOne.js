import React from 'react';
import {Box, Flex, Text, Button, Image, Heading} from '@chakra-ui/react';
import HomeImg from '../../../assets/img/HomePage/HomeImg.jpeg';
import {NavLink} from "react-router-dom";

export default function SectionOne () {
    return (
        <Box bg="green.100">
            <Flex
                m="auto"
                maxW="screen-2xl"
                alignItems="center"
                justifyContent="space-between"
                pl={{base: 6, md: 14}}
                flexDirection={{base: 'column', md: 'row'}}
            >
                <Box p={8} textAlign="center" flex="1">
                    <Box mb={8}>
                        <Heading as="h1" size="2xl" mb={4}>
                            SAVE&nbsp;MORE<br/>
                            <Text as="span" color="teal.500">
                                SAVE&nbsp;FASTER
                            </Text>
                        </Heading>
                        <Text fontSize="lg" color="gray.600">
                            Time to take mortgages investments into your hands! Now more than ever, your ability to
                            control your mortgage is within reach.
                        </Text>
                    </Box>
                    <NavLink to='/register'>
                        <Button
                            colorScheme="teal"
                            size="lg"
                        >
                            Join Us Now
                        </Button>
                    </NavLink>
                </Box>
                <Box flex="1" height="100%">
                    <Image
                        alt="Master Mortgage Logo"
                        src={HomeImg}
                        width="100%"
                        height="100%"
                        objectFit="cover"
                        display={{base: 'none', md: 'block'}}
                    />
                </Box>
            </Flex>
        </Box>
    );
};
