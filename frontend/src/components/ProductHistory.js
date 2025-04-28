import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const ProductHistory = ({ limit = 5 }) => {
    const { apiClient, isAuthenticated } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [isAuthenticated]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(`/api/user/history?limit=${limit}`);
            setHistory(response.data.product_history || []);
        } catch (err) {
            console.error('Error fetching product history:', err);
            setError('Failed to load your product history.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return null;
    }

    if (loading) {
        return (
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-200 rounded w-full mb-2"></div>
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-sm">{error}</div>;
    }

    if (history.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700">Recently Viewed Products</h3>
                <p className="text-xs text-gray-500 mt-2">You haven't viewed any products yet.</p>
            </div>
        );
    }

    // Format the date to be more readable
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Recently Viewed Products</h3>
            <div className="space-y-2">
                {history.map((item, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded-md">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
                                <p className="text-xs text-gray-500">{item.category}</p>
                            </div>
                            {item.last_viewed && (
                                <span className="text-xs text-gray-400">
                                    {formatDate(item.last_viewed)}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductHistory; 