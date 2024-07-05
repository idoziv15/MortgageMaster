import { Box, Flex, Text, Link, IconButton, Stack } from '@chakra-ui/react';
import { FaInstagram, FaLinkedin, FaFacebook, FaTwitter } from 'react-icons/fa';
import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <Box bg="lightgray.800" color="black" py={4} px={8}>
      <Flex justify="space-between" align="center">
        <Text>
          © 2024 Master Mortgage. All Rights Reserved. Made with ❤️ by Ido Ziv.
        </Text>
        <Stack direction="row" spacing={4}>
          <NavLink to='/support'>Support</NavLink>
          <NavLink to='/terms-of-use'>Terms of Use</NavLink>
          <IconButton
            as={Link}
            href="https://www.instagram.com"
            aria-label="Instagram"
            icon={<FaInstagram />}
            bg="transparent"
            _hover={{ bg: 'gray.300' }}
          />
          <IconButton
            as={Link}
            href="https://www.linkedin.com"
            aria-label="LinkedIn"
            icon={<FaLinkedin />}
            bg="transparent"
            _hover={{ bg: 'gray.300' }}
          />
          <IconButton
            as={Link}
            href="https://www.facebook.com"
            aria-label="Facebook"
            icon={<FaFacebook />}
            bg="transparent"
            _hover={{ bg: 'gray.300' }}
          />
          <IconButton
            as={Link}
            href="https://www.twitter.com"
            aria-label="Twitter"
            icon={<FaTwitter />}
            bg="transparent"
            _hover={{ bg: 'gray.300' }}
          />
        </Stack>
      </Flex>
    </Box>
  );
};

export default Footer;