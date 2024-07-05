import React, {useState} from 'react';
import {
    Box,
    Button,
    Flex,
    Icon,
    Text,
    useColorModeValue,
    FormControl,
    FormLabel,
    Input,
    Image,
    useToast, Divider, Grid, GridItem
} from "@chakra-ui/react";
import Card from "../../../components/card/Card.js";
import {MdEdit, MdSave, MdClose} from "react-icons/md";

export default function PropertyDetails({property}) {
    const [propertyState, setPropertyState] = useState(property);
    const [isEditing, setIsEditing] = useState(false);
    const toast = useToast();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setPropertyState({
            ...propertyState,
            [name]: value,
        });
    };

    const handleSave = async () => {
        setIsEditing(false);
        try {
            // Save the updated property details
            // Example: await fetch('/api/update-property', { method: 'POST', body: JSON.stringify(property) });
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
        }
    };

    const handleCancel = () => {
        // Reset propertyState to the original property data
        setPropertyState(property);
        // Exit edit mode
        setIsEditing(false);
    };

    return (
        <Card justifyContent='flex-end' align='center' direction='column' w='100%' mb='0px'>
            {/*<Flex justify='space-between' ps='0px' pe='20px' pt='5px' w='100%'>*/}
            {/*    {isEditing ? (*/}
            {/*        <Flex>*/}
            {/*            <Button*/}
            {/*                mr='2'*/}
            {/*                bg='transparent'*/}
            {/*                _hover={{bg: 'transparent'}}*/}
            {/*                _active={{bg: 'transparent'}}*/}
            {/*                _focus={{boxShadow: 'none'}}*/}
            {/*                onClick={handleSave}*/}
            {/*            >*/}
            {/*                <Icon as={MdSave} color='blue.500' w='24px' h='24px'/>*/}
            {/*            </Button>*/}
            {/*            <Button*/}
            {/*                bg='transparent'*/}
            {/*                _hover={{bg: 'transparent'}}*/}
            {/*                _active={{bg: 'transparent'}}*/}
            {/*                _focus={{boxShadow: 'none'}}*/}
            {/*                onClick={handleCancel}*/}
            {/*            >*/}
            {/*                <Icon as={MdClose} color='red.500' w='24px' h='24px'/>*/}
            {/*            </Button>*/}
            {/*        </Flex>*/}
            {/*    ) : (*/}
            {/*        <Button*/}
            {/*            align='center'*/}
            {/*            justifyContent='center'*/}
            {/*            bg='transparent'*/}
            {/*            _hover={{bg: 'transparent'}}*/}
            {/*            _focus={{bg: 'transparent'}}*/}
            {/*            _active={{bg: 'transparent'}}*/}
            {/*            w='37px'*/}
            {/*            h='37px'*/}
            {/*            lineHeight='100%'*/}
            {/*            borderRadius='10px'*/}
            {/*            onClick={() => setIsEditing(true)}*/}
            {/*        >*/}
            {/*            <Icon as={MdEdit} color='green.500' w='24px' h='24px'/>*/}
            {/*        </Button>*/}
            {/*    )}*/}
            {/*</Flex>*/}
            <Flex w='100%' flexDirection={{base: 'column', lg: 'row'}}>
                <Image
                    borderRadius="full"
                    boxSize="100px"
                    src={propertyState.imageUrl}
                    alt={'name'}
                    mr={4}
                />
                <Box textAlign="left">
                    <Text fontSize="xl" fontWeight="bold" color={"black"}>
                        {propertyState.name}
                    </Text>
                    <Text fontSize="md" color="gray.500">
                        {propertyState.title}
                    </Text>
                </Box>
                <Box textAlign="left">
                    <Text fontSize="xl" fontWeight="bold" color={"black"}>
                        {propertyState.name}
                    </Text>
                    <Text fontSize="md" color="gray.500">
                        {propertyState.title}
                    </Text>
                </Box>
                {/*<Box minW='200px' mr='20px' mb={{base: '20px', lg: '0px'}}>*/}
                {/*    <Image src={propertyState.imageUrl} alt={propertyState.name} borderRadius='10px' maxW='300px'/>*/}
                {/*</Box>*/}
                {/*<Flex flexDirection='column' flex='1'>*/}
                {/*    {isEditing ? (*/}
                {/*        <>*/}
                {/*            <FormControl mb='10px'>*/}
                {/*                <FormLabel>Name</FormLabel>*/}
                {/*                <Input name='name' value={propertyState.name} onChange={handleChange}/>*/}
                {/*            </FormControl>*/}
                {/*            <FormControl mb='10px'>*/}
                {/*                <FormLabel>Title</FormLabel>*/}
                {/*                <Input name='title' value={propertyState.title} onChange={handleChange}/>*/}
                {/*            </FormControl>*/}
                {/*            <FormControl mb='10px'>*/}
                {/*                <FormLabel>Price</FormLabel>*/}
                {/*                <Input name='formattedPrice' value={propertyState.formattedPrice}*/}
                {/*                       onChange={handleChange}/>*/}
                {/*            </FormControl>*/}
                {/*            <FormControl mb='10px'>*/}
                {/*                <FormLabel>Purchase Price</FormLabel>*/}
                {/*                <Input name='purchase_price' value={propertyState.purchase_price}*/}
                {/*                       onChange={handleChange}/>*/}
                {/*            </FormControl>*/}
                {/*            <FormControl mb='10px'>*/}
                {/*                <FormLabel>Monthly Rent Income</FormLabel>*/}
                {/*                <Input name='monthly_rent_income' value={propertyState.monthly_rent_income}*/}
                {/*                       onChange={handleChange}/>*/}
                {/*            </FormControl>*/}
                {/*            <FormControl mb='10px'>*/}
                {/*                <FormLabel>Square Meters</FormLabel>*/}
                {/*                <Input name='square_meters' value={propertyState.square_meters}*/}
                {/*                       onChange={handleChange}/>*/}
                {/*            </FormControl>*/}
                {/*            <FormControl mb='10px'>*/}
                {/*                <FormLabel>Parking Spots</FormLabel>*/}
                {/*                <Input name='parking_spots' value={propertyState.parking_spots}*/}
                {/*                       onChange={handleChange}/>*/}
                {/*            </FormControl>*/}
                {/*            <FormControl mb='10px'>*/}
                {/*                <FormLabel>Warehouse</FormLabel>*/}
                {/*                <Input name='warehouse' value={propertyState.warehouse} onChange={handleChange}/>*/}
                {/*            </FormControl>*/}
                {/*            <FormControl mb='10px'>*/}
                {/*                <FormLabel>Balcony Square Meter</FormLabel>*/}
                {/*                <Input name='balcony_square_meter' value={propertyState.balcony_square_meter}*/}
                {/*                       onChange={handleChange}/>*/}
                {/*            </FormControl>*/}
                {/*            <FormControl mb='10px'>*/}
                {/*                <FormLabel>After Repair Value</FormLabel>*/}
                {/*                <Input name='after_repair_value' value={propertyState.after_repair_value}*/}
                {/*                       onChange={handleChange}/>*/}
                {/*            </FormControl>*/}
                {/*            <FormControl mb='10px'>*/}
                {/*                <FormLabel>Annual Appreciation Percentage</FormLabel>*/}
                {/*                <Input name='annual_appreciation_percentage'*/}
                {/*                       value={propertyState.annual_appreciation_percentage}*/}
                {/*                       onChange={handleChange}/>*/}
                {/*            </FormControl>*/}
                {/*        </>*/}
                {/*    ) : (*/}
                {/*        <>*/}
                {/*            <Text fontSize='24px' fontWeight='700' lineHeight='100%'>*/}
                {/*                {propertyState.name}*/}
                {/*            </Text>*/}
                {/*            <Text fontSize='md' fontWeight='500' mt='4px' mb='10px'>*/}
                {/*                {propertyState.title}*/}
                {/*            </Text>*/}
                {/*            <Text fontSize='md' fontWeight='500' mt='4px' mb='10px'>*/}
                {/*                Price: {propertyState.formattedPrice}*/}
                {/*            </Text>*/}
                {/*            <Text fontSize='md' fontWeight='500' mt='4px' mb='10px'>*/}
                {/*                Purchase Price: {propertyState.purchase_price}*/}
                {/*            </Text>*/}
                {/*            <Text fontSize='md' fontWeight='500' mt='4px' mb='10px'>*/}
                {/*                Monthly Rent Income: {propertyState.monthly_rent_income}*/}
                {/*            </Text>*/}
                {/*            <Text fontSize='md' fontWeight='500' mt='4px' mb='10px'>*/}
                {/*                Square Meters: {propertyState.square_meters}*/}
                {/*            </Text>*/}
                {/*            <Text fontSize='md' fontWeight='500' mt='4px' mb='10px'>*/}
                {/*                Parking Spots: {propertyState.parking_spots}*/}
                {/*            </Text>*/}
                {/*            <Text fontSize='md' fontWeight='500' mt='4px' mb='10px'>*/}
                {/*                Warehouse: {propertyState.warehouse}*/}
                {/*            </Text>*/}
                {/*            <Text fontSize='md' fontWeight='500' mt='4px' mb='10px'>*/}
                {/*                Balcony Square Meter: {propertyState.balcony_square_meter}*/}
                {/*            </Text>*/}
                {/*            <Text fontSize='md' fontWeight='500' mt='4px' mb='10px'>*/}
                {/*                After Repair Value: {propertyState.after_repair_value}*/}
                {/*            </Text>*/}
                {/*            <Text fontSize='md' fontWeight='500' mt='4px' mb='10px'>*/}
                {/*                Annual Appreciation Percentage: {propertyState.annual_appreciation_percentage}*/}
                {/*            </Text>*/}
                {/*        </>*/}
                {/*    )}*/}
                {/*</Flex>*/}
            </Flex>
        </Card>
    );
}
