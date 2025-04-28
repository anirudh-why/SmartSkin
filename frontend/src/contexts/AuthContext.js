import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Create an API client instance with proper error handling
const apiClient = axios.create();

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
    response => response, 
    error => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [silentLoading, setSilentLoading] = useState(false); // Track silent background operations

    useEffect(() => {
        // Check for token in localStorage
        const token = localStorage.getItem('token');
        if (token) {
            verifyToken(token, true); // Silent verification on app load
        } else {
            setLoading(false);
        }
    }, []);

    // Set up axios interceptor to include the token in every request
    useEffect(() => {
        const interceptor = apiClient.interceptors.request.use(
            config => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        return () => {
            apiClient.interceptors.request.eject(interceptor);
        };
    }, []);

    const verifyToken = async (token, silent = false) => {
        if (silent) setSilentLoading(true);
        if (!silent) setLoading(true);
        
        try {
            const response = await apiClient.post('/api/auth/verify', { token });
            if (response.data.valid) {
                setUser(response.data.user);
                
                // Fetch additional user details after token verification
                try {
                    const profileData = await fetchUserProfile(true);
                    setUser(prevUser => ({
                        ...prevUser,
                        ...profileData
                    }));
                } catch (profileError) {
                    console.error('Error fetching profile after token verification:', profileError);
                }
            } else {
                localStorage.removeItem('token');
                if (!silent) toast.error("Session expired. Please login again.");
            }
        } catch (error) {
            console.error('Token verification error:', error);
            localStorage.removeItem('token');
            setError(error.response?.data?.error || 'Authentication error');
            
            if (!silent) toast.error("Failed to authenticate. Please login again.");
        } finally {
            setLoading(false);
            if (silent) setSilentLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await apiClient.post('/api/auth/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            await verifyToken(token);
            toast.success('Logged in successfully!');
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const register = async (email, password, name) => {
        try {
            const response = await apiClient.post('/api/auth/register', { email, password, name });
            const { token } = response.data;
            localStorage.setItem('token', token);
            await verifyToken(token);
            toast.success('Registration successful!');
            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Registration failed';
            setError(errorMessage);
            toast.error(errorMessage);
            return { success: false, error: errorMessage };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        toast.success('Logged out successfully');
    };

    const fetchUserProfile = async (silent = false) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            
            const response = await apiClient.get('/api/user/profile');
            
            if (response.data) {
                return response.data;
            } else {
                throw new Error('No profile data received');
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            // Only show toast if specifically requested and not a auth error
            if (!silent && error.response?.status !== 401) {
                toast.error('Failed to fetch profile data');
            }
            throw error;
        }
    };

    const updatePreferences = async (preferences) => {
        try {
            const response = await apiClient.put('/api/user/preferences', preferences);
            toast.success('Preferences updated');
            
            // Update the user state with new preferences
            setUser(prevUser => ({
                ...prevUser,
                preferences: preferences
            }));
            
            return response.data;
        } catch (error) {
            toast.error('Failed to update preferences');
            throw error;
        }
    };

    const fetchRoutines = async (silent = false) => {
        try {
            const response = await apiClient.get('/api/user/routines');
            return response.data.routines || [];
        } catch (error) {
            if (!silent) {
                toast.error('Failed to fetch routines');
            }
            console.error('Error fetching routines:', error);
            return [];
        }
    };

    const saveRoutine = async (routineData) => {
        try {
            const response = await apiClient.post('/api/user/routines', routineData);
            toast.success('Routine saved successfully');
            return response.data;
        } catch (error) {
            toast.error('Failed to save routine');
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading: loading || silentLoading,
            error,
            login,
            register,
            logout,
            isAuthenticated: !!user,
            fetchUserProfile,
            updatePreferences,
            fetchRoutines,
            saveRoutine,
            apiClient
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 