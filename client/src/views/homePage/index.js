import {Box} from '@chakra-ui/react';
import React from 'react';
import SectionOne from "./components/SectionOne";
import SectionTwo from "./components/SectionTwo";
import HomeNavbar from "./components/HomeNavbar";
import HomeFooter from "./components/HomeFooter";

export default function HomePage() {

    return (
        <Box>
            <HomeNavbar />
            <SectionOne />
            <SectionTwo />
            <HomeFooter />
        </Box>
    );
}
