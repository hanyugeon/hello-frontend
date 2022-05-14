import React, { FC } from 'react';

interface MyAnimalProps {
  account: String;
}

const MyAnimal: FC<MyAnimalProps> = () => {
  return (
    <div>My Animal</div>
  );
};

export default MyAnimal;
