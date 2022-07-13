import React, { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MyAnimal from "./routes/my-animal";
import Main from "./routes/main";

const App: FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="my-animal" element={<MyAnimal />}/>
        </Routes>
      </Layout>
    </BrowserRouter>
  )
};

export default App;
