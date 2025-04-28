import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const ResetPassword = () => {
    const auth = useAuth();
    // Use apiClient from context if available, otherwise use regular axios
    const apiClient = auth?.apiClient || axios;
    
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1); // 1 = request reset, 2 = enter new password
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resetRequested, setResetRequested] = useState(false);

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // This API endpoint doesn't exist yet, will be implemented in backend
            await apiClient.post('/api/auth/request-reset', { email });
            setResetRequested(true);
            toast.success('Password reset link has been sent to your email');
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to request password reset');
            toast.error('Failed to request password reset');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);

        try {
            // This API endpoint doesn't exist yet, will be implemented in backend
            await apiClient.post('/api/auth/reset-password', {
                token,
                newPassword
            });
            toast.success('Password has been reset successfully');
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to reset password');
            toast.error('Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="h-20 w-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                            SS
                        </div>
                    </div>
                    <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                        Reset Password
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        {step === 1 
                            ? "Enter your email to receive password reset instructions" 
                            : "Enter your reset token and new password"}
                    </p>
                </div>
                
                {step === 1 ? (
                    <form className="mt-8 space-y-6" onSubmit={handleRequestReset}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                                <p className="font-medium">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                        
                        {resetRequested ? (
                            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-md">
                                <p className="font-medium">Check your email</p>
                                <p>If an account exists with that email, we've sent reset instructions.</p>
                                <button 
                                    type="button"
                                    onClick={() => setStep(2)}
                                    className="mt-2 text-sm font-medium text-green-600 hover:text-green-500"
                                >
                                    I have a reset token
                                </button>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
                                    <input
                                        id="email-address"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="you@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ease-in-out disabled:opacity-70"
                                    >
                                        {isLoading ? "Processing..." : "Request Reset Link"}
                                    </button>
                                </div>
                                
                                <div className="text-sm text-center">
                                    <button 
                                        type="button"
                                        onClick={() => setStep(2)}
                                        className="font-medium text-indigo-600 hover:text-indigo-500"
                                    >
                                        Already have a reset token?
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                ) : (
                    <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
                                <p className="font-medium">Error</p>
                                <p>{error}</p>
                            </div>
                        )}
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="reset-token" className="block text-sm font-medium text-gray-700">Reset Token</label>
                                <input
                                    id="reset-token"
                                    name="token"
                                    type="text"
                                    required
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter the token from your email"
                                    value={token}
                                    onChange={(e) => setToken(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">New Password</label>
                                <input
                                    id="new-password"
                                    name="newPassword"
                                    type="password"
                                    required
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Enter your new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                                <input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 ease-in-out disabled:opacity-70"
                            >
                                {isLoading ? "Processing..." : "Reset Password"}
                            </button>
                        </div>
                        
                        <div className="text-sm text-center">
                            <button 
                                type="button"
                                onClick={() => setStep(1)}
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Request a new reset token
                            </button>
                        </div>
                    </form>
                )}
                
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Remember your password?{' '}
                        <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword; 