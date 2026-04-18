import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetch = (url, token = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const source = axios.CancelToken.source();

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const response = await axios.get(url, {
          headers,
          cancelToken: source.token
        });
        
        if (isMounted) {
          setData(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted && !axios.isCancel(err)) {
          setError(err.response?.data?.error || err.message || 'An error occurred');
          setLoading(false);
        }
      }
    };

    if (url) {
      fetchData();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
      source.cancel('Operation canceled by the user.');
    };
  }, [url, token]);

  return { data, loading, error };
};
