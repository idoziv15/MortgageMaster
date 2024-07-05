import React, {useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {
    Box,
    Button,
    Checkbox,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Icon,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    useColorModeValue,
    Spinner,
} from "@chakra-ui/react";
import {HSeparator} from "../../../components/separator/Separator";
import DefaultAuth from "../../../layouts/auth/login";
import illustration from "../../../assets/img/auth/login-img.jpeg";
import {FcGoogle} from "react-icons/fc";
import {MdOutlineRemoveRedEye} from "react-icons/md";
import {RiEyeCloseLine} from "react-icons/ri";
import {GoogleOAuthProvider, GoogleLogin} from '@react-oauth/google';
import axios from 'axios';

export default function SignIn() {
    const googleClientId = 'YOUR_GOOGLE_CLIENT_ID';
    const textColor = useColorModeValue("navy.700", "white");
    const textColorSecondary = "gray.400";
    const textColorDetails = useColorModeValue("navy.700", "secondaryGray.600");
    const textColorBrand = useColorModeValue("brand.500", "white");
    const brandStars = useColorModeValue("brand.500", "brand.400");
    const googleBg = useColorModeValue("secondaryGray.300", "whiteAlpha.200");
    const googleText = useColorModeValue("navy.700", "white");
    const googleHover = useColorModeValue(
        {bg: "gray.200"},
        {bg: "whiteAlpha.300"}
    );
    const googleActive = useColorModeValue(
        {bg: "secondaryGray.300"},
        {bg: "whiteAlpha.200"}
    );
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePassword = (password) => {
        const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    };

    const handleSignIn = async () => {
        setError("");
        if (!validateEmail(email)) {
            setError("Invalid email format.");
            return;
        }
        // TODO: do i need this?
        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long and include at least one number, one capital letter, and one small letter.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('', {email, password});
            if (rememberMe) {
                localStorage.setItem('token', response.data.token);
            } else {
                sessionStorage.setItem('token', response.data.token);
            }
            setEmail("");
            setPassword("");
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <DefaultAuth illustrationBackground={illustration} image={illustration}>
                <Flex
                    maxW={{base: "100%", md: "max-content"}}
                    w='100%'
                    mx={{base: "auto", lg: "0px"}}
                    me='auto'
                    h='100%'
                    alignItems='start'
                    justifyContent='center'
                    mb={{base: "30px", md: "60px"}}
                    px={{base: "25px", md: "0px"}}
                    flexDirection='column'>
                    <Box me='auto'>
                        <Heading color={textColor} fontSize='36px' mb='5px'>
                            Sign In
                        </Heading>
                        <Text
                            mb='36px'
                            ms='4px'
                            color={textColorSecondary}
                            fontWeight='400'
                            fontSize='md'>
                            Enter your email and password to sign in!
                        </Text>
                    </Box>
                    <Flex
                        zIndex='2'
                        direction='column'
                        w={{base: "100%", md: "420px"}}
                        maxW='100%'
                        background='transparent'
                        borderRadius='15px'
                        mx={{base: "auto", lg: "unset"}}
                        me='auto'
                        mb={{base: "20px", md: "auto"}}>
                        {/*<GoogleLogin*/}
                        {/*                          onSuccess={response => console.log('Login Success: ', response)}*/}
                        {/*                          onError={() => console.log('Login Failed')}*/}
                        {/*/>*/}
                        <Button
                            fontSize='sm'
                            me='0px'
                            mb='26px'
                            py='15px'
                            h='50px'
                            borderRadius='16px'
                            bg={googleBg}
                            color={googleText}
                            fontWeight='500'
                            _hover={googleHover}
                            _active={googleActive}
                            _focus={googleActive}>
                            <Icon as={FcGoogle} w='20px' h='20px' me='10px'/>
                            Sign in with Google
                        </Button>
                        <Flex align='center' mb='25px'>
                            <HSeparator/>
                            <Text color='gray.400' mx='14px'>
                                or
                            </Text>
                            <HSeparator/>
                        </Flex>
                        <FormControl>
                            <FormLabel
                                display='flex'
                                ms='4px'
                                fontSize='sm'
                                fontWeight='500'
                                color={textColor}
                                mb='8px'>
                                Email<Text color={brandStars}>*</Text>
                            </FormLabel>
                            <Input
                                isRequired={true}
                                variant='auth'
                                fontSize='sm'
                                ms={{base: "0px", md: "0px"}}
                                type='email'
                                placeholder='mail@simmmple.com'
                                mb='24px'
                                fontWeight='500'
                                size='lg'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <FormLabel
                                ms='4px'
                                fontSize='sm'
                                fontWeight='500'
                                color={textColor}
                                display='flex'>
                                Password<Text color={brandStars}>*</Text>
                            </FormLabel>
                            <InputGroup size='md'>
                                <Input
                                    isRequired={true}
                                    fontSize='sm'
                                    placeholder='Min. 8 characters'
                                    mb='24px'
                                    size='lg'
                                    type={show ? "text" : "password"}
                                    variant='auth'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <InputRightElement display='flex' alignItems='center' mt='4px'>
                                    <Icon
                                        color={textColorSecondary}
                                        _hover={{cursor: "pointer"}}
                                        as={show ? RiEyeCloseLine : MdOutlineRemoveRedEye}
                                        onClick={handleClick}
                                    />
                                </InputRightElement>
                            </InputGroup>
                            <Flex justifyContent='space-between' align='center' mb='24px'>
                                <FormControl display='flex' alignItems='center'>
                                    <Checkbox
                                        id='remember-login'
                                        colorScheme='brandScheme'
                                        me='10px'
                                        isChecked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                    />
                                    <FormLabel
                                        htmlFor='remember-login'
                                        mb='0'
                                        fontWeight='normal'
                                        color={textColor}
                                        fontSize='sm'>
                                        Keep me logged in
                                    </FormLabel>
                                </FormControl>
                                <NavLink to='/auth/forgot-password'>
                                    <Text
                                        color={textColorBrand}
                                        fontSize='sm'
                                        w='124px'
                                        fontWeight='500'>
                                        Forgot password?
                                    </Text>
                                </NavLink>
                            </Flex>
                            <Button
                                fontSize='sm'
                                variant='brand'
                                fontWeight='500'
                                w='100%'
                                h='50'
                                mb='24px'
                                onClick={handleSignIn}>
                                Sign In
                            </Button>
                            {loading && (
                                <Flex position="fixed"
                                      top="50%"
                                      left="50%"
                                      transform="translate(-50%, -50%)"
                                      zIndex="9999"
                                      justifyContent='center'
                                      alignItems='center'
                                      bg='rgba(255, 255, 255, 0.8)'
                                      borderRadius='md'
                                      p='20px'>
                                    <Spinner/>
                                </Flex>
                            )}
                            {error && (
                                <Text color='red.500' mb='24px'>
                                    {error}
                                </Text>
                            )}
                        </FormControl>
                        <Flex
                            flexDirection='column'
                            justifyContent='center'
                            alignItems='start'
                            maxW='100%'
                            mt='0px'>
                            <Text color={textColorDetails} fontWeight='400' fontSize='14px'>
                                Not registered yet?
                                <NavLink to='/register'>
                                    <Text
                                        color={textColorBrand}
                                        as='span'
                                        ms='5px'
                                        fontWeight='500'>
                                        Create an Account
                                    </Text>
                                </NavLink>
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </DefaultAuth>
        </GoogleOAuthProvider>
    );
}