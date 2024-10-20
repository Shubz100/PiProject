'use client'

import React, { useEffect, useState } from 'react';
import { WebApp } from '@twa-dev/types'

// Update interface to match your schema
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

    useEffect(() => {
        const initializeTelegram = async () => {
            if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
                const tg = window.Telegram.WebApp;
                tg.ready();

                const initDataUnsafe = tg.initDataUnsafe || {};

                if (initDataUnsafe.user) {
                    try {
                        console.log('Sending user data:', initDataUnsafe.user); // Debug log
                        const response = await fetch('/api/user', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                id: initDataUnsafe.user.id, // Match the expected format in route.ts
                                username: initDataUnsafe.user.username,
                                first_name: initDataUnsafe.user.first_name, // Match the snake_case format
                                last_name: initDataUnsafe.user.last_name
                            }),
                        });
                        
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        
                        const data = await response.json();
                        console.log('Received response:', data); // Debug log
                        
                        if (data.error) {
                            setError(data.error);
                        } else {
                            setUser(data);
                        }
                    } catch (err) {
                        console.error('Error:', err); // Debug log
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

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="bg-gray-100 flex flex-col items-center justify-between min-h-screen">
            <div className="w-full custom-purple text-white p-4 flex items-center justify-between">
                <button onClick={toggleMenu}>
                    <i className="fas fa-bars text-2xl"></i>
                </button>
                <h1 className="text-2xl font-bold">Pi Trader Official</h1>
                <div></div>
            </div>
            
            <div className="text-center mt-4">
                <p className="custom-purple-text">
                    Pi Coin has not launched. This is the premarket price set by our team and does not represent Official data
                </p>
                {user && (
                    <div className="mt-4">
                        <p>Welcome, {user.firstName || 'User'}!</p>
                        <p>Points: {user.points}</p>
                    </div>
                )}
                <br />
                <h2 className="text-4xl font-bold mt-4">$0.65/Pi</h2>
            </div>

            {/* Rest of your component remains the same */}
        </div>
    );
};

export default PiTrader;
