import React, {useState} from 'react';
import {Route, useParams} from 'react-router-dom';
import {
    Box,
    Image,
    Text,
    Badge,
    SimpleGrid,
    Input,
    Button,
    VStack,
    HStack,
    Container,
    Spinner,
    useToast, Portal, useDisclosure
} from '@chakra-ui/react';
import {StarIcon} from '@chakra-ui/icons';
import Navbar from '../../../components/navbar/NavbarAdmin';
import PropertyDashboard from "../../../views/properties";
import {SidebarContext} from "../../../contexts/SidebarContext";
import Sidebar from "../../../components/sidebar/Sidebar";
import routes from "../../../routes";
import PropertyList from "../../../components/propertyList/PropertyList";
import noDataPic from "../../../assets/img/layout/no_data.svg";
import AddAssetModal from "../../../components/modals/AddAssetModal";
import Footer from "../../../components/footer/Footer";

// Dummy data (you would replace this with actual data fetching logic)
const propertiesData = [
    {
        id: "1",
        name: "My house 1",
        imageUrl: "https://bit.ly/2Z4KKcF",
        imageAlt: "Rear view of modern home with pool",
        beds: 3,
        baths: 2,
        title: "Modern home in LA",
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
        annual_appreciation_percentage: 5,
    }
];
const insights = {
    "Price per meter": 27820,
    "Loan to cost": 60.0,
    "Loan to value": 60.0,
    "Renovation expenses": 0,
    "Additional transactions cost": 1340,
    "Purchase tax": 0,
    "Closing costs": 54940,
    "Broker Fee": 0,
    "Monthly operational expenses": 386,
    "Cash on cash": -0.02,
    "Net Yearly Cash Flow": -15252.0,
    "Net Monthly Cash Flow": -1271.0,
    "Yearly IRR": 7.43,
    "Annual rent income": 49200,
    "ROI": 0.71,
    "Monthly noi": 3714,
    "Annual noi": 44568,
    "Monthly rental taxes": 0,
    "annual rental taxes": 0,
    "cap_rate": 2.41,
    "gross yield": 2.66,
    "monthly insurances expenses": 58,
    "annual insurances expenses": 700,
    "monthly maintenance and repairs": 164,
    "annual_maintenance and repairs": 1968,
    "monthly vacancy cost": 164,
    "annual vacancy cost": 1968,
    "sale price": 2353717,
    "selling expenses": 0,
    "sale proceeds": 2353717,
    "total revenue": 2599717,
    // "calculate_annual_revenue_distribution": [0, 0, 49200, 49200, 49200, 49200, 49200, 2353717],
    "annual operating_expenses": 4632,
    "annual cash_flow": -15252.0,
    "mortgage remain balance in exit": 993557,
    "constructor index linked compensation": 23917,
    "total expenses": 2020275,
    "equity needed for purchase": 818857,
    "contractor payments": [424940, 0, 393917],
    // "calculate_annual_expenses_distribution": [424940, 0, 458357, 64440, 64440, 64440, 64440, 993557],
    "monthly property management fees": 0,
    "annual property management fees": 0,
    "net profit": 579442,
    "capital gain tax": 0,
    // "equity_distribution_schedule": [1108253.1, 1108253.1, 1108253, 1086889, 1064764, 1041853, 1018127, 993557]
}

export default function Property() {
    const {id} = useParams();
    const property = propertiesData.find((p) => p.id === id);
    const toast = useToast();
    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editedProperty, setEditedProperty] = useState({...property});
    const {onOpen} = useDisclosure();

    if (!property) {
        return <Text>Property not found</Text>;
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setEditedProperty({
            ...editedProperty,
            [name]: value,
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await fetch(`/api/properties/${property.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedProperty),
            });
            setIsEditing(false);
            toast({
                title: "Property updated.",
                description: "The property details have been successfully updated.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: "Failed to update property.",
                description: "There was an error updating the property details.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box>
            <Box>
                <SidebarContext.Provider
                    value={{
                        toggleSidebar,
                        setToggleSidebar
                    }}>
                    <Sidebar routes={routes} display='none'/>
                    <Box
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
                        pt='110px'>
                        <Portal>
                            <Box>
                                <Navbar
                                    onOpen={onOpen}
                                    brandText={'My property 1'}
                                    secondary={true}
                                />
                            </Box>
                        </Portal>
                        <PropertyDashboard property={propertiesData[0]} insights={insights}/>
                        <Box>
                            <Footer/>
                        </Box>
                    </Box>
                </SidebarContext.Provider>
            </Box>
        </Box>
    );
}