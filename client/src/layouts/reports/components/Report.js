import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Box, Text, Portal, useToast} from "@chakra-ui/react";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/NavbarAdmin";
import Footer from "../../../components/footer/Footer";
import axios from 'axios';

export default function ReportDetail() {
    const {id} = useParams();
    const [report, setReport] = useState(null);
    const toast = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [editedReport, setEditedReport] = useState({});

    useEffect(() => {
        const fetchReport = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/report/${id}`);
                setReport(response.data.report);
                setEditedReport(response.data.report);
            } catch (error) {
                console.error('Error fetching report:', error);
                toast({
                    title: "Failed to fetch report.",
                    description: "There was an error fetching the report details.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchReport();
    }, [id, toast]);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setEditedReport({
            ...editedReport,
            [name]: value,
        });
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await axios.put(`http://localhost:5000/api/reports/${id}`, editedReport);
            toast({
                title: "Report updated.",
                description: "The report details have been successfully updated.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            console.error('Error updating report:', error);
            toast({
                title: "Failed to update report.",
                description: "There was an error updating the report details.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <Text>Loading...</Text>;
    }

    if (!report) {
        return <Text>Report not found</Text>;
    }

    return (
        <Box>
            <Sidebar routes={[]} display='none'/>
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
                pt='110px'
            >
                <Portal>
                    <Navbar
                        brandText={report.name}
                        secondary={true}
                    />
                </Portal>
                <Box>
                    <Text>{report.name}</Text>
                    <Text>{report.description}</Text>
                    <form onSubmit={handleSave}>
                        <input type="text" name="name" value={editedReport.name} onChange={handleChange}/>
                        <input type="text" name="description" value={editedReport.description} onChange={handleChange}/>
                        <button type="submit">Save</button>
                    </form>
                </Box>
                <Box mt="auto">
                    <Footer/>
                </Box>
            </Box>
        </Box>
    );
}
