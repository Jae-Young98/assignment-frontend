import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

export const ChatRoomPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(false);
    
    // state에서 닉네임 가져오기
    const nickname = location.state?.nickname;

    const handleBack = () => {
        navigate('/assignment/2');
    };

    useEffect(() => {
        if (!nickname) {
            navigate('/assignment/2');
            return;
        }

        // TODO: 웹소켓 연결 로직 구현
        console.log(`채팅방 입장: ${nickname}`);
        setIsConnected(true);
    }, [nickname, navigate]);

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
            <Header />
            <div className="bg-[#181818] flex-1 flex flex-col">
                {/* 상단: 뒤로가기 + 제목 + 연결 상태 */}
                <div className="flex items-center justify-center">
                    <div className="flex w-full max-w-[1200px] items-center gap-4 p-8">
                        <span 
                            className="text-[#eeeeee] text-2xl cursor-pointer hover:text-gray-300 transition"
                            onClick={handleBack}>
                        &#8592;
                        </span>
                        <span className="text-[#eeeeee] text-2xl font-semibold">LIVE CHAT</span>
                        <div className="ml-auto flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
                            <span className="text-[#eeeeee] text-sm">
                                {isConnected ? '연결됨' : '연결 중...'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* 채팅 영역 */}
                <div className="flex-1 flex flex-col p-8">
                    <div className="bg-[#1a1a1a] rounded-lg flex-1 p-4 mb-4">
                        <div className="text-[#eeeeee] text-center text-lg">
                            TODO 채팅 페이지 추가
                        </div>
                        <div className="text-gray-400 text-center mt-2">
                            닉네임: {nickname}
                        </div>
                    </div>
                    
                    {/* 메시지 입력 영역 */}
                    <div className="flex gap-4">
                        <input
                            className="flex-1 h-12 px-4 rounded-lg border border-gray-400 bg-white text-gray-900 focus:outline-none"
                            placeholder="메시지를 입력하세요..."
                            disabled={!isConnected}
                        />
                        <button
                            className={`px-6 py-2 rounded-lg text-lg font-semibold transition ${
                                isConnected 
                                    ? 'bg-[#3a3a3a] hover:bg-[#292929] text-gray-200'
                                    : 'bg-gray-500 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!isConnected}
                        >
                            전송
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 