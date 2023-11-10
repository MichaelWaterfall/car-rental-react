'use client';

import { Box, chakra, Flex, SimpleGrid, Stat, StatLabel, StatNumber, useColorModeValue } from '@chakra-ui/react';
import { MdAccountBalance } from 'react-icons/md';
import { FcMoneyTransfer, FcOvertime } from 'react-icons/fc';
import PayForm from './Payform';
//import AddToBalanceForm from './AddToBalanceForm';
import AddRenter from './AddRenter';
import { useContext, useState, useEffect } from 'react';
import { BlockchainContext } from '../context/BlockchainContext';

function StatsCard(props) {
  const { title, stat, icon, bgColor } = props;
  return (
    <Stat
      px={{ base: 2, md: 4 }}
      py={'5'}
      shadow={'xl'}
      border={'1px solid'}
      borderColor={useColorModeValue('gray.800', 'gray.500')}
      rounded={'lg'}
      backgroundColor={bgColor}
    >
      <Flex justifyContent={'space-between'}>
        <Box pl={{ base: 2, md: 4 }}>
          <StatLabel fontWeight={'medium'} isTruncated>
            {title}
          </StatLabel>
          <StatNumber fontSize={'1xl'} fontWeight={'medium'}>
            {stat}
          </StatNumber>
        </Box>
        <Box my={'auto'} color={useColorModeValue('gray.800', 'gray.200')} alignContent={'center'}>
          {icon}
        </Box>
      </Flex>
    </Stat>
  );
}

export default function CurrentTotals() {
  const { currentAccount, renterBalance, due, canRent, duration } = useContext(BlockchainContext);

  console.log('CurrentTotals Due: ' + due);
  console.log('CurrentTotals canRent: ' + canRent);
  return (
    <Box maxW="7xl" mx={'auto'} pt={5} px={{ base: 2, sm: 12, md: 17 }}>
      <chakra.h1 textAlign={'center'} fontSize={'4xl'} py={10} fontWeight={'bold'}>
        Welcome {currentAccount.slice(0, 5)}, please select the car you would like to rent.
      </chakra.h1>
      <SimpleGrid columns={{ base: 1, md: 4 }} spacing={{ base: 5, lg: 8 }}>
        <StatsCard
          title={'Client Balance: '}
          stat={renterBalance.slice(0, 10)}
          icon={<MdAccountBalance size={'3em'} />}
        />
        <StatsCard title={'Amount Due: '} stat={due} icon={<FcMoneyTransfer size={'3em'} />} />
        <StatsCard
          title={'Driving Time: '}
          stat={duration > 60 ? Number(duration) / 60 + ' Hours' : duration + ' Minutes'}
          icon={<FcOvertime size={'3em'} />}
        />
        {/*<StopWatch title={'Driving Time: '} stat={} /> */}
        <StatsCard title={'Car Status: '} bgColor={canRent ? 'green' : 'red'} />
      </SimpleGrid>
      <Flex justifyContent={'center'} alignItems={'center'}>
        {/*<AddToBalanceForm />}*/}
        <PayForm />
      </Flex>
    </Box>
  );
}