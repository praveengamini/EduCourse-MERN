import React from 'react';
import { LockClosedIcon } from '@heroicons/react/24/outline';

const UnAuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
        <div className="flex justify-center mb-4">
          <LockClosedIcon className="h-16 w-16 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don’t have permission to view this page. Please contact the administrator if you believe this is a mistake.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Go to Homepage
        </a>
      </div>
    </div>
  );
};

export default UnAuthPage;
