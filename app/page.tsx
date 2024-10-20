'use client'

import React, { useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/types'

interface User {
  id: string;
  telegramId: number;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  points: number;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

const PiTrader: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showSellConfirmation, setShowSellConfirmation] = useState(false);

    useEffect(() => {
        const initializeTelegram = async () => {
            if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                const tg = window.Telegram.WebApp;
                tg.ready();

                const initDataUnsafe = tg.initDataUnsafe || {};

                if (initDataUnsafe.user) {
                    try {
                        const response = await fetch('/api/user', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: initDataUnsafe.user.id,
                                username: initDataUnsafe.user.username,
                                first_name: initDataUnsafe.user.first_name,
                                last_name: initDataUnsafe.user.last_name
                            }),
                        });
                        
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        if (data.error) {
                            setError(data.error);
                        } else {
                            setUser(data);
                        }
                    } catch (err) {
                        console.error('Error:', err);
                        setError('Failed to fetch user data');
                    }
                } else {
                    setError('No user data available');
                }
            } else {
                setError('This app should be opened in Telegram');
            }
            setLoading(false);
        };

        initializeTelegram();
    }, []);

    const toggleMenu = () => {
        const menu = document.getElementById('menu');
        if (menu) {
            menu.classList.toggle('hidden');
        }
    };

    const handleSellPi = async () => {
        if (!user) return;
        
        try {
            const response = await fetch('/api/sell-pi', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: user.id }),
            });
            
            const data = await response.json();
            if (data.success) {
                setUser(data.updatedUser);
                setShowSellConfirmation(true);
                setTimeout(() => setShowSellConfirmation(false), 3000);
            } else {
                setError('Failed to process sale');
            }
        } catch (err) {
            setError('Failed to process sale');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <h2 className="text-red-500 text-xl font-bold mb-4">Error</h2>
                    <p className="text-gray-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 flex flex-col items-center justify-between min-h-screen">
            {/* Header */}
            <div className="w-full bg-purple-600 text-white p-4 flex items-center justify-between fixed top-0 z-50">
                <button 
                    onClick={toggleMenu}
                    className="text-2xl hover:bg-purple-700 p-2 rounded transition-colors"
                    aria-label="Toggle menu"
                >
                    ☰
                </button>
                <h1 className="text-2xl font-bold">Pi Trader Official</h1>
                <div className="w-8"></div> {/* Spacer for balance */}
            </div>

            {/* Main Content */}
            <div className="flex-1 w-full max-w-4xl mx-auto px-4 pt-20 pb-24">
                {/* Warning Banner */}
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r">
                    <p className="text-yellow-700">
                        Pi Coin has not launched. This is the premarket price set by our team and does not represent Official data.
                    </p>
                </div>

                {/* User Info */}
                {user && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">
                            Welcome, {user.firstName || 'User'}!
                        </h2>
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600">Your Points:</p>
                            <p className="text-3xl font-bold text-purple-600">{user.points}</p>
                        </div>
                    </div>
                )}

                {/* Price Display */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8 text-center">
                    <h3 className="text-gray-600 mb-2">Current Pi Price</h3>
                    <div className="text-5xl font-bold text-purple-600 mb-4">$0.65</div>
                    <p className="text-sm text-gray-500">Pre-market value</p>
                </div>

                {/* Pi Logo */}
                <div className="flex justify-center mb-8">
                    <div className="w-48 h-48 bg-purple-600 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                        <span className="text-white text-8xl">π</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-4">
                    <button 
                        onClick={handleSellPi}
                        className="bg-purple-600 text-white text-xl font-bold py-4 px-8 rounded-full hover:bg-purple-700 transition-colors shadow-md transform hover:scale-105 transition-all"
                    >
                        Sell Your Pi
                    </button>
                    
                    <button 
                        onClick={() => window.open('https://t.me/your_telegram_bot', '_blank')}
                        className="bg-blue-500 text-white text-xl font-bold py-4 px-8 rounded-full hover:bg-blue-600 transition-colors shadow-md"
                    >
                        Contact Support
                    </button>
                </div>
            </div>

            {/* Sliding Menu */}
            <div 
                id="menu" 
                className="fixed top-0 left-0 h-full w-72 bg-purple-600 text-white transform -translate-x-full transition-transform duration-300 ease-in-out hidden z-50"
            >
                <div className="p-6">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Menu</h2>
                        <button 
                            onClick={toggleMenu}
                            className="text-white text-2xl hover:bg-purple-700 p-2 rounded transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                    
                    <nav>
                        <ul className="space-y-4">
                            <li>
                                <a href="/" className="block py-3 px-4 hover:bg-purple-700 rounded-lg transition-colors">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block py-3 px-4 hover:bg-purple-700 rounded-lg transition-colors">
                                    Transaction History
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block py-3 px-4 hover:bg-purple-700 rounded-lg transition-colors">
                                    About
                                </a>
                            </li>
                            <li>
                                <a href="#" className="block py-3 px-4 hover:bg-purple-700 rounded-lg transition-colors">
                                    Settings
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Sale Confirmation Toast */}
            {showSellConfirmation && (
                <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in-up">
                    Pi sale processed successfully!
                </div>
            )}

            {/* Footer */}
            <footer className="w-full bg-purple-600 text-white py-4 text-center">
                <p className="text-sm">© 2024 Pi Trader Official. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default PiTrader;
