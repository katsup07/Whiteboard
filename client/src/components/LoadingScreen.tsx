import React from 'react';
import './loading.css'; // Assuming you have a CSS file for loading styles

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingScreen;
