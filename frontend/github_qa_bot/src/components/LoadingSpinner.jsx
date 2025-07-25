import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-container fade-in">
      <div className="loading-content">
        <div className="spinner-container">
          <div className="spinner"></div>
          <div className="spinner-ring"></div>
        </div>

        <div className="loading-text-container">
          <h3 className="loading-title">Processing Repository</h3>
          <p className="loading-description">
            Analyzing codebase and creating knowledge base...
          </p>
        </div>

        <div className="loading-steps">
          <div className="step-item active">
            <div className="step-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="step-text">Fetching repository</span>
          </div>

          <div className="step-item processing">
            <div className="step-icon">
              <div className="step-spinner"></div>
            </div>
            <span className="step-text">Analyzing code structure</span>
          </div>

          <div className="step-item">
            <div className="step-icon">
              <div className="step-dot"></div>
            </div>
            <span className="step-text">Creating embeddings</span>
          </div>

          <div className="step-item">
            <div className="step-icon">
              <div className="step-dot"></div>
            </div>
            <span className="step-text">Building knowledge base</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
