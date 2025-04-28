import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';

const ProductFeedback = ({ product, onFeedbackSubmit }) => {
    const { apiClient } = useAuth();
    const [liked, setLiked] = useState(null);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState('');
    const [used, setUsed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showFeedbackForm, setShowFeedbackForm] = useState(false);

    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        
        if (liked === null && rating === 0 && !review) {
            toast.error('Please provide some feedback before submitting');
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            const feedbackData = {
                product_id: product.id,
                product_name: product.name,
                category: product.label,
                liked,
                rating: rating > 0 ? rating : null,
                review,
                used
            };
            
            await apiClient.post('/api/user/feedback', feedbackData);
            toast.success('Thank you for your feedback!');
            setShowFeedbackForm(false);
            
            if (onFeedbackSubmit) {
                onFeedbackSubmit(feedbackData);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            toast.error('Failed to submit feedback. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStarRating = () => {
        return (
            <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        className={`text-2xl focus:outline-none ${
                            star <= rating 
                                ? 'text-yellow-400' 
                                : 'text-gray-300'
                        }`}
                        onClick={() => setRating(star)}
                    >
                        ★
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div>
            {!showFeedbackForm ? (
                <button
                    onClick={() => setShowFeedbackForm(true)}
                    className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-xs rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Rate Product
                </button>
            ) : (
                <div className="mt-3 border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Your Feedback</h4>
                    
                    <form onSubmit={handleSubmitFeedback}>
                        <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Did you like this product?</p>
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    className={`px-3 py-1 text-xs rounded-md ${
                                        liked === true
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                    onClick={() => setLiked(true)}
                                >
                                    👍 Yes
                                </button>
                                <button
                                    type="button"
                                    className={`px-3 py-1 text-xs rounded-md ${
                                        liked === false
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                    onClick={() => setLiked(false)}
                                >
                                    👎 No
                                </button>
                                <button
                                    type="button"
                                    className={`px-3 py-1 text-xs rounded-md ${
                                        liked === null && rating === 0 && !review
                                            ? 'bg-gray-300 text-gray-700'
                                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                    onClick={() => {
                                        setLiked(null);
                                        setRating(0);
                                        setReview('');
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                        
                        <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Rate this product:</p>
                            {renderStarRating()}
                        </div>
                        
                        <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Additional comments:</p>
                            <textarea
                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md"
                                rows="2"
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Share your experience with this product..."
                            />
                        </div>
                        
                        <div className="mb-3 flex items-center">
                            <input
                                type="checkbox"
                                id="used-product"
                                checked={used}
                                onChange={() => setUsed(!used)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <label htmlFor="used-product" className="ml-2 block text-xs text-gray-700">
                                I have used this product
                            </label>
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setShowFeedbackForm(false)}
                                className="px-3 py-1 text-xs border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-3 py-1 text-xs border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProductFeedback; 