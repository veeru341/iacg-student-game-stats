import React, { useState } from 'react';
import { UserIcon, LockIcon, SparklesIcon } from './Icons.tsx';
import { EyeIcon } from './Icons.tsx';

interface LoginProps {
    onLoginSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Static credentials
        if (username === 'admin' && password === 'iacg@1605') {
            setError('');
            onLoginSuccess();
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
            <div className="w-full max-w-md">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl shadow-yellow-400/10 p-8 space-y-8">
                    <div className="text-center space-y-2">
                        <div className="flex justify-center items-center gap-2">
                            <img src="/assets/images/IACG.png" alt="IACG Logo" className="h-16 w-auto" />
                        </div>
                        <p className="text-gray-400">IACG Students Game Stats</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <UserIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-4 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pr-4 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <div className="relative">
                            <LockIcon className="w-5 h-5 text-gray-400 absolute top-1/2 left-4 -translate-y-1/2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 pr-12 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400 hover:text-yellow-400 focus:outline-none"
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <EyeIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-yellow-400 text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-500 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-yellow-400"
                        >
                            LOGIN
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;