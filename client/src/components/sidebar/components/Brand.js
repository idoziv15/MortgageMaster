import React from "react";
import {Flex, useColorModeValue, Image} from "@chakra-ui/react";
import {SideBarLogo} from "../../icons/Icons";
import {HSeparator} from "../../separator/Separator";
import logo from "../../../assets/img/sideBarLogo.png";

export function SidebarBrand() {
    let logoColor = useColorModeValue("navy.700", "white");

    return (
        <Flex align='center' direction='column'>
            <Image src={logo} />
            {/*<SideBarLogo h='26px' w='175px' my='32px' color={logoColor}/>*/}
            <HSeparator mb='20px'/>
        </Flex>
    );
}

export default SidebarBrand;
