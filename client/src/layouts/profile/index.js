import React, {useState, useEffect} from "react";
import axios from "axios";
import {
    Box, Grid, useToast, Portal, Flex, useDisclosure,
} from "@chakra-ui/react";
import Footer from "../../components/footer/Footer.js";
import Navbar from "../../components/navbar/NavbarAdmin.js";
import Sidebar from "../../components/sidebar/Sidebar.js";
import {SidebarContext} from "../../contexts/SidebarContext";
import routes from "../../routes.js";
import InvestorDetails from "../../views/profile/components/InvestorDetails";
import UserDetails from "../../views/profile/components/UserDetails";
import General from "../../views/profile/components/General";
import Projects from "../../views/profile/components/Projects";
import banner from "../../assets/img/auth/banner.png";
import avatar from "../../assets/img/avatars/avatar4.png";
import Notifications from "../../views/profile/components/Notifications";

export default function Profile() {
    const toast = useToast();
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [fixed] = useState(false);
    const {onOpen} = useDisclosure();
    const [demiUser, setDemiUser] = useState({
        first_name: 'BOB', last_name: 'Habanay', email: 'bob@b.com'
    });
    const [demiInvestor, setDemiInvestor] = useState({
        net_monthly_income: '30000',
        total_debt_payment: '10000',
        real_estate_investment_type: 'Apartment',
        total_available_equity: '40000',
        gross_rental_income: '5000'
    });

    const getActiveRoute = (routes) => {
        let activeRoute = "Profile";
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveRoute = getActiveRoute(routes[i].items);
                if (collapseActiveRoute !== activeRoute) {
                    return collapseActiveRoute;
                }
            } else if (routes[i].category) {
                let categoryActiveRoute = getActiveRoute(routes[i].items);
                if (categoryActiveRoute !== activeRoute) {
                    return categoryActiveRoute;
                }
            } else {
                if (window.location.href.indexOf(routes[i].path) !== -1) {
                    return routes[i].name;
                }
            }
        }
        return activeRoute;
    };

    const getActiveNavbar = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveNavbar = getActiveNavbar(routes[i].items);
                if (collapseActiveNavbar !== activeNavbar) {
                    return collapseActiveNavbar;
                }
            } else if (routes[i].category) {
                let categoryActiveNavbar = getActiveNavbar(routes[i].items);
                if (categoryActiveNavbar !== activeNavbar) {
                    return categoryActiveNavbar;
                }
            } else {
                if (window.location.href.indexOf(routes[i].path) !== -1) {
                    return routes[i].secondary;
                }
            }
        }
        return activeNavbar;
    };

    const getActiveNavbarText = (routes) => {
        let activeNavbar = false;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].collapse) {
                let collapseActiveNavbar = getActiveNavbarText(routes[i].items);
                if (collapseActiveNavbar !== activeNavbar) {
                    return collapseActiveNavbar;
                }
            } else if (routes[i].category) {
                let categoryActiveNavbar = getActiveNavbarText(routes[i].items);
                if (categoryActiveNavbar !== activeNavbar) {
                    return categoryActiveNavbar;
                }
            } else {
                if (window.location.href.indexOf(routes[i].path) !== -1) {
                    return routes[i].messageNavbar;
                }
            }
        }
        return activeNavbar;
    };

    return (<Box>
        <SidebarContext.Provider value={{toggleSidebar, setToggleSidebar}}>
            <Sidebar routes={routes} display="none"/>
            <Flex
                direction="column"
                float="right"
                minHeight="100vh"
                height="100%"
                overflow="auto"
                position="relative"
                maxHeight="100%"
                w={{base: "100%", xl: "calc( 100% - 290px )"}}
                maxWidth={{base: "100%", xl: "calc( 100% - 290px )"}}
                transition="all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)"
                transitionDuration=".2s, .2s, .35s"
                transitionProperty="top, bottom, width"
                transitionTimingFunction="linear, linear, ease"
                pt="110px"
            >
                <Portal>
                    <Box>
                        <Navbar
                            onOpen={onOpen}
                            brandText={getActiveRoute(routes)}
                            secondary={getActiveNavbar(routes)}
                            message={getActiveNavbarText(routes)}
                            fixed={fixed}
                        />
                    </Box>
                </Portal>
                <Box w='95%' mx='auto'>
                    <Grid
                        mb='20px'
                        templateColumns={{
                            base: "1fr",
                            lg: "repeat(2, 1fr)",
                            "2xl": "1.34fr 1.62fr 1fr",
                        }}
                        // templateRows={{
                        //     base: "1fr",
                        //     lg: "repeat(2, 1fr)",
                        //     "2xl": "1fr",
                        // }}
                        gap={{base: "20px", xl: "20px"}}
                    >
                        <InvestorDetails
                            gridArea='1 / 2 / 2 / 2'
                            banner={banner}
                            avatar={avatar}
                            name='Adela Parkson'
                            job='Product Designer'
                            posts='17'
                            followers='9.7k'
                            following='274'
                            demiInvestor={demiInvestor}
                        />
                        <UserDetails
                            first_name={demiUser.first_name}
                            last_name={demiUser.last_name}
                            email={demiUser.email}
                            gridArea={{base: "2 / 1 / 3 / 2", lg: "1 / 2 / 2 / 3"}}
                            minH='365px'
                            pe='20px'
                        />
                        <Notifications
                            used={25.6}
                            total={50}
                            gridArea={{
                                base: "3 / 1 / 4 / 2",
                                lg: "2 / 1 / 3 / 3",
                                "2xl": "1 / 3 / 2 / 4",
                            }}
                        />
                    </Grid>
                </Box>
                <Box mt="auto">
                    <Footer/>
                </Box>
            </Flex>
        </SidebarContext.Provider>
    </Box>);
}
