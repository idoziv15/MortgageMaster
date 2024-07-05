import {Portal, Box, useDisclosure, Image, Center, Flex} from '@chakra-ui/react';
import Footer from '../../components/footer/Footer.js';
import Navbar from '../../components/navbar/NavbarAdmin.js';
import Sidebar from '../../components/sidebar/Sidebar.js';
import PropertyList from '../../components/propertyList/PropertyList.js';
import ReportsList from './components/ReportsList';
import noDataPic from "../../assets/img/layout/no_data.svg";
import {SidebarContext} from '../../contexts/SidebarContext';
import React, {useState} from 'react';
import {Route} from 'react-router-dom';
import routes from '../../routes.js';
import AddAssetModal from "../../components/modals/AddAssetModal";
import AddInvestorProfileModal from "../../components/modals/AddInvestorProfileModal";

export default function ReportsDashboard(props) {
    const {...rest} = props;
    const [fixed] = useState(false);
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const reportsData = [
        {
            id: "1",
            imageUrl: "https://bit.ly/2Z4KKcF",
            imageAlt: "Rear view of modern home with pool",
            name: 3,
            lastUpdated: 2,
            description: "Modern home in city center in the heart of historic Los Angeles",
            formattedPrice: "$1,900.00",
            reviewCount: 34,
            rating: 4,
            purchase_price: 1000000,
            monthly_rent_income: 5000,
            square_meters: 200,
            parking_spots: 2,
            warehouse: 1,
            balcony_square_meter: 10,
            after_repair_value: 1000200,
            annual_appreciation_percentage: 5
        },
        {
            id: "2",
            imageUrl: "https://bit.ly/2Z4KKcF",
            imageAlt: "Rear view of modern home with pool",
            name: 3,
            lastUpdated: 2,
            description: "Modern home in city center in the heart of historic Los Angeles",
            formattedPrice: "$1,900.00",
            reviewCount: 34,
            rating: 4,
        },
        {
            id: "3",
            imageUrl: "https://bit.ly/2Z4KKcF",
            imageAlt: "Rear view of modern home with pool",
            name: 3,
            lastUpdated: 2,
            description: "Modern home in city center in the heart of historic Los Angeles",
            formattedPrice: "$1,900.00",
            reviewCount: 34,
            rating: 4,
        },
        {
            id: "4",
            imageUrl: "https://bit.ly/2Z4KKcF",
            imageAlt: "Rear view of modern home with pool",
            name: 3,
            lastUpdated: 2,
            description: "Modern home in city center in the heart of historic Los Angeles",
            formattedPrice: "$1,900.00",
            reviewCount: 34,
            rating: 4,
        },
        {
            id: "5",
            imageUrl: "https://bit.ly/2Z4KKcF",
            imageAlt: "Rear view of modern home with pool",
            name: 3,
            lastUpdated: 2,
            description: "Modern home in city center in the heart of historic Los Angeles",
            formattedPrice: "$1,900.00",
            reviewCount: 34,
            rating: 4,
        },
        {
            id: "6",
            imageUrl: "https://bit.ly/2Z4KKcF",
            imageAlt: "Rear view of modern home with pool",
            name: 3,
            lastUpdated: 2,
            description: "Modern home in city center in the heart of historic Los Angeles",
            formattedPrice: "$1,900.00",
            reviewCount: 34,
            rating: 4,
        },
        {
            id: "7",
            imageUrl: "https://bit.ly/2Z4KKcF",
            imageAlt: "Rear view of modern home with pool",
            name: 3,
            lastUpdated: 2,
            description: "Modern home in city center in the heart of historic Los Angeles",
            formattedPrice: "$1,900.00",
            reviewCount: 34,
            rating: 4,
        },
        {
            id: "8",
            imageUrl: "https://bit.ly/2Z4KKcF",
            imageAlt: "Rear view of modern home with pool",
            name: 3,
            lastUpdated: 2,
            description: "Modern home in city center in the heart of historic Los Angeles",
            formattedPrice: "$1,900.00",
            reviewCount: 34,
            rating: 4,
        }
    ]
    const reports = [
        {
            id: 1,
            name: "Real Estate Overview",
            description: "Comprehensive analysis of the current real estate market.",
            lastUpdated: "2024-06-30T12:00:00Z",
            insights: {
                lastUpdated: 2,
                description: "Modern home in city center in the heart of historic Los Angeles",
                formattedPrice: "$1,900.00",
                reviewCount: 34,
                rating: 4,
                purchase_price: 1000000,
                monthly_rent_income: 5000,
                square_meters: 200,
                parking_spots: 2,
                warehouse: 1,
                balcony_square_meter: 10,
                after_repair_value: 1000200,
                annual_appreciation_percentage: 5
            }
        },
        {
            id: 2,
            name: "Quarterly Investment Report",
            description: "Detailed investment report for the last quarter.",
            lastUpdated: "2024-06-29T15:30:00Z",
            insights: {
                lastUpdated: 2,
                description: "Modern home in city center in the heart of historic Los Angeles",
                formattedPrice: "$1,900.00",
                reviewCount: 34,
                rating: 4,
                purchase_price: 1000000,
                monthly_rent_income: 5000,
                square_meters: 200,
                parking_spots: 2,
                warehouse: 1,
                balcony_square_meter: 10,
                after_repair_value: 1000200,
                annual_appreciation_percentage: 5
            }
        },
        {
            id: 3,
            name: "Monthly Expense Summary",
            description: "Summary of all expenses for the month.",
            lastUpdated: "2024-06-28T09:00:00Z",
            insights: {
                lastUpdated: 2,
                description: "Modern home in city center in the heart of historic Los Angeles",
                formattedPrice: "$1,900.00",
                reviewCount: 34,
                rating: 4,
                purchase_price: 1000000,
                monthly_rent_income: 5000,
                square_meters: 200,
                parking_spots: 2,
                warehouse: 1,
                balcony_square_meter: 10,
                after_repair_value: 1000200,
                annual_appreciation_percentage: 5
            }
        },
        {
            id: 4,
            name: "Annual Financial Review",
            description: "Review of the annual financial performance.",
            lastUpdated: "2024-06-27T14:45:00Z",
            insights: {
                lastUpdated: 2,
                description: "Modern home in city center in the heart of historic Los Angeles",
                formattedPrice: "$1,900.00",
                reviewCount: 34,
                rating: 4,
                purchase_price: 1000000,
                monthly_rent_income: 5000,
                square_meters: 200,
                parking_spots: 2,
                warehouse: 1,
                balcony_square_meter: 10,
                after_repair_value: 1000200,
                annual_appreciation_percentage: 5
            }
        },
        {
            id: 5,
            name: "Portfolio Performance",
            description: "Performance analysis of the investment portfolio.",
            lastUpdated: "2024-06-30T08:15:00Z",
            insights: {
                lastUpdated: 2,
                description: "Modern home in city center in the heart of historic Los Angeles",
                formattedPrice: "$1,900.00",
                reviewCount: 34,
                rating: 4,
                purchase_price: 1000000,
                monthly_rent_income: 5000,
                square_meters: 200,
                parking_spots: 2,
                warehouse: 1,
                balcony_square_meter: 10,
                after_repair_value: 1000200,
                annual_appreciation_percentage: 5
            }
        },
        {
            id: 6,
            name: "Market Trends",
            description: "Latest trends and forecasts in the market.",
            lastUpdated: "2024-06-30T10:30:00Z",
            insights: {
                lastUpdated: 2,
                description: "Modern home in city center in the heart of historic Los Angeles",
                formattedPrice: "$1,900.00",
                reviewCount: 34,
                rating: 4,
                purchase_price: 1000000,
                monthly_rent_income: 5000,
                square_meters: 200,
                parking_spots: 2,
                warehouse: 1,
                balcony_square_meter: 10,
                after_repair_value: 1000200,
                annual_appreciation_percentage: 5
            }
        },
        {
            id: 7,
            name: "Property Management Insights",
            description: "Insights into property management practices.",
            lastUpdated: "2024-06-29T18:00:00Z",
            insights: {
                lastUpdated: 2,
                description: "Modern home in city center in the heart of historic Los Angeles",
                formattedPrice: "$1,900.00",
                reviewCount: 34,
                rating: 4,
                purchase_price: 1000000,
                monthly_rent_income: 5000,
                square_meters: 200,
                parking_spots: 2,
                warehouse: 1,
                balcony_square_meter: 10,
                after_repair_value: 1000200,
                annual_appreciation_percentage: 5
            }
        },
        {
            id: 8,
            name: "Economic Indicators",
            description: "Analysis of key economic indicators affecting investments.",
            lastUpdated: "2024-06-28T13:00:00Z",
            insights: {
                lastUpdated: 2,
                description: "Modern home in city center in the heart of historic Los Angeles",
                formattedPrice: "$1,900.00",
                reviewCount: 34,
                rating: 4,
                purchase_price: 1000000,
                monthly_rent_income: 5000,
                square_meters: 200,
                parking_spots: 2,
                warehouse: 1,
                balcony_square_meter: 10,
                after_repair_value: 1000200,
                annual_appreciation_percentage: 5
            }
        },
        {
            id: 9,
            name: "Risk Assessment Report",
            description: "Evaluation of potential risks in the investment portfolio.",
            lastUpdated: "2024-06-27T11:30:00Z",
            insights: {
                lastUpdated: 2,
                description: "Modern home in city center in the heart of historic Los Angeles",
                formattedPrice: "$1,900.00",
                reviewCount: 34,
                rating: 4,
                purchase_price: 1000000,
                monthly_rent_income: 5000,
                square_meters: 200,
                parking_spots: 2,
                warehouse: 1,
                balcony_square_meter: 10,
                after_repair_value: 1000200,
                annual_appreciation_percentage: 5
            }
        },
        {
            id: 10,
            name: "Investor Sentiment Analysis",
            description: "Analysis of current investor sentiment.",
            lastUpdated: "2024-06-29T20:45:00Z",
            insights: {
                lastUpdated: 2,
                description: "Modern home in city center in the heart of historic Los Angeles",
                formattedPrice: "$1,900.00",
                reviewCount: 34,
                rating: 4,
                purchase_price: 1000000,
                monthly_rent_income: 5000,
                square_meters: 200,
                parking_spots: 2,
                warehouse: 1,
                balcony_square_meter: 10,
                after_repair_value: 1000200,
                annual_appreciation_percentage: 5
            }
        }
    ];

    const getActiveRoute = (routes) => {
        console.log('getActiveRoute')
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
        console.log(activeRoute)
        return activeRoute;
    };

    const getActiveNavbar = (routes) => {
        console.log('getActiveNavbar')
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
        console.log('activeNavbar', activeNavbar)
        return activeNavbar;
    };

    const getActiveNavbarText = (routes) => {
        console.log('getActiveNavbarText')
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
        console.log('activeNavbar', activeNavbar)
        return activeNavbar;
    };

    const getRoutes = (routes) => {
        console.log('getRoutes')
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

    const {onOpen} = useDisclosure();

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
                        {reportsData && reportsData.length > 0 ? (
                            <ReportsList reports={reports} />
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
