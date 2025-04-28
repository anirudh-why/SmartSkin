import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const SkinAssessment = () => {
    const navigate = useNavigate();
    const { updatePreferences } = useAuth();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [skinResult, setSkinResult] = useState({
        type: '',
        concerns: []
    });

    // The quiz questions
    const questions = [
        {
            question: "How does your skin feel a few hours after washing your face?",
            options: [
                { text: "Tight and dry all over", score: { dry: 2 } },
                { text: "Oily all over", score: { oily: 2 } },
                { text: "Oily in the T-zone (forehead, nose, chin) but normal or dry elsewhere", score: { combination: 2 } },
                { text: "Comfortable and balanced", score: { normal: 2 } }
            ]
        },
        {
            question: "How often do you experience breakouts?",
            options: [
                { text: "Frequently, especially in the T-zone", score: { oily: 1, acne: 1 } },
                { text: "Occasionally", score: { normal: 1 } },
                { text: "Rarely", score: { dry: 1, normal: 1 } },
                { text: "Never", score: { normal: 1, dry: 1 } }
            ]
        },
        {
            question: "How does your skin react to new products?",
            options: [
                { text: "Often becomes red, itchy, or irritated", score: { sensitive: 2 } },
                { text: "Occasionally becomes slightly irritated", score: { sensitive: 1 } },
                { text: "Rarely has a negative reaction", score: { normal: 1 } },
                { text: "Never has a negative reaction", score: { normal: 1 } }
            ]
        },
        {
            question: "What skin concerns do you experience most often?",
            options: [
                { text: "Dryness, flakiness, or tightness", score: { dry: 1, dryness: 1 } },
                { text: "Excess oil and shine", score: { oily: 1 } },
                { text: "Redness or sensitivity", score: { sensitive: 1, redness: 1 } },
                { text: "Fine lines and wrinkles", score: { aging: 1 } }
            ]
        },
        {
            question: "How large are your pores?",
            options: [
                { text: "Large and visible, especially in the T-zone", score: { oily: 1 } },
                { text: "Medium-sized and only visible in some areas", score: { combination: 1 } },
                { text: "Small and barely visible", score: { dry: 1, normal: 1 } },
                { text: "I'm not sure / I don't notice my pores", score: { normal: 1 } }
            ]
        }
    ];

    const handleAnswer = (optionIndex) => {
        const newAnswers = [...answers, optionIndex];
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            analyzeSkinType(newAnswers);
        }
    };

    const analyzeSkinType = (allAnswers) => {
        // Calculate scores for each skin type and concern
        const scores = {
            oily: 0,
            dry: 0,
            combination: 0,
            normal: 0,
            sensitive: 0
        };

        const concernScores = {
            acne: 0,
            dryness: 0,
            redness: 0,
            aging: 0
        };

        allAnswers.forEach((answerIndex, questionIndex) => {
            const selectedOption = questions[questionIndex].options[answerIndex];
            
            // Update skin type scores
            Object.entries(selectedOption.score).forEach(([key, value]) => {
                if (key in scores) {
                    scores[key] += value;
                } else if (key in concernScores) {
                    concernScores[key] += value;
                }
            });
        });

        // Determine the primary skin type
        let skinType = Object.entries(scores).reduce((a, b) => a[1] > b[1] ? a : b)[0];
        skinType = skinType.charAt(0).toUpperCase() + skinType.slice(1);

        // Determine top concerns (those with a score > 0)
        const concerns = Object.entries(concernScores)
            .filter(([_, score]) => score > 0)
            .map(([concern, _]) => concern.charAt(0).toUpperCase() + concern.slice(1));

        setSkinResult({
            type: skinType,
            concerns: concerns
        });
        setIsCompleted(true);
    };

    const handleSaveResults = async () => {
        try {
            await updatePreferences({
                skin_type: skinResult.type,
                skin_concerns: skinResult.concerns
            });
            
            navigate('/dashboard');
        } catch (error) {
            console.error('Error saving skin assessment results:', error);
            toast.error('Failed to save your skin assessment results');
        }
    };

    const renderQuestion = () => {
        const question = questions[currentQuestion];
        
        return (
            <div className="space-y-6">
                <h3 className="text-xl font-medium text-gray-900">
                    Question {currentQuestion + 1} of {questions.length}
                </h3>
                <div className="mb-4">
                    <h4 className="text-lg font-medium text-gray-800 mb-4">
                        {question.question}
                    </h4>
                    <div className="space-y-3">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswer(index)}
                                className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                            >
                                {option.text}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    ></div>
                </div>
            </div>
        );
    };

    const renderResults = () => {
        return (
            <div className="space-y-6">
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Your Skin Assessment Results</h3>
                    <p className="text-gray-500">Based on your answers, we've determined your skin profile.</p>
                </div>
                
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Your Skin Type: <span className="text-indigo-600">{skinResult.type}</span>
                    </h4>
                    
                    {skinResult.concerns.length > 0 && (
                        <div>
                            <h5 className="font-medium text-gray-800 mb-2">Key Skin Concerns:</h5>
                            <ul className="list-disc pl-5 text-gray-600">
                                {skinResult.concerns.map((concern, index) => (
                                    <li key={index}>{concern}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    <div className="mt-6">
                        <p className="text-sm text-gray-600">
                            We'll use this information to provide you with personalized skincare recommendations!
                        </p>
                    </div>
                </div>
                
                <div className="flex justify-center pt-4">
                    <button
                        onClick={handleSaveResults}
                        className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Save Results & Continue
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pt-16">
            <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6 sm:p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-extrabold text-gray-900">
                            Skin Type Assessment
                        </h2>
                        <p className="mt-1 text-lg text-gray-500">
                            Answer 5 simple questions to determine your skin type
                        </p>
                    </div>
                    
                    {isCompleted ? renderResults() : renderQuestion()}
                </div>
            </div>
        </div>
    );
};

export default SkinAssessment; 