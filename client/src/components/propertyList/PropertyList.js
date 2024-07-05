import React from "react";
import {Grid, GridItem, Link} from '@chakra-ui/react';
import PropertyCard from '../../components/card/PropertyCard.js';

export default function PropertyList({properties}) {
    return (
        <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={6} p={6}>
            {properties.map((property, index) => (
                <GridItem key={index}>
                    <Link to={`/property/${property.id}`}>
                        <PropertyCard property={property}/>
                    </Link>
                </GridItem>
            ))}
        </Grid>
    );
}