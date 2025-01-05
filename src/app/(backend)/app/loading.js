import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="loader">
        <svg
          className="loader animate-spin h-16 w-16 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="text-gray-300"
            cx="12"
            cy="12"
            r="10"
            strokeWidth="4"
          />
          <path
            className="text-blue-500"
            fill="currentColor"
            d="M12 2a10 10 0 0 1 0 20 10 10 0 0 1 0-20zm0 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Loading;
