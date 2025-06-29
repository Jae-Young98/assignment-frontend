import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { MenuButtons } from "../components/MenuButtons";

export const HomePage: React.FC = () => {
    const navigate = useNavigate();

    const handleMenuClick = (label: string) => {
        if (label === "RESPONSIVE API") {
            navigate('/assignment/1');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
            <Header />
            <div className="w-full bg-[#181818] h-[500px] flex items-center justify-center">
                <MenuButtons onMenuClick={handleMenuClick} />
            </div>
        </div>
    );
};