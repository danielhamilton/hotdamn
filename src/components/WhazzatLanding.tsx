import React from "react";
import { Header } from "../components/Header"; // Make sure Header is exported from its file
import Footer from "../components/Footer"; // Make sure Footer is exported as default from its file
import { Poem } from "../app/components/Poem";

export function WhazzatLanding() {
  return (
    <div>
      <Header />
      <Poem />
      <Footer />
    </div>
  );
}
