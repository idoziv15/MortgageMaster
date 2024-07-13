import {Portal, Box, useDisclosure, Image, Center, Flex, useToast, Spinner} from '@chakra-ui/react';
import Footer from '../../components/footer/Footer.js';
import Navbar from '../../components/navbar/NavbarAdmin.js';
import Sidebar from '../../components/sidebar/Sidebar.js';
import ReportsList from './components/ReportsList';
import noDataPic from "../../assets/img/layout/no_data.svg";
import {SidebarContext} from '../../contexts/SidebarContext';
import React, {useState, useEffect} from 'react';
import {Route, useNavigate} from 'react-router-dom';
import routes from '../../routes.js';
import axios from 'axios';

export default function ReportsDashboard(props) {
    const {...rest} = props;
    const [fixed] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState(null);
    const toast = useToast();
    const {onOpen} = useDisclosure();
    const navigate = useNavigate();

    const fetchUserData = async () => {
        // Try to get the token from sessionStorage first, then from localStorage
        const token = getToken();
        if (token) {
            try {
                const response = await axios.get('http://localhost:5000/user', {
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

    const getToken = () => {
        // Check if token is in sessionStorage
        let token = sessionStorage.getItem('token');

        // If token is not found in sessionStorage, check localStorage
        if (!token) {
            token = localStorage.getItem('token');
        }

        return token;
    };

    useEffect(() => {
        if (userData) {
            const token = getToken();
            axios.get(`http://localhost:5000/reports`, {
                headers: {Authorization: `Bearer ${token}`},
            })
                .then(response => {
                    setReports(response.data.reports);
                    setLoading(false);
                })
                .catch(error => {
                    console.error('There was an error fetching the reports!', error);
                    setLoading(false);
                    toast({
                        title: 'Error fetching reports.',
                        description: 'No reports found.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                    });
                });
        }

    }, [userData]);

    const getActiveRoute = (routes) => {
        let activeRoute = 'My reports';
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

    const getRoutes = (routes) => {
        return routes.map((prop, key) => {
            if (prop.layout === '/reports') {
                return <Route path={prop.path} component={prop.component} key={key}/>;
            }
            if (prop.collapse) {
                return getRoutes(prop.items);
            }
            if (prop.category) {
                return getRoutes(prop.items);
            } else {
                return null;
            }
        });
    };

    if (!userData) {
        return (
            <Flex justifyContent="center" alignItems="center" height="100vh">
                <Spinner size="xl" />
            </Flex>
        );
    }

    return (
        <Box>
            <SidebarContext.Provider
                value={{
                    toggleSidebar,
                    setToggleSidebar
                }}>
                <Sidebar routes={routes} display='none' {...rest} />
                <Flex
                    direction='column'
                    float='right'
                    minHeight='100vh'
                    height='100%'
                    overflow='auto'
                    position='relative'
                    maxHeight='100%'
                    w={{base: '100%', xl: 'calc( 100% - 290px )'}}
                    maxWidth={{base: '100%', xl: 'calc( 100% - 290px )'}}
                    transition='all 0.33s cubic-bezier(0.685, 0.0473, 0.346, 1)'
                    transitionDuration='.2s, .2s, .35s'
                    transitionProperty='top, bottom, width'
                    transitionTimingFunction='linear, linear, ease'
                    pt='110px'
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
                                {...rest}
                            />
                        </Box>
                    </Portal>
                    <Flex direction="column" flex="1">
                        {loading ? (
                            <Center flex="1">Loading...</Center>
                        ) : reports.length > 0 ? (
                            <ReportsList reports={reports}/>
                        ) : (
                            <Center flex="1">
                                <Image src={noDataPic} boxSize="250px"/>
                            </Center>
                        )}
                    </Flex>
                    <Box mt="auto">
                        <Footer/>
                    </Box>
                </Flex>
            </SidebarContext.Provider>
        </Box>
    );
}
