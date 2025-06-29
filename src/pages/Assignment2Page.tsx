import React from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { NicknameInput } from "../components/NicknameInput";

export const Assignment2Page: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate('/');
    };

    const handleEnter = (nickname: string) => {
        // 채팅방 페이지로 이동 (state로 닉네임 전달)
        navigate('/chat', { state: { nickname } });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center">
            <Header />
            <div className="bg-[#181818] w-full h-[500px] flex flex-col">
                {/* 상단: 뒤로가기 + 제목 */}
                <div className="flex items-center justify-center">
                    <div className="flex w-full max-w-[1200px] items-center gap-4 p-8">
                        <span 
                            className="text-[#eeeeee] text-2xl cursor-pointer hover:text-gray-300 transition"
                            onClick={handleBack}>
                        &#8592;
                        </span>
                        <span className="text-[#eeeeee] text-2xl font-semibold">LIVE CHAT</span>
                    </div>
                </div>

                <NicknameInput onEnter={handleEnter} />
            </div>
        </div>
    );
};