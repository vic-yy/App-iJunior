import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import axios from 'axios';
import { CollectedBadgesResponse, CollectResponse } from './types/apiTypes';

const days = ['m', 't', 'w', 'th', 'f', 's', 'su'];

const App = () => {
  const [collectedData, setCollectedData] = useState<CollectedBadgesResponse['collected'] | null>(null);
  const [update, setUpdate] = useState(0);
  const toast = useToast();

  useEffect(() => {
    axios.get<CollectedBadgesResponse>('http://localhost:3000/api/getCollectedBadges')
      .then((response) => {
        setCollectedData(response.data.collected);
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'There was an error getting the badges',
          status: 'error',
          duration: 5000,
          isClosable: true
        });
      });
  }, [update]);

  const boxBorder = useColorModeValue('gray.300', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const handleCollect = () => {
    axios.post<CollectResponse>('http://localhost:3000/api/collect')
      .then((response) => {
        if (response.data.collected) {
          toast({
            title: 'Success',
            description: 'You have collected a badge',
            status: 'success',
            duration: 5000,
            isClosable: true
          });
          setUpdate((prev) => prev + 1);
        } else {
          toast({
            title: 'Error',
            description: "You have already collected today's badge",
            status: 'error',
            duration: 5000,
            isClosable: true
          });
        }
      });
  };

  return (
    <Container maxW="6xl" p={4}>
      <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={4}>
        <Heading>Welcome user!</Heading>
        <Flex justifyContent="flex-end">
          {/* Add your color mode toggle here */}
        </Flex>
      </Grid>
      <Heading my={8} size="md">
        Here are the available badges
      </Heading>
      <Grid templateColumns="repeat(7, 1fr)" gap={4}>
        {days.map((day, i) => (
          <Box
            key={i}
            borderRadius="md"
            shadow="md"
            border="1px"
            borderColor={boxBorder}
            p={4}
            _hover={{
              shadow: 'lg'
            }}
          >
            <img src={`/badges/${i}.png`} alt="badge" width={200} height={200} />
            <Text align="center" my={4}>
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][i]}
            </Text>
            <Text align="center" color={textColor}>
              {collectedData ? collectedData[day] : 0} collected
            </Text>
          </Box>
        ))}
      </Grid>
      <Button mt={4} colorScheme="blue" onClick={handleCollect}>
        Collect badge
      </Button>
    </Container>
  );
};

export default App;
