import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="container" style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.desc}>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn btn-primary" style={styles.btn}>
        Go Back Home
      </Link>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    textAlign: 'center',
    padding: '40px 20px'
  },
  title: {
    fontSize: '120px',
    margin: 0,
    background: 'linear-gradient(45deg, var(--accent-red), var(--accent-teal))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    lineHeight: 1
  },
  desc: {
    fontSize: '20px',
    color: 'var(--text-secondary)',
    margin: '20px 0 40px 0'
  },
  btn: {
    fontSize: '18px',
    padding: '0 40px',
    height: '56px'
  }
};

export default NotFound;
