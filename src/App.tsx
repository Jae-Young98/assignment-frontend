import React from "react";
import { Header } from "./components/Header";
import { MenuButtons } from "./components/MenuButtons";
// import { StepperSection } from "./components/StepperSection";

const App: React.FC = () => (
  <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
    <Header />
    <div className="w-full bg-[#181818] h-[500px] flex items-center justify-center">
      <MenuButtons />
      {/* <StepperSection /> */}
    </div>
  </div>
);

export default App;