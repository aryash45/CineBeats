import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Navbar = () => {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <nav style={styles.nav}>
      <div className="container" style={styles.navContainer}>
        <Link to="/" style={styles.logo}>CineBeats</Link>

        {/* Desktop Menu */}
        <div style={styles.menu}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/search" style={styles.link}>Discover</Link>
          <Link to="/advanced-search" style={styles.link}>Advanced Search</Link>
          {isLoggedIn ? (
            <>
              <Link to="/watchlist" style={styles.link}>My Lists</Link>
              <div style={styles.userSection}>
                <span style={styles.username}>Hi, {user?.username}</span>
                <button onClick={toggleTheme} className="btn" style={styles.iconBtn}>🌓</button>
                <button onClick={handleLogout} className="btn btn-danger" style={styles.logoutBtn}>Logout</button>
              </div>
            </>
          ) : (
            <div style={styles.authButtons}>
              <button onClick={toggleTheme} className="btn" style={styles.iconBtn}>🌓</button>
              <Link to="/login" className="btn">Login</Link>
              <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="mobile-toggle" style={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
          ☰
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/search" style={styles.mobileLink} onClick={() => setIsOpen(false)}>Discover</Link>
          <Link to="/advanced-search" style={styles.mobileLink} onClick={() => setIsOpen(false)}>Advanced Search</Link>
          {isLoggedIn ? (
            <>
              <Link to="/watchlist" style={styles.mobileLink} onClick={() => setIsOpen(false)}>My Lists</Link>
              <button onClick={toggleTheme} style={styles.mobileLink}>Toggle Theme</button>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} style={{...styles.mobileLink, color: 'var(--accent-red)'}}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.mobileLink} onClick={() => setIsOpen(false)}>Login</Link>
              <Link to="/signup" style={styles.mobileLink} onClick={() => setIsOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const styles = {
  nav: {
    background: 'rgba(26, 26, 46, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--border-color)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    height: '70px',
    display: 'flex',
    alignItems: 'center'
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, var(--accent-red), var(--accent-teal))',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  menu: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px'
  },
  link: {
    color: 'var(--text-primary)',
    fontWeight: 500,
    transition: 'color var(--transition-fast)'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  username: {
    color: 'var(--text-secondary)'
  },
  authButtons: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  iconBtn: {
    padding: '0 12px',
    fontSize: '18px'
  },
  logoutBtn: {
    padding: '0 16px'
  },
  mobileToggle: {
    display: 'none', // handled via media queries in a real app, assuming display check here
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    fontSize: '24px',
    cursor: 'pointer'
  },
  mobileMenu: {
    position: 'absolute',
    top: '70px',
    left: 0,
    right: 0,
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    padding: '16px'
  },
  mobileLink: {
    padding: '12px 16px',
    color: 'var(--text-primary)',
    textDecoration: 'none',
    borderBottom: '1px solid var(--border-color)',
    background: 'none',
    border: 'none',
    textAlign: 'left',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

// Add basic media query via style tag for simplicity in this component
const css = `
  @media (max-width: 768px) {
    .menu { display: none !important; }
    .mobile-toggle { display: block !important; }
  }
`;
document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

export default Navbar;
