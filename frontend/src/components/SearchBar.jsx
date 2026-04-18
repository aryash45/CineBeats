import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ initialQuery = '', onSearch }) => {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  useEffect(() => {
    // Debounce logic
    const handler = setTimeout(() => {
      if (onSearch && query !== initialQuery) {
        onSearch(query);
      }
    }, 500); // 500ms debounce
    return () => clearTimeout(handler);
  }, [query, onSearch, initialQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        className="input-field"
        placeholder="Search for movies, songs, artists..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={styles.input}
      />
      <button type="submit" className="btn btn-primary" style={styles.btn}>
        Search
      </button>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    gap: '12px',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  },
  input: {
    flex: 1,
    height: '48px',
    fontSize: '16px'
  },
  btn: {
    height: '48px',
    padding: '0 32px'
  }
};

export default SearchBar;
