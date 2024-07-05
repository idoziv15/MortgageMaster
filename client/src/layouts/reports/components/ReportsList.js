import React from "react";
import {Box, Button, Grid, GridItem} from '@chakra-ui/react';
import InvestmentReport from './InvestmentReport';
import {FaArrowRight} from "react-icons/fa";
import {Link} from "react-router-dom";

export default function ReportsList({reports}) {
    return (
        <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={6} p={6}>
            {reports.map((report, index) => (
                <GridItem key={index}>
                    <InvestmentReport report={report} />
                </GridItem>
            ))}
        </Grid>
    );
}