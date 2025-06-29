import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { responsiveApiService } from "../apis/responsiveApi";
import type { SseResponse } from "../apis/_common/sseClient";
import doneIcon from "../assets/done.svg";
import processIcon from "../assets/proccess.svg";
import pendingIcon from "../assets/pending.svg";

interface StepData {
    id: number;
    label: string;
    response: string;
    isCompleted: boolean;
}

export const Assignment1Page: React.FC = () => {
    const navigate = useNavigate();
    const [steps, setSteps] = useState<StepData[]>([
        { id: 0, label: "H", response: "", isCompleted: false },
        { id: 1, label: "ello", response: "", isCompleted: false },
        { id: 2, label: "World!", response: "", isCompleted: false }
    ]);
    const [isProcessing, setIsProcessing] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    
    // 중복 연결 방지를 위한 ref
    const connectionRef = useRef<(() => void) | null>(null);
    const isConnectingRef = useRef(false);
    
    // 컴포넌트 인스턴스별 고유 ID 생성
    const instanceId = useRef(`assignment1-${Math.random().toString(36).substring(7)}`);

    const handleBack = () => {
        navigate('/');
    };

    const handleSseMessage = (data: SseResponse) => {
        const message = data.message;
        
        if (message === "Successfully Connected") {
            setIsConnected(true);
            return;
        }
        
        // 단계별 메시지 처리 - 함수형 업데이트로 최신 상태 사용
        setSteps(prevSteps => {
            const nextStepIndex = prevSteps.findIndex(step => !step.isCompleted);
            
            if (nextStepIndex !== -1 && nextStepIndex < prevSteps.length) {
                return prevSteps.map((step, index) => 
                    index === nextStepIndex 
                        ? { ...step, response: message, isCompleted: true }
                        : step
                );
            }
            return prevSteps;
        });
        
        // complete 필드가 true면 처리 완료
        if (data.complete) {
            setIsProcessing(false);
        }
    };

    // SSE 에러 처리
    const handleSseError = (error: Event) => {
        setError('서버 연결에 실패했습니다.');
        setIsProcessing(false);
        isConnectingRef.current = false;
    };

    // SSE 완료 처리
    const handleSseComplete = () => {
        setIsProcessing(false);
        isConnectingRef.current = false;
    };

    // SSE 연결 상태 관리
    useEffect(() => {
        const connectToSSE = async () => {
            // 이미 연결 중이거나 연결된 상태면 중복 연결 방지
            if (isConnectingRef.current || connectionRef.current) {
                return;
            }

            isConnectingRef.current = true;
            
            try {
                const disconnect = await responsiveApiService.connectToGreeting({
                    onMessage: handleSseMessage,
                    onError: handleSseError,
                    onComplete: handleSseComplete
                }, instanceId.current);
                
                connectionRef.current = disconnect;
            } catch (error) {
                setError('연결에 실패했습니다.');
                setIsProcessing(false);
                isConnectingRef.current = false;
            }
        };

        connectToSSE();

        // 컴포넌트 언마운트 시 연결 해제
        return () => {
            if (connectionRef.current) {
                connectionRef.current();
                connectionRef.current = null;
            }
            isConnectingRef.current = false;
        };
    }, []); // 빈 의존성 배열로 한 번만 실행

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
                        <span className="text-[#eeeeee] text-2xl font-semibold">RESPONSIVE API</span>
                    </div>
                </div>

                {/* 중앙: 내용 */}
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-full max-w-[1200px] p-8">
                        {/* 상태 텍스트 */}
                        <div className="text-[#eeeeee] text-2xl text-center font-medium mb-4">
                            {error ? (
                                <span className="text-red-400">오류: {error}</span>
                            ) : isProcessing ? (
                                `처리 중이에요 (${steps.filter(step => step.isCompleted).length}/${steps.length})`
                            ) : (
                                "처리가 완료되었어요"
                            )}
                        </div>

                        {/* Stepper */}
                        <div className="flex gap-8 mb-4">
                            {steps.map((step, index) => {
                                const isCurrentStep = !step.isCompleted && 
                                    steps.slice(0, index).every(s => s.isCompleted);
                                
                                return (
                                    <div key={step.id} className="flex flex-col flex-1">
                                        <div 
                                            className={`w-full h-1 rounded-full mb-2 transition-all duration-500 ${
                                                step.isCompleted ? 'bg-[#eeeeee]' : 'bg-gray-700'
                                            }`}
                                        ></div>
                                        
                                        {/* 아이콘과 메시지 */}
                                        <div className="flex items-center gap-2">
                                            <img 
                                                src={
                                                    step.isCompleted 
                                                        ? doneIcon 
                                                        : isCurrentStep 
                                                            ? processIcon 
                                                            : pendingIcon
                                                }
                                                alt={
                                                    step.isCompleted 
                                                        ? "완료" 
                                                        : isCurrentStep 
                                                            ? "진행 중" 
                                                            : "대기 중"
                                                }
                                                className={`w-6 h-6 ${
                                                    isCurrentStep ? 'animate-pulse' : ''
                                                }`}
                                            />
                                            {step.isCompleted && (
                                                <span className="text-[#eeeeee] text-lg">
                                                    {step.response}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* 최종 결과 */}
                        <div className="text-[#eeeeee] text-4xl text-center font-medium">
                            {steps.map(step => step.response).join('')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 