import { Button, Box, Image, Text, Stack } from '@chakra-ui/react';
import { useContext } from 'react';
import { BlockchainContext } from './context/BlockchainContext';
import { useForm } from 'react-hook-form';

const Car = ({ car, carText }) => {
  const { checkOutCar, checkInCar } = useContext(BlockchainContext);
  /*
  const { handleSubmit, formState: { errors, isSubmitting }, } = useForm();

  const onSubmit = async () => {
    console.log("Test submit");
    await checkCarOut();
  };
  */
  return (
    <Box boxSize="lg" mx={2}>
      <Image src={car} mb={10} />
      <Text>{carText}</Text>
      <Stack spacing={0} direction={'row'} align={'center'} justify={'center'}>
        <Button
          m={2}
          onClick={checkOutCar}
          fontSize={'sm'}
          fontWeight={600}
          colorScheme={'teal'}
          bg={'teal.500'}
          _hover={{ bg: 'teal.300' }}
        >
          Check Out
        </Button>
        <Button
          m={2}
          onClick={checkInCar}
          fontSize={'sm'}
          fontWeight={600}
          colorScheme={'teal'}
          bg={'teal.500'}
          _hover={{ bg: 'teal.300' }}
        >
          Check In
        </Button>
      </Stack>
    </Box>
  );
};

export default Car;