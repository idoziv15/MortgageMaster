import React from "react";
import {SimpleGrid, Text, useColorModeValue} from "@chakra-ui/react";
import Card from "../../../components/card/Card.js";
import UserDetail from "./UserDetail";

export default function UserDetails(props) {
    const {first_name, last_name, email, userId, loading, setLoading, onUpdateDetail, ...rest} = props;
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    const textColorSecondary = "gray.400";
    const cardShadow = useColorModeValue(
        "0px 18px 40px rgba(112, 144, 176, 0.12)",
        "unset"
    );

    return (
        <Card mb={{base: "0px", "2xl": "10px"}} {...rest}>
            <Text
                color={textColorPrimary}
                fontWeight="bold"
                fontSize="2xl"
                mt="5px"
                mb="4px"
            >
                User Information
            </Text>
            <Text color={textColorSecondary} fontSize="md" me="26px" mb="20px">
                Here you can see and edit your personal details
            </Text>
            <SimpleGrid columns="2" gap="20px">
                <UserDetail
                    userId={userId}
                    boxShadow={cardShadow}
                    title="First Name"
                    value={first_name}
                    loading={loading}
                    setLoading={setLoading}
                    onUpdateDetail={(newValue) => onUpdateDetail('first_name', newValue)}
                />
                <UserDetail
                    userId={userId}
                    boxShadow={cardShadow}
                    title="Last Name"
                    value={last_name}
                    loading={loading}
                    setLoading={setLoading}
                    onUpdateDetail={(newValue) => onUpdateDetail('last_name', newValue)}
                />
                <UserDetail
                    userId={userId}
                    boxShadow={cardShadow}
                    title="Email"
                    value={email}
                    loading={loading}
                    setLoading={setLoading}
                    onUpdateDetail={(newValue) => onUpdateDetail('email', newValue)}
                />
            </SimpleGrid>
        </Card>
    );
}
