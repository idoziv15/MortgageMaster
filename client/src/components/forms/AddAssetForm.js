import React, {useState} from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  Switch,
  VStack,
  Heading,
  Image,
  useToast, Flex
} from '@chakra-ui/react';
export default function AddAssetForm() {
      const [image, setImage] = useState(null);
      const [imagePreviewUrl, setImagePreviewUrl] = useState('');
      const toast = useToast();
      const [formData, setFormData] = useState({
        purchase_price: "",
        monthly_rent_income: "",
        square_meters: "",
        parking_spots: "",
        warehouse: false,
        balcony_square_meter: "",
        after_repair_value: "",
        annual_appreciation_percentage: "",
      });

      const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
          setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
          });
      };

      const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file && (file.type === 'image/png' || file.type === 'image/jpeg')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImage(file);
            setImagePreviewUrl(reader.result);
          };
          reader.readAsDataURL(file);
        } else {
          toast({
            title: 'Invalid file type',
            description: 'Please upload a PNG or JPEG image',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        }
      };
      const handleSubmit = async (event) => {
          event.preventDefault();
          const data = new FormData();
          data.append("purchase_price", formData.purchase_price);
          data.append("monthly_rent_income", formData.monthly_rent_income);
          data.append("square_meters", formData.square_meters);
          data.append("parking_spots", formData.parking_spots);
          data.append("warehouse", formData.warehouse);
          data.append("balcony_square_meter", formData.balcony_square_meter);
          data.append("after_repair_value", formData.after_repair_value);
          data.append("annual_appreciation_percentage", formData.annual_appreciation_percentage);
          if (image) {
            data.append("property_image", image);
          }

          try {
            let userId = 'ido';
            const response = await axios.post(`http://localhost:5000/my-asset/${userId}`, data, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
            toast({
              title: "Property added",
              description: "The property has been added successfully",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            // Reset form
            setFormData({
              purchase_price: "",
              monthly_rent_income: "",
              square_meters: "",
              parking_spots: "",
              warehouse: false,
              balcony_square_meter: "",
              after_repair_value: "",
              annual_appreciation_percentage: "",
            });
            setImage(null);
            setImagePreviewUrl("");
          } catch (error) {
            toast({
              title: "Error",
              description: "There was an error adding the property",
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
              <FormControl id="purchase_price" isRequired>
                <FormLabel>Purchase Price</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField name="purchase_price" />
                </NumberInput>
              </FormControl>

              <FormControl id="monthly_rent_income" isRequired>
                <FormLabel>Monthly Rent Income</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField name="monthly_rent_income" />
                </NumberInput>
              </FormControl>

              <FormControl id="square_meters" isRequired>
                <FormLabel>Square Meters</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField name="square_meters" />
                </NumberInput>
              </FormControl>

              <FormControl id="parking_spots">
                <FormLabel>Parking Spots</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField name="parking_spots" />
                </NumberInput>
              </FormControl>

              <FormControl id="warehouse">
                <FormLabel>Warehouse</FormLabel>
                <Switch name="warehouse" />
              </FormControl>

              <FormControl id="balcony_square_meter">
                <FormLabel>Balcony Square Meters</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField name="balcony_square_meter" />
                </NumberInput>
              </FormControl>

              <FormControl id="after_repair_value">
                <FormLabel>After Repair Value</FormLabel>
                <NumberInput min={0}>
                  <NumberInputField name="after_repair_value" />
                </NumberInput>
              </FormControl>

              <FormControl id="annual_appreciation_percentage" isRequired>
                <FormLabel>Annual Appreciation Percentage</FormLabel>
                <NumberInput min={0} max={100} step={0.01}>
                  <NumberInputField name="annual_appreciation_percentage" />
                </NumberInput>
              </FormControl>

              <FormControl id="property_image">
                <FormLabel>Property Image</FormLabel>
                <Input type="file" accept="image/png, image/jpeg" onChange={handleImageChange} />
                {imagePreviewUrl && (
                  <Flex justify="center" mt={4}>
                    <Image src={imagePreviewUrl} alt="Property Image" boxSize="100px"
                      objectFit="cover" borderRadius="full" />
                  </Flex>
                )}
              </FormControl>
            </VStack>
            <Button colorScheme="green" type="submit" width="full" mt={5}>Save</Button>
          </form>
        </Box>
      );
}