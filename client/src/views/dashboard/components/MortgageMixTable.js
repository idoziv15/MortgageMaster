import React, {useState} from 'react';
import {
    Table,
    Tbody,
    Tr,
    Td,
    Input,
    Button,
    Select,
} from '@chakra-ui/react';

export default function MortgageMixTable({tracks, setTracks}) {
    const handleAddTrack = () => {
        setTracks([...tracks, {
            type: '',
            loanAmount: 0,
            numPayments: 0,
            interestRate: 0,
            interestOnlyPeriod: 0,
        }]);
    };

    const handleTrackChange = (index, field, value) => {
        const updatedTracks = tracks.map((track, i) =>
            i === index ? {...track, [field]: value} : track
        );
        setTracks(updatedTracks);
    };

    return (
        <Table variant="simple" size="sm">
            <Tbody>
                <Tr>
                    <Td><strong>Type</strong></Td>
                    <Td><strong>Loan Amount</strong></Td>
                    <Td><strong>Number of Payments</strong></Td>
                    <Td><strong>Interest Rate</strong></Td>
                    <Td><strong>Interest Only Period</strong></Td>
                </Tr>
                {tracks.map((track, index) => (
                    <Tr key={index}>
                        <Td>
                            <Select
                                value={track.type}
                                onChange={(e) => handleTrackChange(index, 'type', e.target.value)}
                                size="sm"
                            >
                                <option value="">Select Type</option>
                                <option value="fixed">Fixed</option>
                                <option value="variable">Variable</option>
                                <option value="interest-only">Interest Only</option>
                                {/* Add more types as needed */}
                            </Select>
                        </Td>
                        <Td>
                            <Input
                                value={track.loanAmount}
                                onChange={(e) => handleTrackChange(index, 'loanAmount', e.target.value)}
                                type="number"
                                size="sm"
                            />
                        </Td>
                        <Td>
                            <Input
                                value={track.numPayments}
                                onChange={(e) => handleTrackChange(index, 'numPayments', e.target.value)}
                                type="number"
                                size="sm"
                            />
                        </Td>
                        <Td>
                            <Input
                                value={track.interestRate}
                                onChange={(e) => handleTrackChange(index, 'interestRate', e.target.value)}
                                type="number"
                                size="sm"
                            />
                        </Td>
                        <Td>
                            <Input
                                value={track.interestOnlyPeriod}
                                onChange={(e) => handleTrackChange(index, 'interestOnlyPeriod', e.target.value)}
                                type="number"
                                size="sm"
                            />
                        </Td>
                    </Tr>
                ))}
                <Tr>
                    <Td colSpan={5} textAlign="center">
                        <Button onClick={handleAddTrack} size="sm" colorScheme="green">Add Track</Button>
                    </Td>
                </Tr>
            </Tbody>
        </Table>
    );
}
