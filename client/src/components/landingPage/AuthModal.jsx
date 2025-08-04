// import React, { useState } from 'react';
// import { X, Mail, Lock, User, Phone } from 'lucide-react';
// import { authAPI } from '../services/api';

// const AuthModal = ({ isOpen, onClose, mode, onSwitchMode }) => {
//   const [formData, setFormData] = useState({
//     userName: '',
//     email: '',
//     password: '',
//     phone: ''
//   });
//   const [loading, setLoading] = useState(false);

//   if (!isOpen) return null;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       if (mode === 'login') {
//         await authAPI.login(formData.email, formData.password);
//         alert('Login successful!');
//       } else {
//         await authAPI.register(formData);
//         alert('Registration successful!');
//       }
//       onClose();
//       setFormData({ userName: '', email: '', password: '', phone: '' });
//     } catch (error) {
//       console.error(`${mode} error:`, error);
//       alert(`${mode} failed. Please try again.`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   return (
//     <div className="fixed inset-0 z-50 overflow-y-auto">
//       <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
//         <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>

//         <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h3 className="text-2xl font-bold text-gray-900">
//               {mode === 'login' ? 'Welcome Back' : 'Create Account'}
//             </h3>
//             <button
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600 transition-colors"
//             >
//               <X className="h-6 w-6" />
//             </button>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             {mode === 'signup' && (
//               <div>
//                 <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
//                   Username
//                 </label>
//                 <div className="relative">
//                   <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     id="userName"
//                     name="userName"
//                     value={formData.userName}
//                     onChange={handleChange}
//                     required
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     placeholder="Enter your username"
//                   />
//                 </div>
//               </div>
//             )}

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                 Email
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="email"
//                   id="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   placeholder="Enter your email"
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                 <input
//                   type="password"
//                   id="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                   placeholder="Enter your password"
//                 />
//               </div>
//             </div>

//             {mode === 'signup' && (
//               <div>
//                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                   Phone (Optional)
//                 </label>
//                 <div className="relative">
//                   <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//                   <input
//                     type="tel"
//                     id="phone"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                     placeholder="Enter your phone number"
//                   />
//                 </div>
//               </div>
//             )}

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {loading ? (
//                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto"></div>
//               ) : (
//                 mode === 'login' ? 'Sign In' : 'Create Account'
//               )}
//             </button>
//           </form>

//           <div className="mt-6 text-center">
//             <p className="text-gray-600">
//               {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
//               <button
//                 onClick={onSwitchMode}
//                 className="text-purple-600 hover:text-purple-700 font-semibold"
//               >
//                 {mode === 'login' ? 'Sign up' : 'Sign in'}
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthModal;
