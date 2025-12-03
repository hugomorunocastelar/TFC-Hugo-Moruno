import { useEffect, useState } from 'react';

export const useSSE = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    let eventSource;

    try {
      eventSource = new EventSource(url);

      eventSource.onopen = () => {
        console.log('[SSE] Connected to', url);
        setConnected(true);
        setError(null);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setData(parsedData);
        } catch (err) {
          console.error('[SSE] Error parsing data:', err);
        }
      };

      eventSource.addEventListener('game-update', (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setData(parsedData);
        } catch (err) {
          console.error('[SSE] Error parsing game-update:', err);
        }
      });

      eventSource.onerror = (err) => {
        console.error('[SSE] Error:', err);
        setError('Connection error');
        setConnected(false);
        eventSource.close();
      };
    } catch (err) {
      console.error('[SSE] Failed to create EventSource:', err);
      setError(err.message);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
        setConnected(false);
      }
    };
  }, [url]);

  return { data, error, connected };
};
