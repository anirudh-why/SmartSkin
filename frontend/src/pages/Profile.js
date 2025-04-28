import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
    const { fetchUserProfile, updatePreferences, logout } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [skinType, setSkinType] = useState('');
    const [skinConcerns, setSkinConcerns] = useState([]);
    const navigate = useNavigate();

    // Predefined skin types and concerns options
    const skinTypeOptions = ['Normal', 'Oily', 'Dry', 'Combination', 'Sensitive'];
    const skinConcernOptions = [
        'Acne', 'Aging', 'Blackheads', 'Dark circles', 'Dryness', 
        'Dullness', 'Redness', 'Sun damage', 'Uneven texture', 'Wrinkles'
    ];

    useEffect(() => {
        const loadProfile = async () => {
            try {
                setLoading(true);
                const profileData = await fetchUserProfile();
                setProfile(profileData);
                
                // Set form values
                setName(profileData.name || '');
                setSkinType(profileData.preferences?.skin_type || '');
                setSkinConcerns(profileData.preferences?.skin_concerns || []);
            } catch (error) {
                console.error('Error loading profile:', error);
                toast.error('Could not load profile');
            } finally {
                setLoading(false);
            }
        };
        
        loadProfile();
    }, [fetchUserProfile]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const handleSkinConcernChange = (concern) => {
        if (skinConcerns.includes(concern)) {
            setSkinConcerns(skinConcerns.filter(c => c !== concern));
        } else {
            setSkinConcerns([...skinConcerns, concern]);
        }
    };

    const handleSavePreferences = async (e) => {
        e.preventDefault();
        
        try {
            await updatePreferences({
                skin_type: skinType,
                skin_concerns: skinConcerns
            });
            
            toast.success('Preferences saved successfully');
        } catch (error) {
            console.error('Error saving preferences:', error);
            toast.error('Failed to save preferences');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900">Loading profile...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                                Your Profile
                            </h2>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                {profile?.email}
                            </p>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
                            >
                                Back to Dashboard
                            </button>
                            <button
                                onClick={handleLogout}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Log Out
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Information */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Account Information
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Your personal details
                        </p>
                    </div>
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <div className="grid grid-cols-1 gap-6">
                            <div className="col-span-1">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={name}
                                    readOnly
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    You cannot change your name at this time.
                                </p>
                            </div>
                            <div className="col-span-1">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={profile?.email || ''}
                                    readOnly
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-50"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    You cannot change your email at this time.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skin Preferences */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            Skin Profile
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Your skin preferences used for recommendations
                        </p>
                    </div>
                    <form onSubmit={handleSavePreferences}>
                        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="col-span-1">
                                    <label htmlFor="skinType" className="block text-sm font-medium text-gray-700">
                                        Skin Type
                                    </label>
                                    <select
                                        id="skinType"
                                        name="skinType"
                                        value={skinType}
                                        onChange={(e) => setSkinType(e.target.value)}
                                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Select a skin type</option>
                                        {skinTypeOptions.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="col-span-1">
                                    <span className="block text-sm font-medium text-gray-700 mb-2">
                                        Skin Concerns
                                    </span>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {skinConcernOptions.map(concern => (
                                            <div key={concern} className="flex items-center">
                                                <input
                                                    id={`concern-${concern}`}
                                                    name="skinConcerns"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    checked={skinConcerns.includes(concern)}
                                                    onChange={() => handleSkinConcernChange(concern)}
                                                />
                                                <label htmlFor={`concern-${concern}`} className="ml-2 text-sm text-gray-700">
                                                    {concern}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                            <button
                                type="submit"
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save Preferences
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile; 