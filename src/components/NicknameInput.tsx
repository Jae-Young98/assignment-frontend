import React, { useState, useEffect, useRef } from "react";
import { checkNickname, type NicknameCheckResponse } from "../apis/ChatRooms";

interface NicknameInputProps {
    onEnter: (nickname: string) => void;
}

export const NicknameInput: React.FC<NicknameInputProps> = ({ onEnter }) => {
    const [nickname, setNickname] = useState("");
    const [error, setError] = useState<string>("");
    const [isChecking, setIsChecking] = useState(false);
    const [checkResult, setCheckResult] = useState<NicknameCheckResponse | null>(null);
    
    // 디바운싱을 위한 타이머 ref
    const debounceTimerRef = useRef<number | null>(null);

    // 실시간 닉네임 중복체크
    const handleNicknameCheck = async (inputNickname: string) => {
        if (!inputNickname || inputNickname.length < 1) {
            setCheckResult(null);
            setError("");
            return;
        }

        setIsChecking(true);
        setError("");

        try {
            const result = await checkNickname(inputNickname);
            setCheckResult(result);
            
            if (!result.available) {
                setError(result.message);
            } else {
                setError("");
            }
        } catch (error) {
            setError("오류가 발생했습니다.");
            setCheckResult(null);
        } finally {
            setIsChecking(false);
        }
    };

    // 디바운싱된 닉네임 체크
    const debouncedNicknameCheck = (inputNickname: string) => {
        // 이전 타이머가 있으면 취소
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // 500ms 후에 체크 실행
        debounceTimerRef.current = window.setTimeout(() => {
            handleNicknameCheck(inputNickname);
        }, 500);
    };

    // 입력값 변경 처리
    const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNickname(value);
        
        // 모든 입력에 대해 체크 (1글자 미만도 포함)
        debouncedNicknameCheck(value);
    };

    const handleEnter = () => {
        if (!nickname || nickname.length < 1) {
            setError("닉네임을 입력해주세요");
            return;
        }

        if (checkResult && !checkResult.available) {
            setError("사용할 수 없는 닉네임이에요");
            return;
        }

        if (isChecking) {
            setError("닉네임 확인 중입니다. 잠시만 기다려주세요.");
            return;
        }

        setError("");
        onEnter(nickname);
    };

    // 컴포넌트 언마운트 시 타이머 정리
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center justify-center">
            {/* 상태 텍스트 */}
            <div className="text-white text-2xl font-medium mb-4">
                채팅방에서 사용할 이름을 입력해 주세요
            </div>
            {/* 입력창 + 버튼 */}
            <div className="flex items-center gap-4 mb-2">
                <input
                    className="w-80 h-12 px-4 rounded-lg border border-gray-400 bg-white text-gray-900 text-lg focus:outline-none"
                    value={nickname}
                    onChange={handleNicknameChange}
                    placeholder="닉네임"
                    maxLength={16}
                />
                <button
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-xl font-semibold transition ${
                        isChecking || !checkResult || !checkResult.available
                            ? 'bg-gray-500 text-gray-400 cursor-not-allowed'
                            : 'bg-[#3a3a3a] hover:bg-[#292929] text-gray-200 cursor-pointer'
                    }`}
                    onClick={handleEnter}
                    disabled={isChecking || !checkResult || !checkResult.available}
                >
                    입장
                </button>
            </div>
            {/* 상태 메시지 */}
            <div className="text-base mt-2 min-h-[20px]">
                {nickname.length > 0 && checkResult && checkResult.available && (
                    <div className="text-[#eeeeee]">{checkResult.message}</div>
                )}
                {error && (
                    <div className="text-red-400">{error}</div>
                )}
            </div>
        </div>
    );
}; 