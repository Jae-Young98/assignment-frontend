import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Header } from "../components/Header";

type ChatType = "JOIN" | "CHAT" | "LEAVE" | "NOTICE";
interface ChatMessage {
    type: ChatType;
    nickname: string;
    message: string;
    timestamp: string;
}

export const ChatRoomPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const wsRef = useRef<WebSocket | null>(null);
    const [toast, setToast] = useState<string | null>(null);
    const [toastVisible, setToastVisible] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    
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

        // 이미 연결된 WebSocket이 있으면 새로 연결하지 않음
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            return;
        }

        const ws = new WebSocket("ws://localhost:8080/api/ws/chat");
        wsRef.current = ws;

        ws.onopen = () => {
            const joinMessage = {
                type: "JOIN",
                nickname,
                message: "",
                timestamp: ""
            };
            ws.send(JSON.stringify(joinMessage));
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.type && data.nickname !== undefined && data.message !== undefined) {
                    setMessages((prev) => [...prev, data]);
                }
            } catch (e) {
                // 텍스트 응답(JOIN_SUCCESS 등) 처리
                if (event.data === "JOIN_SUCCESS") {
                    setToast("채팅방에 접속했어요");
                    setToastVisible(true);
                    setTimeout(() => setToastVisible(false), 800);
                    setTimeout(() => setToast(null), 1000);
                }
            }
        };

        ws.onclose = () => {
            setIsConnected(false);
        };

        ws.onerror = (err) => {
            setIsConnected(false);
        };

        return () => {
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.close();
            }
            wsRef.current = null;
        };
    }, [nickname, navigate]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // 메시지 전송 함수
    const sendMessage = () => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && inputValue.trim()) {
            const chatMsg = {
                type: "CHAT",
                nickname,
                message: inputValue,
                timestamp: ""
            };
            wsRef.current.send(JSON.stringify(chatMsg));
            setInputValue("");
        }
    };

    // 엔터로 메시지 전송
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    };

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

                <div className="text-gray-400 text-center mt-2">
                            닉네임: {nickname}
                        </div>
                {/* 채팅 영역 */}
                <div className="flex-1 flex flex-col p-8 items-center justify-center">
                    <div className="bg-[#1a1a1a] w-full max-w-[1200px] rounded-lg flex flex-col flex-1 p-4 mb-4 relative">
                        {/* 토스트 메시지 (중앙) */}
                        {toast && (
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 bg-opacity-80 text-white px-6 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-200 ${toastVisible ? 'opacity-100' : 'opacity-0'}`}>
                                {toast}
                            </div>
                        )}
                        {/* 채팅 메시지 리스트 */}
                        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto p-2">
                            {messages.map((msg, idx) => {
                                if (msg.type === "LEAVE" || msg.type === "NOTICE") {
                                    return (
                                        <div key={idx} className="text-center text-gray-400 text-xs my-2">
                                            {msg.message}
                                        </div>
                                    );
                                }
                                if (msg.type === "JOIN") {
                                    return null;
                                }
                                const isMine = msg.nickname === nickname;
                                return (
                                    <div
                                        key={idx}
                                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`rounded-xl px-4 py-2 max-w-[60%] break-words ${
                                                isMine
                                                    ? "bg-blue-500 text-white self-end"
                                                    : "bg-gray-700 text-white self-start"
                                            }`}
                                        >
                                            {!isMine && (
                                                <div className="text-xs text-gray-300 mb-1">{msg.nickname}</div>
                                            )}
                                            <div>{msg.message}</div>
                                            <div className="text-[10px] text-gray-300 text-right mt-1">
                                                {msg.timestamp && msg.timestamp.slice(11, 16)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                    {/* 메시지 입력 영역 */}
                    <div className="flex gap-4 w-full max-w-[1200px] mt-2">
                        <input
                            className="flex-1 h-12 px-4 rounded-lg border border-gray-400 bg-white text-gray-900 focus:outline-none"
                            placeholder="메시지"
                            disabled={!isConnected}
                            value={inputValue}
                            onChange={e => setInputValue(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                        />
                        <button
                            className={`px-6 py-2 rounded-lg text-lg font-semibold transition ${
                                isConnected 
                                    ? 'bg-[#3a3a3a] hover:bg-[#292929] text-gray-200'
                                    : 'bg-gray-500 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!isConnected}
                            onClick={sendMessage}
                        >
                            전송
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}; 