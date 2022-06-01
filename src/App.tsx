import React, { FC, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MyAnimal from "./routes/my-animal";
import Main from "./routes/main";

const App: FC = () => {
  const [account, setAccount] = useState<string>("");
  
  const getAccount = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        }); // account가 갖는 값: MetaMask 계정의 주소
        
        console.log(accounts);

        setAccount(accounts[0]);
      } else {
        alert("Install Metamask");
      }
    } catch(error) {
      console.error(error);
    }
  }
  
  useEffect(() => {
    console.log(account);
    getAccount();
  }, [account]);

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Main account={account}/>} />
          <Route path="my-animal" element={<MyAnimal account={account}/>}/>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
};

export default App;
