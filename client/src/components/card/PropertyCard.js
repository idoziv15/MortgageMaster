import React from "react";
import {Box, Badge, Image, Link, Text} from '@chakra-ui/react';
import {StarIcon} from '@chakra-ui/icons';
import {Link as RouterLink} from 'react-router-dom';

export default function PropertyCard({property}) {
    return (
        <Link as={RouterLink} to={`/property/${property.id}`}>
            <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
                <Image src={property.imageUrl} alt={property.imageAlt}/>
                <Box p="6">
                    <Box d="flex" alignItems="baseline">
                        <Badge borderRadius="full" px="2" colorScheme="brand">
                            New
                        </Badge>
                        <Box
                            color="gray.500"
                            fontWeight="semibold"
                            letterSpacing="wide"
                            fontSize="xs"
                            textTransform="uppercase"
                            ml="2"
                        >
                            {property.square_meters} sqm &bull; {property.parking_spots} parking spots
                        </Box>
                    </Box>
                    <Box
                        mt="1"
                        fontWeight="semibold"
                        as="h4"
                        lineHeight="tight"
                        isTruncated
                    >
                        {property.title}
                    </Box>
                    <Box>
                        <Text fontSize="md" color="gray.700">
                            Purchase Price: ${property.purchase_price}
                        </Text>
                        <Text fontSize="md" color="gray.700">
                            Monthly Rent: ${property.monthly_rent_income}
                        </Text>
                        <Text fontSize="md" color="gray.700">
                            Balcony: {property.balcony_square_meter} sqm
                        </Text>
                        <Text fontSize="md" color="gray.700">
                            After Repair Value: ${property.after_repair_value}
                        </Text>
                        <Text fontSize="md" color="gray.700">
                            Appreciation: {property.annual_appreciation_percentage}%
                        </Text>
                        <Text fontSize="md" color="gray.700">
                            Warehouse: {property.warehouse ? "Yes" : "No"}
                        </Text>
                    </Box>
                    <Box d="flex" mt="2" alignItems="center">
                        {Array(5)
                            .fill("")
                            .map((_, i) => (
                                <StarIcon
                                    key={i}
                                    color={i < property.rating ? "brand.500" : "gray.300"}
                                />
                            ))}
                        <Box as="span" ml="2" color="gray.600" fontSize="sm">
                            {property.reviewCount} reviews
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Link>
    );
}
