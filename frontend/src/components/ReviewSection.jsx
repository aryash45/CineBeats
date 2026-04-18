import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useAuth } from '../hooks/useAuth';

const ReviewSection = ({ mediaType, mediaId }) => {
  const { user, token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [editingId, setEditingId] = useState(null);

  const fetchReviews = async () => {
    try {
      const data = await api.getReviews(mediaType, mediaId);
      setReviews(data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [mediaType, mediaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await api.updateReview(token, editingId, rating, reviewText);
        setEditingId(null);
      } else {
        await api.postReview(token, mediaType, mediaId, rating, reviewText);
      }
      setReviewText('');
      setRating(5);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;
    try {
      await api.deleteReview(token, reviewId);
      fetchReviews();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete review');
    }
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setRating(review.rating);
    setReviewText(review.review_text);
  };

  // Sort reviews: user's own review first
  const sortedReviews = [...reviews].sort((a, b) => {
    if (user && a.user_id === user.id) return -1;
    if (user && b.user_id === user.id) return 1;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  const userHasReviewed = user && reviews.some(r => r.user_id === user.id);

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Reviews ({reviews.length})</h3>
        {reviews.length > 0 && <span style={styles.average}>⭐ {averageRating} Avg</span>}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Review Form */}
      {user && (!userHasReviewed || editingId) ? (
        <form onSubmit={handleSubmit} style={styles.form}>
          <h4 style={{ margin: '0 0 12px 0' }}>{editingId ? 'Edit your review' : 'Write a review'}</h4>
          <div style={styles.ratingSelect}>
            <label>Rating: </label>
            <select 
              value={rating} 
              onChange={(e) => setRating(Number(e.target.value))}
              style={styles.select}
            >
              {[5,4,3,2,1].map(num => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </select>
          </div>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="What did you think?"
            style={styles.textarea}
            maxLength={500}
          />
          <div style={styles.formActions}>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
            {editingId && (
              <button type="button" className="btn" onClick={() => { setEditingId(null); setReviewText(''); setRating(5); }}>
                Cancel
              </button>
            )}
          </div>
        </form>
      ) : !user ? (
        <div style={styles.loginPrompt}>Log in to write a review.</div>
      ) : null}

      {/* Review List */}
      <div style={styles.list}>
        {sortedReviews.length === 0 ? (
          <p style={styles.empty}>No reviews yet. Be the first!</p>
        ) : (
          sortedReviews.map(review => (
            <div key={review.id} style={styles.reviewCard}>
              <div style={styles.reviewHeader}>
                <div>
                  <strong>{review.username}</strong>
                  {user && review.user_id === user.id && <span style={styles.badge}>You</span>}
                </div>
                <div>⭐ {review.rating}</div>
              </div>
              <p style={styles.reviewText}>{review.review_text}</p>
              <div style={styles.reviewFooter}>
                <small style={{ color: 'var(--text-secondary)' }}>
                  {new Date(review.created_at).toLocaleDateString()}
                </small>
                {user && review.user_id === user.id && (
                  <div style={styles.actions}>
                    <button onClick={() => startEdit(review)} style={styles.actionBtn}>Edit</button>
                    <button onClick={() => handleDelete(review.id)} style={{...styles.actionBtn, color: 'var(--accent-red)'}}>Delete</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '40px',
    padding: '24px',
    background: 'var(--card-bg)',
    borderRadius: 'var(--radius-lg)'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '16px'
  },
  title: {
    margin: 0,
    fontSize: '24px'
  },
  average: {
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontWeight: 'bold'
  },
  error: {
    color: 'var(--accent-red)',
    marginBottom: '16px'
  },
  form: {
    background: 'rgba(0,0,0,0.2)',
    padding: '20px',
    borderRadius: 'var(--radius-md)',
    marginBottom: '32px'
  },
  ratingSelect: {
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  select: {
    padding: '8px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)'
  },
  textarea: {
    width: '100%',
    minHeight: '100px',
    padding: '12px',
    borderRadius: 'var(--radius-md)',
    background: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    marginBottom: '12px',
    resize: 'vertical'
  },
  formActions: {
    display: 'flex',
    gap: '12px'
  },
  loginPrompt: {
    padding: '16px',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 'var(--radius-md)',
    textAlign: 'center',
    marginBottom: '24px'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  reviewCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '20px',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-color)'
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '16px'
  },
  badge: {
    marginLeft: '8px',
    background: 'var(--accent-teal)',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: '4px',
    fontSize: '12px'
  },
  reviewText: {
    margin: '0 0 16px 0',
    lineHeight: 1.6
  },
  reviewFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actions: {
    display: 'flex',
    gap: '12px'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    fontSize: '14px',
    opacity: 0.8
  },
  empty: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    padding: '20px'
  }
};

export default ReviewSection;
