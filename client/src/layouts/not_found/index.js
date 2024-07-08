import React from 'react';
import {Box, Heading, Text, Button} from '@chakra-ui/react';
import {Link} from 'react-router-dom';

const NotFound = () => {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            textAlign="center"
            backgroundColor="gray.100"
        >
            <Heading fontSize="10rem" color="red.400">
                404
            </Heading>
            <Text fontSize="1.5rem" my={4} color="gray.600">
                Oops! The page you're looking for doesn't exist.
            </Text>
            <Button
                as={Link}
                to="/"
                colorScheme="red"
                size="lg"
                mt={4}
            >
                Go back home
            </Button>
        </Box>
    );
};

export default NotFound;
