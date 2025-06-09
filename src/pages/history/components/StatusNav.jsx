import { useState, useEffect } from "react";

function StatusButton({ name, isActive, onClick }) {
    return (
        <button
            onClick={() => onClick(name)}
            className={`
                flex-shrink-0 rounded-full px-4 py-1 font-poppins
                transition-all duration-300
                ${
                    isActive
                    ? 'bg-[#03081F] text-white font-semibold'
                    : 'text-white hover:bg-[#03081F]/20 font-semibold'
                }
                text-sm sm:text-base md:text-lg whitespace-nowarp
            `}
        >
            {name}
        </button>
    );
}

function StatusNav ({ onStatusClick, activeStatus: externalActiveStatus }) {
    const [localActiveStatus, setLocalActiveStatus] = useState('Belum diproses');

    useEffect(() => {
        if (externalActiveStatus) {
            setLocalActiveStatus(externalActiveStatus);
        }
    }, [externalActiveStatus]);

    const status = [
        { name: 'Belum diproses' },
        { name: 'Diproses' },
        { name: 'Selesai' },
        { name: 'Dibatalkan' },
    ];

    const handleStatusClick = (statusName) => {
        setLocalActiveStatus(statusName);
        if (onStatusClick) {
            onStatusClick(statusName);
        }
    };

    return (
        <div className="fixed top-16 left-0 right-0">
            <div className="w-full px-8 my-4 overflow-x-auto custom-scrollbar">
                <div className="container mx-auto flex justify-center">
                    <div className="min-w-max h-16 bg-gradient-to-r from-[#FC8A06] to-[#FF6B35] rounded-full flex items-center px-6 py-4 space-x-16">
                        {status.map((status, index) => (
                            <StatusButton
                                key={index}
                                name={status.name}
                                isActive={localActiveStatus === status.name}
                                onClick={handleStatusClick}
                            />
                        ))}
                    </div>
                </div>
                <style>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        height: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #f1f1f1;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #FC8A06;
                        border-radius: 10px;
                    }
                `}</style>
            </div>
        </div>
    );
}

export default StatusNav;