import React, {useState} from "react";
import {Grid, GridItem} from '@chakra-ui/react';
import InvestmentReport from './InvestmentReport';

export default function ReportsList({ reports }) {
    const [reportList, setReportList] = useState(reports);

    const handleDeleteReport = (reportId) => {
        setReportList(reportList.filter(report => report._id !== reportId));
    };

    return (
        <Grid templateColumns="repeat(auto-fill, minmax(240px, 1fr))" gap={6} p={6}>
            {reportList.map((report, index) => (
                <GridItem key={index}>
                    <InvestmentReport report={report} onDelete={handleDeleteReport} />
                </GridItem>
            ))}
        </Grid>
    );
}