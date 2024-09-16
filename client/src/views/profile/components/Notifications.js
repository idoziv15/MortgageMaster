import {Flex, Text, useColorModeValue} from "@chakra-ui/react";
import Card from "../../../components/card/Card.js";
import SwitchField from "../../../components/fields/SwitchField";
import Menu from "../../../layouts/reports/components/TasksMenu";

export default function Notifications(props) {
    const {...rest} = props;
    const textColorPrimary = useColorModeValue("secondaryGray.900", "white");
    return (
        <Card mx="auto" w='100%' {...rest}>
            <Flex align="center" w="100%" justify="space-between" mb="30px">
                <Text
                    color={textColorPrimary}
                    fontWeight="bold"
                    fontSize="2xl"
                    mb="4px"
                >
                    Notifications
                </Text>
            </Flex>
            <SwitchField
                isChecked={false}
                reversed={true}
                fontSize="sm"
                mb="20px"
                id="1"
                label="Report update notifications"
            />
            <SwitchField
                reversed={true}
                fontSize="sm"
                mb="20px"
                id="6"
                label="Company news notifications"
            />
            <SwitchField
                isChecked={false}
                reversed={true}
                fontSize="sm"
                mb="20px"
                id="7"
                label="New launches and projects"
            />
            <SwitchField
                reversed={true}
                fontSize="sm"
                mb="20px"
                id="8"
                label="Monthly product changes"
            />
            <SwitchField
                isChecked={false}
                reversed={true}
                fontSize="sm"
                mb="20px"
                id="9"
                label="Subscribe to newsletter"
            />
            <SwitchField
                reversed={true}
                fontSize="sm"
                id="10"
                label="Email me new reports upgrades"
            />
        </Card>
    );
}
