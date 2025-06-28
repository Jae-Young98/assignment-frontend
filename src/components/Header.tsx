import React from "react";
import logo from "../assets/logo.png";

export const Header: React.FC = () => (
    <div className="flex items-center justify-center gap-4">
        <div className="w-[150px] h-[150px] rounded-lg overflow-hidden">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
        </div>
        <div>
            <h1 className="text-[48px] font-bold text-[#eeeeee]">VISION SPACE ASSIGNMENTS</h1>
        </div>
    </div>
);