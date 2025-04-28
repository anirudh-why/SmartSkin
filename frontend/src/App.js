import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import SkinAssessment from './pages/SkinAssessment';
import RecommenderPage from './pages/RecommenderPage';
import AnalyzerPage from './pages/AnalyzerPage';
import AboutPage from './pages/AboutPage';
import RoutinePage from './pages/RoutinePage';

// Protected Route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow pt-16">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/reset-password" element={<ResetPassword />} />
                            <Route
                                path="/dashboard"
                                element={
                                    <ProtectedRoute>
                                        <Dashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/skin-assessment"
                                element={
                                    <ProtectedRoute>
                                        <SkinAssessment />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/recommender"
                                element={
                                    <ProtectedRoute>
                                        <RecommenderPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/analyzer"
                                element={
                                    <ProtectedRoute>
                                        <AnalyzerPage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/routine"
                                element={
                                    <ProtectedRoute>
                                        <RoutinePage />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/about" element={<AboutPage />} />
                        </Routes>
                    </main>
                    <Footer />
                    <ToastContainer 
                        position="top-right"
                        autoClose={3000}
                        hideProgressBar={false}
                        newestOnTop
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App; 