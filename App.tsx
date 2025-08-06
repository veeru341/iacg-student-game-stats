import React, { useState, useCallback } from 'react';
import Login from './components/Login.tsx';
import Dashboard from './components/Dashboard.tsx';

const App: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLoginSuccess = useCallback(() => {
        setIsLoggedIn(true);
    }, []);

    const handleLogout = useCallback(() => {
        setIsLoggedIn(false);
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 font-sans">
            {isLoggedIn ? (
                <Dashboard onLogout={handleLogout} />
            ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
            )}
        </div>
    );
};

export default App;