import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-none px-8 mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Race Simulation
          </h1>
          <p className="text-lg text-gray-600">
            Configure runners, simulate races, and manage tracks
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Layout;
