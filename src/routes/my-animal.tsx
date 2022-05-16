import React, { FC, useState, useEffect } from 'react';
import { Grid, Flex, Text, Button } from '@chakra-ui/react';
import { mintAnimalTokenContract, saleAnimalTokenAddress, saleAnimalTokenContract } from '../web3Config';
import MyAnimalCard, { IMyAnimalCard } from '../components/MyAnimalCard';

interface MyAnimalProps {
  account: String;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
  const [animalCardArray, setAnimalCardArray] = useState<IMyAnimalCard[]>();
  const [saleStatus, setSaleStatus] = useState<Boolean>(false);

  // 블록체인은 백엔드서버 보다 요청 및 응답속도가 느리기 떄문에 개선작업(리팩토링)이 필요.
  const getAnimalTokens = async() => {
    try {
      const balanceLength = await mintAnimalTokenContract.methods
        .balanceOf(account)
        .call();

      if (balanceLength === "0") return ;

      const tempAnimalCardArray: IMyAnimalCard[] = [];

      const response = await mintAnimalTokenContract.methods
        .getAnimalTokens(account)
        .call();

      response.map((v: IMyAnimalCard) => {
        tempAnimalCardArray.push({
          animalTokenId: v.animalTokenId,
          animalType: v.animalType,
          animalPrice: v.animalPrice,
        });
      });

      console.log(tempAnimalCardArray);
      
      setAnimalCardArray(tempAnimalCardArray);
    } catch (error) {
      console.error(error);
    }
  };

  const getIsApprovedForAll = async () => {
    try {
      const response = await mintAnimalTokenContract.methods
        .isApprovedForAll(account, saleAnimalTokenAddress)
        .call();

      if (response) {
        setSaleStatus(response);
      }
    } catch(error) {
      console.error(error);
    }
  }

  const onClickApproveToggle = async () => {
    try {
      if (!account) return;

      const response = await mintAnimalTokenContract.methods
        .setApprovalForAll(saleAnimalTokenAddress, !saleStatus)
        .send({ from: account });

      if (response.status) {
        setSaleStatus(!saleStatus);
      }
    } catch (error) {
      console.error(error);
    }

  }

  // useEffect(() => {}, []) 에서 []안의 값이 변할때 {} 실행 함.
  useEffect(() => {
    if (!account) return;

    getIsApprovedForAll();
    getAnimalTokens();
  }, [account]);

  // animalCardArray가 갱신되었을 때 console에 값 찍어줌
  // useEffect(() => {
  //   console.log(animalCardArray)
  // }, [animalCardArray]);

  return (
    <>
      <Flex alignItems="center">
        <Text display="inline-block">Sale Status : {saleStatus ? "True" : "False"}</Text>
        <Button 
          size="xs" 
          ml={2} 
          colorScheme={saleStatus ? "red" : "blue"} 
          onClick={onClickApproveToggle}
        >
          {saleStatus ? "Cancel" : "Approve"}
        </Button>
      </Flex>
      <Grid templateColumns="repeat(4, 1fr)" gap={8} mt={4}>
        {animalCardArray &&
          animalCardArray.map((v, i) => {
            return (
              <MyAnimalCard 
                key={i} 
                animalTokenId={v.animalTokenId} 
                animalType={v.animalType} 
                animalPrice={v.animalPrice} 
                saleStatus={saleStatus} 
                account={account}
              />
            );
          })}
      </Grid>
    </>
    
  );
};

export default MyAnimal;
