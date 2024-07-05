import {Box, Flex, Link, Text, VStack, Stack} from '@chakra-ui/react';
import {NavLink} from "react-router-dom";

const Navbar = () => {
    return (
        <Box as="nav" bg="white" boxShadow="md" px={4}>
            <Flex h={16} alignItems="center" justifyContent="space-between">
                <VStack align="start" spacing={0.01}>
                    <Text fontSize="3xl" fontWeight="bold" color="black">
                        MortgageMaster
                    </Text>
                </VStack>
                <Flex display={{base: 'none', md: 'flex'}} ml={10}>
                    <Stack direction="row" spacing={8}>
                        <NavLink to=''>About</NavLink>
                        <NavLink to=''>Contact Us</NavLink>
                        <NavLink to='/sign-in'>Login</NavLink>
                    </Stack>
                </Flex>
            </Flex>
        </Box>
    );
};

export default Navbar;
