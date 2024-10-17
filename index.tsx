import React, { useState } from 'react';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <div className="w-full custom-purple text-white p-4 flex items-center justify-between">
        <button onClick={toggleMenu}>
          <i className="fas fa-bars text-2xl"></i>
        </button>
        <h1 className="text-2xl font-bold">Pi Traders</h1>
        <div></div>
      </div>
      <div className="text-center mt-4">
        <p className="custom-purple-text">
          Pi Coin has not launched. This is the premarket price set by our team and does not represent Official data
        </p>
        <br />
        <br />
        <h2 className="text-4xl font-bold mt-4">$0.65/Pi</h2>
      </div>
      <div className="flex justify-center mt-8">
        <img
          src="https://storage.googleapis.com/a1aa/image/nHtKiYEJNtYhCFGEdd2czOW74EMguRulx5F4Ve6ewjWmxanTA.jpg"
          alt="Placeholder image representing Pi Coin"
          className="custom-purple rounded-full w-64 h-64"
          width="256"
          height="256"
        />
      </div>
      <div className="w-full flex justify-center mb-8">
        <a href="Page2.html">
          <button className="custom-purple text-white text-2xl font-bold py-4 px-16 rounded-full mt-8">
            Sell Your Pi
          </button>
        </a>
      </div>

      {/* Sliding Menu */}
      <div id="menu" className={menuOpen ? 'open' : ''}>
        <button onClick={toggleMenu} className="text-white close-button">
          Close
        </button>
        <ul>
          <li>
            <a href="index.html" className="text-white menu-item">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-white menu-item">
              Transaction History
            </a>
          </li>
          <li>
            <a href="#" className="text-white menu-item">
              About
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default App;
