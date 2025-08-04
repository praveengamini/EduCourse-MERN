import React, { useState } from 'react';
import axios from 'axios';
import Header from './landingPage/Header';
import { Search, Loader2, X, CheckCircle2, FileText } from 'lucide-react';

const LandingPageValidator = () => {
    const [certificateNumber, setCertificateNumber] = useState('');
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!certificateNumber.trim()) {
            setError('Please enter a certificate number');
            return;
        }

        setLoading(true);
        setError('');
        setCertificate(null);

        try {
            const response = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/certificates/validate/${certificateNumber}`);
            setCertificate(response.data.certificate);
        } catch (err) {
            if (err.response?.status === 404) {
                setError('Certificate not found');
            } else {
                setError('Error validating certificate. Please try again.');
            }
            console.error('Certificate validation error:', err);
        } finally {
            setLoading(false);
        }
    };
    
    // Fallback for image loading error
    const handleImageError = (e) => {
        e.target.style.display = 'none';
        const fallback = e.target.nextElementSibling;
        if (fallback) {
            fallback.style.display = 'block';
        }
    };

    return (
        <div className="min-h-screen bg-black text-gray-100 relative overflow-hidden" style={{ fontFamily: "Inter, sans-serif" }}>
            <div className="absolute inset-0 z-0 bg-repeat opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-800 rounded-full blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-blue-800 rounded-full blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-pink-800 rounded-full blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            <style>
                {`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                @keyframes blob {
                    0% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0, 0) scale(1); }
                }
                .animate-blob { animation: blob 7s infinite ease-in-out; }
                .animation-delay-2000 { animation-delay: 2s; }
                .animation-delay-4000 { animation-delay: 4s; }
                `}
            </style>

            <Header />

            <div className="pt-20 max-w-4xl mx-auto py-12 px-4 relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-bold text-violet-400 mb-2">Certificate Validator</h1>
                    <p className="text-lg text-gray-400">Enter a certificate number to validate and view certificate details</p>
                </div>

                <div className="bg-zinc-950 rounded-2xl shadow-xl p-8 mb-8 border border-zinc-800">
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="flex-1 w-full">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={certificateNumber}
                                        onChange={(e) => setCertificateNumber(e.target.value)}
                                        placeholder="Enter certificate number..."
                                        className="w-full pl-12 pr-4 py-3 border border-zinc-700 bg-zinc-900 text-gray-200 rounded-lg focus:ring-2 focus:ring-violet-600 focus:border-transparent outline-none transition-all duration-200 placeholder:text-gray-500"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-violet-400">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full sm:w-auto px-8 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin h-5 w-5" />
                                        <span>Validating...</span>
                                    </>
                                ) : (
                                    <>
                                        <Search className="h-5 w-5" />
                                        <span>Validate Certificate</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>

                    {error && (
                        <div className="bg-red-900/40 border border-red-800 rounded-lg p-4 mb-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 text-red-400">
                                    <X className="h-5 w-5" />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-red-300">{error}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {certificate && (
                        <div className="bg-green-900/40 border border-green-800 rounded-lg p-6">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0 text-green-400">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-lg font-medium text-green-300">Certificate Validated Successfully</h3>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Certificate Number</label>
                                        <p className="text-lg font-semibold text-gray-100">{certificate.certificateNumber}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Student Name</label>
                                        <p className="text-gray-100">{certificate.student?.userName}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Student Email</label>
                                        <p className="text-gray-100">{certificate.student?.email}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Course Title</label>
                                        <p className="text-gray-100">{certificate.course?.title}</p>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">Issued Date</label>
                                        <p className="text-gray-100">{new Date(certificate.issuedAt).toLocaleDateString()}</p>
                                    </div>
                                </div>

                               
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LandingPageValidator;