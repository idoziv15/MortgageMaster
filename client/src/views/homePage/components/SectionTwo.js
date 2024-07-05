import {Box, Flex, Heading, Text, UnorderedList, ListItem, Icon, Image, Link} from "@chakra-ui/react";
import {CheckIcon} from "@chakra-ui/icons";
import FadingLine from "./FadingLine";

const SectionTwo = ({children}) => (
    <ListItem display="flex" alignItems="center" mt={3}>
        <Flex
            mr={2}
            h={6}
            w={6}
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
            bg="green.100"
        >
            <Icon as={CheckIcon} color="green.700" boxSize={3.5}/>
        </Flex>
        <Text fontSize="base" textColor="gray.800">
            {children}
        </Text>
    </ListItem>
);

const Section = () => {
    return (
        <Box w="full" pb={12} bg="green.50">
            <Flex
                maxW="8xl"
                mx="auto"
                flexWrap="wrap"
                justifyContent="center"
                px={6}
                lg={{flexWrap: "nowrap", justifyContent: "space-between", py: 20}}
            >
                <Box
                    maxW="lg"
                    flex="1"
                    pt={12}
                    textColor="green.900"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    md={{pt: 20}}
                    lg={{basis: "33%", pt: 0}}
                >
                    <Box>
                        <Heading as="h2" size="lg" fontWeight="bold" textColor="gray.800">
                            Digital HELOC
                        </Heading>
                        <Heading as="h3" size="md" fontWeight="bold" mt={4} textColor="gray.800">
                            Apply online. Fast approval.
                        </Heading>
                        <UnorderedList mt={4}>
                            <SectionTwo>Unlock a $50k-$500k line of credit</SectionTwo>
                            <SectionTwo>
                                Access up to 90% of property value<sup style={{fontSize: "11px", opacity: 0.75}}>2</sup>
                            </SectionTwo>
                            <SectionTwo>Available for primary, second, and investment homes</SectionTwo>
                        </UnorderedList>
                    </Box>
                    <Box display="flex" flexDirection="column">
                        <Image
                            alt="Equity available in your home"
                            loading="lazy"
                            width={500}
                            height={300}
                            mt={10}
                            borderRadius="base"
                            src="https://media.better.com/better-com/1679379835785/home-equity.webp"
                        />
                        <Link
                            href=""
                            mt={10}
                            display="inline-flex"
                            justifyContent="center"
                            alignItems="center"
                            h="12"
                            w="full"
                            bg="blue.600"
                            textColor="white"
                            fontWeight="bold"
                            textAlign="center"
                            borderRadius="base"
                            _hover={{bg: "blue.700"}}
                            _focus={{boxShadow: "0 0 0 4px inset"}}
                            _disabled={{textColor: "gray.500", bg: "gray.300", boxShadow: "none"}}
                        >
                            Apply in minutes
                        </Link>
                    </Box>
                </Box>

                <FadingLine />

                <Box
                    maxW="lg"
                    flex="1"
                    pt={12}
                    textColor="green.900"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    md={{pt: 20}}
                    lg={{basis: "33%", pt: 0}}
                >
                    <Box>
                        <Heading as="h2" size="lg" fontWeight="bold" textColor="gray.800">
                            Digital home loans
                        </Heading>
                        <Heading as="h3" size="md" fontWeight="bold" mt={4} textColor="gray.800">
                            Low rates. Save thousands. Close fast.
                        </Heading>
                        <UnorderedList mt={4}>
                            <SectionTwo>Apply 100% online, on your schedule</SectionTwo>
                            <SectionTwo>Close 17 days faster than industry avg.</SectionTwo>
                            <SectionTwo>Get pre-approved in as little as 3 minutes</SectionTwo>
                        </UnorderedList>
                    </Box>
                    <Box display="flex" flexDirection="column">
                        <Image
                            alt="A home with a truck parked"
                            loading="lazy"
                            width={500}
                            height={300}
                            mt={10}
                            borderRadius="base"
                            src="https://media.better.com/better-com/1666982135712/home-loans.webp"
                        />
                        <Link
                            href="/start"
                            mt={10}
                            display="inline-flex"
                            justifyContent="center"
                            alignItems="center"
                            h="12"
                            w="full"
                            bg="blue.600"
                            textColor="white"
                            fontWeight="bold"
                            textAlign="center"
                            borderRadius="base"
                            _hover={{bg: "blue.700"}}
                            _focus={{boxShadow: "0 0 0 4px inset"}}
                            _disabled={{textColor: "gray.500", bg: "gray.300", boxShadow: "none"}}
                        >
                            Get pre-approved
                        </Link>
                    </Box>
                </Box>

                <FadingLine />

                <Box
                    maxW="lg"
                    flex="1"
                    pt={12}
                    textColor="green.900"
                    display="flex"
                    flexDirection="column"
                    justifyContent="space-between"
                    md={{pt: 20}}
                    lg={{basis: "33%", pt: 0}}
                >
                    <Box>
                        <Heading as="h2" size="lg" fontWeight="bold" textColor="gray.800">
                            Real Estate Agents
                        </Heading>
                        <Heading as="h3" size="md" fontWeight="bold" mt={4} textColor="gray.800">
                            Partner with a local expert and save big.
                        </Heading>
                        <UnorderedList mt={4}>
                            <SectionTwo>
                                $2k off Better Mortgage closing costs<sup
                                style={{fontSize: "11px", opacity: 0.75}}>3</sup>
                            </SectionTwo>
                            <SectionTwo>Local expert knowledge</SectionTwo>
                            <SectionTwo>Seamless communication with Better Mortgage</SectionTwo>
                        </UnorderedList>
                    </Box>
                    <Box display="flex" flexDirection="column">
                        <Image
                            alt="Real estate agent"
                            loading="lazy"
                            width={500}
                            height={300}
                            mt={10}
                            borderRadius="base"
                            src="https://media.better.com/better-com/1666982135712/real-estate-agents.jpg"
                        />
                        <Link
                            href="/b/realestate"
                            mt={10}
                            display="inline-flex"
                            justifyContent="center"
                            alignItems="center"
                            h="12"
                            w="full"
                            bg="blue.600"
                            textColor="white"
                            fontWeight="bold"
                            textAlign="center"
                            borderRadius="base"
                            _hover={{bg: "blue.700"}}
                            _focus={{boxShadow: "0 0 0 4px inset"}}
                            _disabled={{textColor: "gray.500", bg: "gray.300", boxShadow: "none"}}
                        >
                            Learn more about agents
                        </Link>
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

export default Section;
