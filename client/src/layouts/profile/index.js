import React, {useState, useEffect} from "react";
import axios from "axios";
import {
    Box, Grid, useToast, Portal, Flex, useDisclosure, Spinner,
} from "@chakra-ui/react";
import Footer from "../../components/footer/Footer.js";
import Navbar from "../../components/navbar/NavbarAdmin.js";
import Sidebar from "../../components/sidebar/Sidebar.js";
import {SidebarContext} from "../../contexts/SidebarContext";
import routes from "../../routes.js";
import UserDetails from "../../views/profile/components/UserDetails";
import Notifications from "../../views/profile/components/Notifications";
import ChangePassword from "./components/ChangePassword";
import {useNavigate} from "react-router-dom";
import DeleteAccount from "./components/DeleteAccount";

export default function Profile() {
    const toast = useToast();
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [fixed] = useState(false);
    const {onOpen} = useDisclosure();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const getToken = () => {
        // Check if token is in sessionStorage
        let token = sessionStorage.getItem('token');

        // If token is not found in sessionStorage, check localStorage
        if (!token) {
            token = localStorage.getItem('token');
        }

        return token;
    };

    const fetchUserData = async () => {
        // Try to get the token from sessionStorage first, then from localStorage
        const token = getToken();
        if (token) {
            try {
                const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/user`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                return response.data;
            } catch (error) {
                console.error('Failed to fetch user data:', error);
                throw error;
            }
        } else {
            throw new Error('No token found');
        }
    };

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const data = await fetchUserData();
                setUserData(data);
            } catch (error) {
                toast({
                    title: 'Failed to load user data',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                navigate('/sign-in');
            }
        };
        loadUserData();
    }, []);

    const onUpdateDetail = (updatedField, newValue) => {
        setUserData((prevUserData) => ({
            ...prevUserData,
            [updatedField]: newValue
        }));
    }

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

    if (!userData) {
        return (
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl"/>
            </Flex>
        );
    }

    if (loading) {
        return (
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl"/>
            </Flex>
        );
    }

    return (
        <Box>
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
                                currUser={userData}
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
                            gap={{base: "20px", xl: "20px"}}
                        >
                            <UserDetails
                                first_name={userData.first_name}
                                last_name={userData.last_name}
                                email={userData.email}
                                userId={userData.id}
                                loading={loading}
                                setLoading={setLoading}
                                onUpdateDetail={onUpdateDetail}
                                gridArea={{base: "auto", lg: "auto", "2xl": "1 / 1 / 2 / 2"}}
                                minH='350px'
                                pe='20px'
                            />
                            <Notifications
                                used={25.6}
                                total={50}
                                gridArea={{base: "auto", lg: "auto", "2xl": "1 / 2 / 2 / 3"}}
                            />
                            <ChangePassword/>
                            <DeleteAccount/>
                        </Grid>
                    </Box>
                    <Box mt="auto">
                        <Footer/>
                    </Box>
                </Flex>
            </SidebarContext.Provider>
        </Box>);
}
