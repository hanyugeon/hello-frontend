import React, { FC, useState } from 'react';
import { Box, Text, Flex, Button } from '@chakra-ui/react';
import { mintAnimalTokenContract } from '../web3Config';
import AnimalCard from "../components/AnimalCard"

interface MainProps {
  account: String;
}

const Main: FC<MainProps> = ({ account }) => {
  const [newAnimalType, setNewAnimalType] = useState<String>();

  const onClickMint = async () => {
    try {
      if (!account) return;

      const response = await mintAnimalTokenContract.methods
        .mintAnimalToken()
        .send({ from: account });

      if (response.status) {
        // blanceOf()에 address 넣어주기 
        const balanceLength = await mintAnimalTokenContract.methods
          .balanceOf(account)
          .call()

        // tokenOfOwnerByIndex는 remixIDE를 참고하면 2가지 인자를 받는다 (account 주소, index 값)
        const animalTokenID = await mintAnimalTokenContract.methods
          .tokenOfOwnerByIndex(account, parseInt(balanceLength, 10) - 1)
          .call()

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
