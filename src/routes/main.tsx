import React, { FC, useState } from 'react';
import { Box, Text, Flex, Button } from '@chakra-ui/react';
import { mintAnimalTokenContract } from '../web3Config';
import AnimalCard from "../components/AnimalCard"

interface MainProps {
  account: string;
}

const Main: FC<MainProps> = ({ account }) => {
  const [newAnimalType, setNewAnimalType] = useState<string>();

  const onClickMint = async () => {
    try {
      console.log(!account);
      if (!account) return ;

      const response = await mintAnimalTokenContract.methods
        .mintAnimalToken()
        .send({ from: account });

      console.log(response.status);
      console.log(response);
      if (response.status) {
        const balanceLength = await mintAnimalTokenContract.methods
          .balanceOf(account)
          .call();

        const animalTokenID = await mintAnimalTokenContract.methods
          .tokenOfOwnerByIndex(account, parseInt(balanceLength, 10) - 1)
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
    </Flex>
  )
}

export default Main;
