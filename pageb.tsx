import React, { useState } from 'react';
import './pageb.css'; // Import the CSS file

const PageB: React.FC = () => {
    const [uid, setUid] = useState('');
    const [isValid, setIsValid] = useState(true);

    // Function to validate UID
    const validateUID = (value: string) => {
        const trimmedValue = value.trim();
        const isValidUID = /^\d+$/.test(trimmedValue); // Check if the value is a positive integer
        setIsValid(trimmedValue !== '' && isValidUID);
        setUid(trimmedValue);
    };

    // Handle Next button click
    const handleNextClick = () => {
        if (isValid) {
            window.location.href = 'page3.html'; // Redirect to page3.html
        }
    };

    return (
        <div className="bg-gray-100 flex flex-col items-center justify-start min-h-screen">
            <div className="w-full bg-custom-purple py-8">
                <h1 className="text-center text-white text-4xl font-bold">Pi Trader</h1>
            </div>
            <div className="flex flex-col items-center justify-center flex-grow mt-6">
                <p className="text-red-600 text-xl font-bold mb-4">Re-Check Your Binance UID before Proceeding</p>
                <p className="text-black text-3xl font-bold mt-6">Enter Your Binance UID here</p>
                <input
                    id="binance-uid"
                    type="text"
                    placeholder="Binance UID"
                    className="mt-4 p-4 border-2 border-black rounded w-3/4 max-w-md placeholder-opacity-50 placeholder-black"
                    value={uid}
                    onChange={(e) => validateUID(e.target.value)}
                />
                {!isValid && <p id="error-message" className="text-red-600 mt-2">Binance UID invalid</p>}
            </div>
            <div className="mt-10 mb-10">
                <button
                    id="next-button"
                    className="bg-custom-purple text-white text-2xl font-bold py-2 px-8 rounded-full"
                    disabled={!isValid}
                    onClick={handleNextClick}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default PageB;
