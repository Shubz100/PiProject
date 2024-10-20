'use client'

import React, { useEffect, useState } from 'react';
import { PrismaClient } from '@prisma/client';

// Define types for Pi user
interface PiUser {
  id: string;
  telegramId?: string;
  piAmount: number;
  preMarketPrice: number;
}

const PiTrader: React.FC = () => {
    const [user, setUser] = useState<PiUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch user data when component mounts
        const fetchUserData = async () => {
            try {
                const response = await fetch('/api/user', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    // You can pass any identifying information here
                    body: JSON.stringify({ /* user identification data */ }),
                });
                
                const data = await response.json();
                if (data.error) {
                    setError(data.error);
                } else {
                    setUser(data);
                }
            } catch (err) {
                setError('Failed to fetch user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
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
                <br />
                <br />
                <h2 className="text-4xl font-bold mt-4">$0.65/Pi</h2>
                {user && (
                    <p className="mt-4">Your Pi Balance: {user.piAmount}</p>
                )}
            </div>

            <div className="flex justify-center mt-8">
                <img
                    src="/api/placeholder/256/256"
                    alt="Placeholder image representing Pi Coin"
                    className="custom-purple rounded-full w-64 h-64"
                />
            </div>

            <div className="w-full flex justify-center mb-8">
                <button 
                    onClick={async () => {
                        try {
                            const response = await fetch('/api/sell-pi', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ userId: user?.id }),
                            });
                            const data = await response.json();
                            if (data.success) {
                                // Handle successful sale
                                setUser(data.updatedUser);
                            }
                        } catch (err) {
                            setError('Failed to process sale');
                        }
                    }}
                    className="custom-purple text-white text-2xl font-bold py-4 px-16 rounded-full mt-8"
                >
                    Sell Your Pi
                </button>
            </div>

            {/* Sliding Menu */}
            <div id="menu" className="hidden">
                <button onClick={toggleMenu} className="text-white close-button">Close</button>
                <ul>
                    <li><a href="index.html" className="text-white menu-item">Home</a></li>
                    <li><a href="#" className="text-white menu-item">Transaction History</a></li>
                    <li><a href="#" className="text-white menu-item">About</a></li>
                </ul>
            </div>
        </div>
    );
};

export default PiTrader;
