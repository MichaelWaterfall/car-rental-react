import CurrentTotals from './CurrentTotals';
import { Stack, Box, Flex, Center } from '@chakra-ui/react';
import Car from './Car';
import bmw from '../assets/bmw.jpg';
import lowrider from '../assets/lowrider.jpg';
import rangerover from '../assets/rangerover.jpg';
import AddRenter from './AddRenter';
import { useContext, useState } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';
import ClipLoader from 'react-spinners/ClipLoader';

const Dashboard = () => {
  const { renterExists } = useContext(BlockchainContext);
  const { loading, setLoading } = useState(true);
  return (
    <Stack as={Box} textAlign={'center'} spacing={{ base: 8, md: 14 }} py={{ base: 20, md: 36 }}>
      {renterExists == null ? (
        <Center>
          <ClipLoader loading={loading} size={75} />
        </Center>
      ) : renterExists ? (
        <CurrentTotals />
      ) : (
        <AddRenter />
      )}
      <Flex justifyContent={'center'} alignItems={'center'}>
        <Car
          car={bmw}
          carText={
            'The BMW is a performance vehicle with a high quality interior. BMW prides itself on comfort and cabin design Bayerische Motoren Werke AG, abbreviated as BMW, a German multinational manufacturer of luxury vehicles and motorcycles headquartered in Munich, Bavaria, Germany. The company was founded in 1916 as a manufacturer of aircraft engines, which it produced from 1917 to 1918 and again from 1933 to 1945.'
          }
        />
        <Car
          car={lowrider}
          carText={
            'A lowrider or low rider is a customized car with a lowered body that emerged among Mexican American youth in the 1940s. Lowrider also refers to the driver of the car and their participation in lowrider car clubs, which remain a part of Chicano culture and have since expanded internationally. These customized vehicles are also artworks, generally being painted with intricate, colorful designs, unique aesthetic features, and rolling on wire-spoke wheels with whitewall tires.'
          }
        />
        <Car
          car={rangerover}
          carText={
            'The Range Rover is a 4x4 luxury SUV produced by Land Rover, a marque and sub-brand of Jaguar Land Rover. The Range Rover line was launched in 1970 by British Leyland and is now in its fifth generation. Additional models have been launched under the Range Rover name, including the Range Rover Sport, Range Rover Evoque, and Range Rover Velar.'
          }
        />
      </Flex>
    </Stack>
  );
};

export default Dashboard;