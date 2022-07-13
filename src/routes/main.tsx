import React, { FC, useState, useEffect } from 'react';
import { Box, Text, Flex, Button } from '@chakra-ui/react';
import { mintAnimalTokenContract } from '../web3Config';
import AnimalCard from "../components/AnimalCard"
import { useWallet } from 'use-wallet';

const Main: FC = () => {
  const wallet = useWallet();

  const [walletStatus, setWalletStatus] = useState<boolean>(false);
  const [newAnimalType, setNewAnimalType] = useState<string>();

  const getWalletStatus = () => {
    if (wallet.status === 'connected') {
      setWalletStatus(true);
    } else {
      setWalletStatus(false);
    }
  }

  const onClickMint = async () => {
    try {
      if (!walletStatus) return ;

      const response = await mintAnimalTokenContract.methods
        .mintAnimalToken()
        .send({ from: wallet.account });

      if (response.status) {
        const balanceLength = await mintAnimalTokenContract.methods
          .balanceOf(wallet.account)
          .call();

        const animalTokenID = await mintAnimalTokenContract.methods
          .tokenOfOwnerByIndex(wallet.account, parseInt(balanceLength, 10) - 1)
          .call();

        const animalType = await mintAnimalTokenContract.methods
          .animalTypes(animalTokenID)
          .call();

        setNewAnimalType(animalType);
      }

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWalletStatus();
    console.log(newAnimalType);
  }, [wallet.status, newAnimalType]);

  return (
    <Flex 
      w="full" 
      h="100vh" 
      justifyContent="center" 
      alignItems="center" 
      direction="column"
    >
      <Box>
        {newAnimalType ? (
          <AnimalCard animalType={newAnimalType} />
        ) : (
          <Text>Let's Mint Animal Card</Text>
        )}
      </Box>
      <Button mt={4} size="sm" colorScheme="blue" onClick={onClickMint}>Mint</Button>
      <Text>
        {wallet.status === 'connected' ? (
          `${wallet.account}`
        ) : (
          "please install metamask wallet"
        )}
      </Text>
      <Button onClick={walletStatus ? (
          () => wallet.reset()
        ) : (
          () => wallet.connect()
        )}>
          {walletStatus ? 'disconnect' : 'Connect MetaMask Wallet'}
      </Button>
    </Flex>
  )
}

export default Main;
