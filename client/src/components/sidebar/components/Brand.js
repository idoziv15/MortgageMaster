import React from "react";
import { Flex, useColorModeValue } from "@chakra-ui/react";
import { SideBarLogo } from "../../icons/Icons";
import { HSeparator } from "../../separator/Separator";

export function SidebarBrand() {
  // Chakra color mode
  let logoColor = useColorModeValue("navy.700", "white");

  return (
    <Flex align='center' direction='column'>
      <SideBarLogo h='26px' w='175px' my='32px' color={logoColor} />
      <HSeparator mb='20px' />
    </Flex>
  );
}

export default SidebarBrand;
