import React from 'react';

const LoadingSpinner = () => {
  return (
    <div style={styles.container}>
      <div className="spinner" style={styles.spinner}></div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
    padding: '40px'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid var(--border-color)',
    borderTopColor: 'var(--accent-teal)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }
};

export default LoadingSpinner;
