import React from 'react';
import { Box } from '@chakra-ui/react';

const FadingLine = () => {
    return (
        <Box display={{ base: "none", lg: "block" }} position="relative" minW="70px">
            <Box
                position="absolute"
                top="0"
                bottom="0"
                left="0"
                right="0"
                margin="auto"
                w="1px"
                bgGradient="linear(to-b, transparent, #353B39, transparent)"
                content="''"
            />
        </Box>
    );
};

export default FadingLine;
