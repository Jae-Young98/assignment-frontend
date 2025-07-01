import React from "react";

interface MenuButtonsProps {
    onMenuClick?: (label: string) => void;
}

const buttons = [
    { label: "RESPONSIVE API" },
    { label: "LIVE CHAT" },
    { label: "WEB RTC", disabled: true },
    { label: "MONITORING", disabled: true },
];

export const MenuButtons: React.FC<MenuButtonsProps> = ({ onMenuClick }) => (
    <div className="flex gap-4 justify-center max-w-[1200px] w-full">
        {buttons.map((btn) => (
        <button
            key={btn.label}
            className={`flex items-center gap-2 bg-[#292929] text-[#eeeeee] px-6 py-3 rounded-[4px] text-[24px] font-semibold transition ${btn.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#313131]'}`}
            onClick={() => !btn.disabled && onMenuClick?.(btn.label)}
            disabled={btn.disabled}
        >
            {btn.label}
            {/* 오른쪽 화살표 아이콘 */}
            <span className="ml-2">{" > "}</span>
        </button>
        ))}
    </div>
);