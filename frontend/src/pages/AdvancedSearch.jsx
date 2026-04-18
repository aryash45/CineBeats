import React, { useState } from 'react';
import api from '../utils/api';
import MovieCard from '../components/MovieCard';

const AdvancedSearch = () => {
  const [filters, setFilters] = useState({
    genre: '',
    year: '',
    rating: '',
    sortBy: 'popularity.desc'
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const genres = [
    { id: '28', name: 'Action' },
    { id: '12', name: 'Adventure' },
    { id: '16', name: 'Animation' },
    { id: '35', name: 'Comedy' },
    { id: '80', name: 'Crime' },
    { id: '99', name: 'Documentary' },
    { id: '18', name: 'Drama' },
    { id: '10751', name: 'Family' },
    { id: '14', name: 'Fantasy' },
    { id: '36', name: 'History' },
    { id: '27', name: 'Horror' },
    { id: '10402', name: 'Music' },
    { id: '9648', name: 'Mystery' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Science Fiction' },
    { id: '10770', name: 'TV Movie' },
    { id: '53', name: 'Thriller' },
    { id: '10752', name: 'War' },
    { id: '37', name: 'Western' }
  ];

  const handleInputChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setHasSearched(true);
    try {
      const data = await api.advancedSearch(filters);
      setResults(data);
    } catch (error) {
      console.error('Error fetching advanced search results', error);
      setResults([]);
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Advanced Search</h1>
      <p style={styles.subtitle}>Discover exactly what you're looking for.</p>

      <form onSubmit={handleSearch} style={styles.formContainer}>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Genre</label>
            <select name="genre" value={filters.genre} onChange={handleInputChange} style={styles.input}>
              <option value="">Any Genre</option>
              {genres.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Release Year</label>
            <input 
              type="number" 
              name="year" 
              placeholder="e.g. 2023" 
              value={filters.year} 
              onChange={handleInputChange} 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Minimum Rating</label>
            <input 
              type="number" 
              name="rating" 
              min="0" max="10" step="0.1" 
              placeholder="e.g. 7.5" 
              value={filters.rating} 
              onChange={handleInputChange} 
              style={styles.input} 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Sort By</label>
            <select name="sortBy" value={filters.sortBy} onChange={handleInputChange} style={styles.input}>
              <option value="popularity.desc">Most Popular</option>
              <option value="vote_average.desc">Highest Rated</option>
              <option value="primary_release_date.desc">Newest Releases</option>
              <option value="revenue.desc">Highest Grossing</option>
            </select>
          </div>
        </div>

        <button type="submit" disabled={loading} style={styles.searchButton}>
          {loading ? 'Searching...' : 'Find Movies'}
        </button>
      </form>

      <div style={styles.resultsContainer}>
        {loading ? (
          <div style={{ textAlign: 'center' }}>Loading...</div>
        ) : (
          hasSearched && results.length === 0 ? (
            <div style={styles.noResults}>No movies found matching your criteria.</div>
          ) : (
            <div style={styles.movieGrid}>
              {results.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '40px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    color: '#fff',
  },
  title: {
    fontSize: '36px',
    marginBottom: '10px',
    color: 'var(--text-light)',
  },
  subtitle: {
    fontSize: '18px',
    color: 'var(--text-muted)',
    marginBottom: '40px',
  },
  formContainer: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '30px',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    marginBottom: '40px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '8px',
    fontSize: '14px',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '12px 16px',
    borderRadius: '8px',
    background: 'rgba(0, 0, 0, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
  },
  searchButton: {
    padding: '14px 28px',
    background: 'var(--accent-red)',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '100%',
    transition: 'background 0.2s',
  },
  resultsContainer: {
    minHeight: '400px',
  },
  movieGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: '24px',
  },
  noResults: {
    textAlign: 'center',
    padding: '40px',
    color: 'var(--text-muted)',
    fontSize: '18px',
  }
};

export default AdvancedSearch;
