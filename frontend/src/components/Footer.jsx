import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.container}>
        <div style={styles.logoSection}>
          <h2 style={styles.logo}>CineBeats</h2>
          <p style={styles.desc}>Your unified discovery platform for movies and music.</p>
        </div>
        <div style={styles.copyright}>
          &copy; {new Date().getFullYear()} CineBeats. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    background: 'var(--bg-secondary)',
    borderTop: '1px solid var(--border-color)',
    padding: '40px 0 20px 0',
    marginTop: 'auto'
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '24px',
    textAlign: 'center'
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  logo: {
    fontSize: '24px',
    background: 'linear-gradient(45deg, var(--accent-red), var(--accent-teal))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    margin: 0
  },
  desc: {
    color: 'var(--text-secondary)',
    margin: 0
  },
  copyright: {
    color: 'var(--text-secondary)',
    fontSize: '14px',
    borderTop: '1px solid var(--border-color)',
    width: '100%',
    paddingTop: '20px'
  }
};

export default Footer;
