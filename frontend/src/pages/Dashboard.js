import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import ProductHistory from '../components/ProductHistory';

const Dashboard = () => {
    const { user, fetchUserProfile, fetchRoutines } = useAuth();
    const [profile, setProfile] = useState(null);
    const [routines, setRoutines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingError, setLoadingError] = useState(false);
    const [showSkinAssessment, setShowSkinAssessment] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setLoadingError(false);
                
                // Try to use cached user data from auth context first
                if (user && user.name) {
                    setProfile(user);
                    
                    // Check if skin assessment is needed
                    if (!user.preferences || !user.preferences.skin_type) {
                        setShowSkinAssessment(true);
                    }
                } else {
                    // Fall back to fetching profile
                    try {
                        const profileData = await fetchUserProfile(true);
                        setProfile(profileData);
                        
                        // Check if user should be prompted for skin assessment
                        if (!profileData.preferences || !profileData.preferences.skin_type) {
                            setShowSkinAssessment(true);
                        }
                    } catch (profileError) {
                        console.error('Error loading profile:', profileError);
                        // Use any existing user data we have
                        if (user) {
                            setProfile(user);
                        } else {
                            setLoadingError(true);
                        }
                    }
                }
                
                // Fetch routines silently - don't show error toasts
                try {
                    const routinesData = await fetchRoutines(true);
                    setRoutines(routinesData || []);
                } catch (routinesError) {
                    console.error('Error loading routines:', routinesError);
                    // Just use empty array - no need to set an error state
                    setRoutines([]);
                }
            } catch (error) {
                console.error('Error loading dashboard data:', error);
                setLoadingError(true);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [user, fetchUserProfile, fetchRoutines]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="animate-pulse flex flex-col space-y-4">
                        <div className="h-12 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-96 bg-gray-200 rounded w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Handle error state
    if (loadingError && (!profile || !profile.name)) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white shadow-lg rounded-lg p-8 text-center">
                        <div className="text-red-500 text-5xl mb-4">
                            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Unable to load dashboard</h2>
                        <p className="text-gray-600 mb-6">There was a problem loading your profile data.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Get user's name with fallbacks
    const userName = profile?.name || user?.name || 'User';

    return (
        <div className="min-h-screen bg-gradient-to-b from-primary-50 to-white pt-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
                {/* Welcome Header */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-primary-600 to-secondary-500 py-6 px-6 md:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div className="text-white">
                                <h2 className="text-2xl md:text-3xl font-bold">
                                    Welcome back, {userName}!
                                </h2>
                                {/* <p className="mt-1 text-primary-100">{profile?.email}</p> */}
                            </div>
                            <div className="mt-4 md:mt-0 flex space-x-3">
                                <Link
                                    to="/profile"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-800 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Edit Profile
                                </Link>
                                <Link
                                    to="/skin-assessment"
                                    className="inline-flex items-center px-4 py-2 border border-white rounded-md shadow-sm text-sm font-medium text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Take Skin Assessment
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Skin type information */}
                    {profile?.preferences?.skin_type ? (
                        <div className="px-6 py-4 md:px-8 bg-white">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">Your Skin Profile</h3>
                                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-500">Skin Type:</span>
                                            <span className="ml-2 text-sm text-gray-900">{profile.preferences.skin_type}</span>
                                        </div>
                                        {profile.preferences.skin_concerns && profile.preferences.skin_concerns.length > 0 && (
                                            <div>
                                                <span className="text-sm font-medium text-gray-500">Concerns:</span>
                                                <span className="ml-2 text-sm text-gray-900">
                                                    {profile.preferences.skin_concerns.join(', ')}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : showSkinAssessment ? (
                        <div className="px-6 py-4 md:px-8 bg-primary-50">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h3 className="text-lg font-medium text-gray-900">Complete Your Skin Assessment</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Take our quick skin assessment to get personalized skincare recommendations.
                                    </p>
                                </div>
                                <Link
                                    to="/skin-assessment"
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                >
                                    Start Assessment
                                </Link>
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* User's Routines */}
                <div className="bg-white shadow-lg rounded-lg overflow-hidden mb-8">
                    <div className="px-6 py-5 md:px-8 border-b border-gray-200 bg-white">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-gray-900">
                                Your Skincare Routines
                            </h3>
                            <Link
                                to="/routine"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            >
                                Create New Routine
                            </Link>
                        </div>
                    </div>
                    
                    {routines.length === 0 ? (
                        <div className="px-6 py-12 md:px-8">
                            <div className="text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1}
                                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-gray-900">No routines yet</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Get started by creating your first skincare routine.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        to="/routine"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                    >
                                        Create Routine
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {routines.map((routine) => (
                                <div key={routine.id} className="px-6 py-6 md:px-8">
                                    <div className="sm:flex sm:items-start sm:justify-between">
                                        <div>
                                            <h4 className="text-lg font-medium text-gray-900">{routine.name}</h4>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Created on {new Date(routine.created_at).toLocaleDateString()}
                                            </p>
                                            
                                            {/* Steps */}
                                            {routine.steps && routine.steps.length > 0 && (
                                                <div className="mt-4">
                                                    <h5 className="text-sm font-medium text-gray-700">Steps:</h5>
                                                    <ol className="mt-2 pl-5 list-decimal text-sm text-gray-600">
                                                        {routine.steps.map((step, index) => (
                                                            <li key={index} className="py-1">{step}</li>
                                                        ))}
                                                    </ol>
                                                </div>
                                            )}
                                            
                                            {/* Products */}
                                            {routine.products && routine.products.length > 0 && (
                                                <div className="mt-4">
                                                    <h5 className="text-sm font-medium text-gray-700">Products:</h5>
                                                    <ul className="mt-2 pl-5 list-disc text-sm text-gray-600">
                                                        {routine.products.map((product, index) => (
                                                            <li key={index} className="py-1">
                                                                {product.name || product}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Recently Viewed Products */}
                <div className="mb-8">
                    <ProductHistory limit={5} />
                </div>
                
                {/* Feature cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Skin Analysis */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105">
                        <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2"></div>
                        <div className="px-6 py-5">
                            <h3 className="text-lg font-bold text-gray-900">Skin Analysis</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Analyze your skin using our advanced tool and get personalized insights.
                            </p>
                            <div className="mt-4">
                                <Link
                                    to="/analyzer"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                                >
                                    Analyze My Skin
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Product Recommender */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105">
                        <div className="bg-gradient-to-r from-green-500 to-teal-500 h-2"></div>
                        <div className="px-6 py-5">
                            <h3 className="text-lg font-bold text-gray-900">Product Recommender</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Get personalized product recommendations based on your skin profile.
                            </p>
                            <div className="mt-4">
                                <Link
                                    to="/recommender"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                    Get Recommendations
                                </Link>
                            </div>
                        </div>
                    </div>
                    
                    {/* Skincare Routine Builder */}
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden transform transition-all hover:scale-105">
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2"></div>
                        <div className="px-6 py-5">
                            <h3 className="text-lg font-bold text-gray-900">Routine Builder</h3>
                            <p className="mt-2 text-sm text-gray-500">
                                Create a custom skincare routine tailored to your specific needs.
                            </p>
                            <div className="mt-4">
                                <Link
                                    to="/routine"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Build Your Routine
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 