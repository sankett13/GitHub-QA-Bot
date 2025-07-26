import React, { useState } from "react";
import "./RepoInput.css";

const RepoInput = ({ onProcessRepo, isProcessing, error }) => {
  const [repoUrl, setRepoUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (repoUrl.trim() && !isProcessing) {
      onProcessRepo(repoUrl.trim());
    }
  };

  const isValidGitHubUrl = (url) => {
    const githubPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
    return githubPattern.test(url);
  };

  const isUrlValid = repoUrl ? isValidGitHubUrl(repoUrl) : true;

  return (
    <div className="repo-input-container fade-in mobile-optimized">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🚀 Get Started with Your Repository</h2>
          <p className="card-subtitle">
            Enter a GitHub repository URL to create a knowledge base and start
            asking questions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="repo-form">
          <div className="form-group">
            <label htmlFor="repoUrl" className="form-label">
              GitHub Repository URL
            </label>
            <input
              id="repoUrl"
              type="url"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              placeholder="https://github.com/username/repository"
              className={`form-input mobile-optimized ${
                !isUrlValid ? "input-error" : ""
              }`}
              disabled={isProcessing}
              required
            />
            {repoUrl && !isUrlValid && (
              <span className="validation-error">
                Please enter a valid GitHub repository URL
              </span>
            )}
          </div>

          {error && (
            <div className="error-message">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"
                  fill="currentColor"
                />
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary mobile-optimized"
            disabled={isProcessing || !repoUrl.trim() || !isUrlValid}
          >
            {isProcessing ? (
              <>
                <div className="btn-spinner"></div>
                Processing Repository...
              </>
            ) : (
              <>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Process Repository
              </>
            )}
          </button>
        </form>

        <div className="help-section">
          <h3 className="help-title">How it works:</h3>
          <ul className="help-list">
            <li>🔍 Paste a GitHub repository URL</li>
            <li>⚡ We'll analyze and index the codebase</li>
            <li>
              💬 Ask questions about the code, structure, or functionality
            </li>
            <li>🤖 Get intelligent answers powered by AI</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RepoInput;
