import React, { FC, useState, useEffect } from 'react';
import { Grid } from '@chakra-ui/react';
import { mintAnimalTokenContract } from '../web3Config';
import AnimalCard from '../components/AnimalCard';

interface MyAnimalProps {
  account: String;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
  const [animalCardArray, setAnimalCardArray] = useState<String[]>();

  const getAnimalTokens = async() => {
    try {
      const balanceLength = await mintAnimalTokenContract.methods
        .balanceOf(account)
        .call();

      const tempAnimalCardArray = [];

      for (let i = 0; i < parseInt(balanceLength, 10); i++) {
        const animalTokenId = await mintAnimalTokenContract.methods
          .tokenOfOwnerByIndex(account, i)
          .call();

        const animalType = await mintAnimalTokenContract.methods
          .animalTypes(animalTokenId)
          .call();

        tempAnimalCardArray.push(animalType);
      }

      setAnimalCardArray(tempAnimalCardArray);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(() => {}, []) 에서 []안의 값이 변할때 {} 실행 함.
  useEffect(() => {
    if (!account) return;

    getAnimalTokens()
  }, [account]);

  // animalCardArray가 갱신되었을 때 console에 값 찍어줌
  // useEffect(() => {
  //   console.log(animalCardArray)
  // }, [animalCardArray]);

  return (
    <Grid templateColumns="repeat(4, 1fr)" gap={8}>
      {
        animalCardArray && animalCardArray.map((v, i) => {
          return <AnimalCard key={i} animalType={v}/>
        })
      }
    </Grid>
  );
};

export default MyAnimal;
