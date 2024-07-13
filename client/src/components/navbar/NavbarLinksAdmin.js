import {
    Avatar,
    Flex,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue, useToast
} from '@chakra-ui/react';
import {ItemContent} from '../menu/ItemContent';
import {SearchBar} from './searchBar/SearchBar';
import {SidebarResponsive} from '../sidebar/Sidebar';
import PropTypes from 'prop-types';
import React from 'react';
import axios from 'axios';
import {MdNotificationsNone, MdInfoOutline} from 'react-icons/md';
import {NavLink} from "react-router-dom";
import routes from '../../routes.js';
import {ThemeEditor} from './ThemeEditor';
import {useNavigate} from "react-router-dom";

export default function HeaderLinks(props) {
    const {secondary, currUser } = props;
    const navbarIcon = useColorModeValue('gray.400', 'white');
    const menuBg = useColorModeValue('white', 'navy.800');
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const textColorBrand = useColorModeValue('brand.700', 'brand.400');
    const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
    const shadow = useColorModeValue(
        '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
        '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
    );
    // const borderButton = useColorModeValue('secondaryGray.500', 'whiteAlpha.200');
    const toast = useToast();
    const navigate = useNavigate();

    const getToken = () => {
        // Check if token is in sessionStorage
        let token = sessionStorage.getItem('token');

        // If token is not found in sessionStorage, check localStorage
        if (!token) {
            token = localStorage.getItem('token');
        }

        return token;
    };

    const handleLogout = async () => {
        try {
            const token = getToken();
            const headers = {
                Authorization: `Bearer ${token}`
            };

            await axios.post('http://localhost:5000/logout', null, {headers});
            // Remove token from localStorage on successful logout
            sessionStorage.removeItem('token');
            navigate('/');
        } catch (error) {
            console.error('Failed to log out:', error);
            toast({
                title: 'Failed to logout',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex
            w={{sm: '100%', md: 'auto'}}
            alignItems="center"
            flexDirection="row"
            bg={menuBg}
            flexWrap={secondary ? {base: 'wrap', md: 'nowrap'} : 'unset'}
            p="10px"
            borderRadius="30px"
            boxShadow={shadow}>
            <SearchBar mb={secondary ? {base: '10px', md: 'unset'} : 'unset'} me="10px" borderRadius="30px"/>
            <SidebarResponsive routes={routes}/>
            <Menu>
                <MenuButton p="0px">
                    <Icon mt="6px" as={MdNotificationsNone} color={navbarIcon} w="18px" h="18px" me="10px"/>
                </MenuButton>
                <MenuList
                    boxShadow={shadow}
                    p="20px"
                    borderRadius="20px"
                    bg={menuBg}
                    border="none"
                    mt="22px"
                    me={{base: '30px', md: 'unset'}}
                    minW={{base: 'unset', md: '400px', xl: '450px'}}
                    maxW={{base: '360px', md: 'unset'}}>
                    <Flex jusitfy="space-between" w="100%" mb="20px">
                        <Text fontSize="md" fontWeight="600" color={textColor}>
                            Notifications
                        </Text>
                        <Text fontSize="sm" fontWeight="500" color={textColorBrand} ms="auto" cursor="pointer">
                            Mark all read
                        </Text>
                    </Flex>
                    <Flex flexDirection="column">
                        <MenuItem _hover={{bg: 'none'}} _focus={{bg: 'none'}} px="0" borderRadius="8px" mb="10px">
                            <ItemContent info="Master Mortgage PRO" description='Have you tried PRO yet?'/>
                        </MenuItem>
                        <MenuItem _hover={{bg: 'none'}} _focus={{bg: 'none'}} px="0" borderRadius="8px" mb="10px">
                            <ItemContent info="New property added" description='Congradulations'/>
                        </MenuItem>
                    </Flex>
                </MenuList>
            </Menu>

            <ThemeEditor navbarIcon={navbarIcon}/>

            <Menu>
                <MenuButton p="0px">
                    <Avatar
                        _hover={{cursor: 'pointer'}}
                        color="white"
                        name={currUser.first_name}
                        bg="#11047A"
                        size="sm"
                        w="40px"
                        h="40px"
                    />
                </MenuButton>
                <MenuList boxShadow={shadow} p="0px" mt="10px" borderRadius="20px" bg={menuBg} border="none">
                    <Flex w="100%" mb="0px">
                        <Text
                            ps="20px"
                            pt="16px"
                            pb="10px"
                            w="100%"
                            borderBottom="1px solid"
                            borderColor={borderColor}
                            fontSize="sm"
                            fontWeight="700"
                            color={textColor}>
                            Hello, {currUser.first_name + ' ' + currUser.last_name}
                        </Text>
                    </Flex>
                    <Flex flexDirection="column" p="10px">
                        <MenuItem _hover={{bg: 'none'}} _focus={{bg: 'none'}} borderRadius="8px" px="14px">
                            {/*<Text fontSize="sm">Profile Settings</Text>*/}
                            <NavLink to='/profile' fontSize="sm">Profile Settings</NavLink>
                        </MenuItem>
                        <MenuItem
                            _hover={{bg: 'none'}}
                            _focus={{bg: 'none'}}
                            color="red.400"
                            borderRadius="8px"
                            px="14px">
                            <Text fontSize="sm" onClick={handleLogout}>Log Out</Text>
                        </MenuItem>
                    </Flex>
                </MenuList>
            </Menu>
        </Flex>
    );
}

HeaderLinks.propTypes = {
    variant: PropTypes.string,
    fixed: PropTypes.bool,
    secondary: PropTypes.bool,
    onOpen: PropTypes.func
};
