import { useEffect, useState } from 'react';

export const useSSE = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!url) return;

    let eventSource;
    let isActive = true;

    const initializeConnection = async () => {
      try {
        const initialUrl = url + '/initial';
        
        const response = await fetch(initialUrl);
        
        if (response.ok && isActive) {
          const initialData = await response.json();
          console.log('[SSE] Initial game state loaded via REST');
          setData(initialData);
        }
      } catch (err) {
        console.warn('[SSE] Could not fetch initial state, will wait for SSE:', err.message);
      }

      if (!isActive) return;

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
            
            setData(parsedData.game || parsedData);
          } catch (err) {
            console.error('[SSE] Error parsing data:', err);
          }
        };

        eventSource.addEventListener('game-update', (event) => {
          try {
            const parsedData = JSON.parse(event.data);
            console.log('[SSE] game-update message:', parsedData.type);
            
            setData(parsedData.game || parsedData);
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
    };

    initializeConnection();

    return () => {
      isActive = false;
      if (eventSource) {
        eventSource.close();
        setConnected(false);
      }
    };
  }, [url]);

  return { data, error, connected };
};
