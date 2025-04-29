import React from 'react';

const NotFound: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-800">
            <h1 className="text-6xl font-bold text-gray-200">404</h1>
            <p className="text-xl text-gray-600 mt-4">Page Not Found</p>
            <a
                href="/"
                className="mt-6 px-4 py-2 bg-blue-200 text-white rounded hover:bg-blue-600 transition"
            >
                Go Back Home
            </a>
        </div>
    );
};

export default NotFound;