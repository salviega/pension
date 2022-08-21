import "./App.scss";
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Header } from "../../shared/Header";
import { Footer } from "../../shared/Footer";
import { PensionWallet } from "../PensionWallet";
import { PensionHome } from "../PensionHome";
import { PensionMyPension } from "../PensionMyPension";
import { PensionAbout } from "../PensionAbout";
import { PensionRegister } from "../PensionRegister";
import { PensionContribute } from "../PensionContribute";

function App() {
  return (
    <React.Fragment>
      <Header>
        <PensionWallet />
      </Header>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<PensionHome />} />
            <Route path="/about" element={<PensionAbout />} />
            <Route path="/mypension" element={<PensionMyPension />} />
            <Route path="/contribute" element={<PensionContribute />} />
            <Route path="/register" element={<PensionRegister />} />
          </Routes>
        </BrowserRouter>
      </main>
      <Footer />
    </React.Fragment>
  );
}

export { App };
