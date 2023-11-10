import { useForm } from 'react-hook-form';
import { FormErrorMessage, FormLabel, FormControl, Input, Button, Text, Flex } from '@chakra-ui/react';
import { useContext } from 'react';
import { BlockchainContext } from './context/BlockchainContext';

export default function AddRenter() {
  const { connectWallet, currentAccount, addRenter } = useContext(BlockchainContext);
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    addRenter();
  };

  return (
    <Flex justifyContent={'center'} alignItems={'center'} p={5} mt={5}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text fontFamily={'heading'} fontSize={'x-large'} fontWeight={600} mb={4}>
          Welcome {currentAccount.slice(0, 5)}, press the button below to become a renter:
        </Text>
        <Button mt={4} colorScheme="teal" isLoading={isSubmitting} type="submit">
          Become A Renter
        </Button>
      </form>
    </Flex>
  );
}