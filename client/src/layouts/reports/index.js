import {Portal, Box, useDisclosure, Image, Center, Flex, useToast} from '@chakra-ui/react';
import Footer from '../../components/footer/Footer.js';
import Navbar from '../../components/navbar/NavbarAdmin.js';
import Sidebar from '../../components/sidebar/Sidebar.js';
import ReportsList from './components/ReportsList';
import noDataPic from "../../assets/img/layout/no_data.svg";
import {SidebarContext} from '../../contexts/SidebarContext';
import React, {useState, useEffect} from 'react';
import {Route} from 'react-router-dom';
import routes from '../../routes.js';
import axios from 'axios';

export default function ReportsDashboard(props) {
    const {...rest} = props;
    const [fixed] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useToast();
    const {onOpen} = useDisclosure();

    const getUser = () => {
        return 11;
    };

    useEffect(() => {
        const userId = getUser();
        axios.get(`http://localhost:5000/reports/${userId}`)
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
    }, []);

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
