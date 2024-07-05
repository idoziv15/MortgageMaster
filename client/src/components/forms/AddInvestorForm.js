import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';

export default function AddInvestorForm() {
  const toast = useToast();
  const [formData, setFormData] = useState({
    net_monthly_income: "",
    total_debt_payment: "",
    real_estate_investment_type: "",
    total_available_equity: "",
    gross_rental_income: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      let userId = 'ido';
      const response = await axios.post(`http://localhost:5000/investor-profile/${userId}`, formData);
      toast({
        title: "Profile Updated",
        description: "Investor profile has been updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // Reset form
      setFormData({
        net_monthly_income: "",
        total_debt_payment: "",
        real_estate_investment_type: "",
        total_available_equity: "",
        gross_rental_income: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating the profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="md" mx="auto" p={5} borderWidth="1px" borderRadius="lg" shadow="md">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <FormControl id="net_monthly_income" isRequired>
            <FormLabel>Net Monthly Income</FormLabel>
            <NumberInput min={0}>
              <NumberInputField name="net_monthly_income" value={formData.net_monthly_income} onChange={handleInputChange} />
            </NumberInput>
          </FormControl>

          <FormControl id="total_debt_payment" isRequired>
            <FormLabel>Total Debt Payment</FormLabel>
            <NumberInput min={0}>
              <NumberInputField name="total_debt_payment" value={formData.total_debt_payment} onChange={handleInputChange} />
            </NumberInput>
          </FormControl>

          <FormControl id="real_estate_investment_type" isRequired>
            <FormLabel>Real Estate Investment Type</FormLabel>
            <Input name="real_estate_investment_type" value={formData.real_estate_investment_type} onChange={handleInputChange} />
          </FormControl>

          <FormControl id="total_available_equity" isRequired>
            <FormLabel>Total Available Equity</FormLabel>
            <NumberInput min={0}>
              <NumberInputField name="total_available_equity" value={formData.total_available_equity} onChange={handleInputChange} />
            </NumberInput>
          </FormControl>

          <FormControl id="gross_rental_income" isRequired>
            <FormLabel>Gross Rental Income</FormLabel>
            <NumberInput min={0}>
              <NumberInputField name="gross_rental_income" value={formData.gross_rental_income} onChange={handleInputChange} />
            </NumberInput>
          </FormControl>
        </VStack>
        <Button colorScheme="green" type="submit" width="full" mt={5}>Save</Button>
      </form>
    </Box>
  );
}