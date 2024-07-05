import React, {useEffect, useState} from 'react';
import {Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Link, Text, useColorModeValue} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { Link as RouterLink } from 'react-router-dom';
import PropertyNavbarLinks from "./NavbarLinksProperty";

export default function PropertyNavbar({ assetName }) {
  const [ scrolled, setScrolled ] = useState(false);
  const color = useColorModeValue('navy.700', 'white')

  useEffect(() => {
      window.addEventListener('scroll', changeNavbar);

      return () => {
          window.removeEventListener('scroll', changeNavbar);
      };
  });

  const secondaryText = '', message = '', brandText = ''
  const changeNavbar = () => {
		if (window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
  };

	return (
    <Box
			// position={navbarPosition}
			boxShadow = 'none'
			// bg = 'blur(20px)'
			// borderColor='black'
			borderColor='transparent'
			filter='none'
			// backdropFilter='blur(20px)'
			backgroundPosition='center'
			backgroundSize='cover'
			backgroundColor='white'
			borderRadius='16px'
			borderWidth='1.5px'
			borderStyle='solid'
			transitionDelay='0s, 0s, 0s, 0s'
			transitionDuration=' 0.25s, 0.25s, 0.25s, 0s'
			transition-property='box-shadow, background-color, filter, border'
			transitionTimingFunction='linear, linear, linear, linear'
			alignItems={{ xl: 'center' }}
			// display={secondaryText ? 'block' : 'flex'}
			minH='75px'
			justifyContent={{ xl: 'center' }}
			lineHeight='25.6px'
			mx='auto'
			mt='0px'
			pb='8px'
			right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
			px={{
				sm: '15px',
				md: '10px'
			}}
			ps={{
				xl: '12px'
			}}
			pt='8px'
			top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
			w={{
				base: 'calc(100vw - 6%)',
				md: 'calc(100vw - 8%)',
				lg: 'calc(100vw - 6%)',
				xl: 'calc(100vw - 350px)',
				'2xl': 'calc(100vw - 365px)'
			}}
			//w='95%'
			>
			<Flex
				w='100%'
				flexDirection={{
					sm: 'column',
					md: 'row'
				}}
				alignItems={{ xl: 'center' }}
				mb={'0px'}>
				<Box mr="8px">
				  <Link as={RouterLink} to="/my-assets" color="black">
					<ArrowBackIcon w={6} h={6} color="black" />
				  </Link>
				</Box>
				<Box mb={{ sm: '8px', md: '0px' }}>
					<Breadcrumb>
						<BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
							<BreadcrumbLink href='#' color={secondaryText}>
								Pages
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem color={secondaryText} fontSize='sm' mb='5px'>
							<BreadcrumbLink href='#' color={secondaryText}>
								{brandText}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
					{/* Here we create navbar brand, based on route name */}
					<Link
						color={color}
						href='#'
						bg='inherit'
						borderRadius='inherit'
						fontWeight='bold'
						fontSize='34px'
						_hover={{ color: { color } }}
						_active={{
							bg: 'inherit',
							transform: 'none',
							borderColor: 'transparent'
						}}
						_focus={{
							boxShadow: 'none'
						}}>
						{brandText}
					</Link>
				</Box>
				<Box ms='auto' w={{ sm: '100%', md: 'unset' }}>
					<PropertyNavbarLinks
						logoText={assetName}
						secondary={assetName}
						scrolled={scrolled}
					/>
				</Box>
			</Flex>
			{secondaryText ? <Text color='white'>{message}</Text> : null}
		</Box>
  );
}
