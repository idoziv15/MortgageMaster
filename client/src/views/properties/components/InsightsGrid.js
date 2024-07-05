import React from "react";
import {
    SimpleGrid,
    Icon,
    Box,
    Text,
    Flex,
    Avatar,
    Select,
    FormLabel, useColorModeValue,
} from "@chakra-ui/react";
import {MdBarChart, MdAttachMoney, MdAddTask, MdFileCopy} from "react-icons/md";
import IconBox from "../../../components/icons/IconBox";
import MiniStatistics from "../../../components/card/MiniStatistics";

export default function InsightsGrid({insights}) {
    const brandColor = useColorModeValue("brand.500", "white");
    const boxBg = useColorModeValue("secondaryGray.300", "whiteAlpha.100");
    return (
        <SimpleGrid
            columns={{base: 1, md: 2, lg: 3, "2xl": 6}}
            gap="20px"
            mb="20px"
        >
            {Object.entries(insights).map(([name, value]) => (
                <MiniStatistics
                    name={name}
                    value={value}
                    startContent={
                        <IconBox
                            w="56px"
                            h="56px"
                            bg={boxBg}
                            icon={
                                <Icon
                                    w="32px"
                                    h="32px"
                                    as={MdBarChart}
                                    color={brandColor}
                                />
                            }
                        />
                    }
                />
            ))}
        </SimpleGrid>
    )
};
