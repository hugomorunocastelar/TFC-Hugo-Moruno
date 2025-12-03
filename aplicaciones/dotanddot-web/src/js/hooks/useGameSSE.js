import { useEffect, useRef, useState } from 'react';

export const useGameSSE = (uniqueCode, onUpdate) => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const [game, setGame] = useState(null);
    const eventSourceRef = useRef(null);

    useEffect(() => {
        if (!uniqueCode) return;

        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const url = `${apiUrl}/open/matches/live/${uniqueCode}`;

        console.log('Connecting SSE to:', url);

        const eventSource = new EventSource(url);

        eventSource.addEventListener('connected', (event) => {
            console.log('SSE connected for game:', uniqueCode);
            setConnected(true);
            setError(null);
            try {
                const data = JSON.parse(event.data);
                setGame(data.game);
                if (onUpdate) {
                    onUpdate(data);
                }
            } catch (err) {
                console.error('Error parsing initial game data:', err);
            }
        });

        eventSource.addEventListener('game-update', (event) => {
            try {
                const update = JSON.parse(event.data);
                console.log('Received game update:', update);
                setGame(update.game);
                if (onUpdate) {
                    onUpdate(update);
                }
            } catch (err) {
                console.error('Error parsing game update:', err);
            }
        });

        eventSource.addEventListener('error', (event) => {
            console.error('SSE error:', event);
            setError('Connection error');
            setConnected(false);
        });

        eventSource.onerror = (err) => {
            console.error('SSE connection error:', err);
            setError('Failed to connect to live updates');
            setConnected(false);
            eventSource.close();
        };

        eventSourceRef.current = eventSource;

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close();
            }
        };
    }, [uniqueCode, onUpdate]);

    return {
        connected,
        error,
        game
    };
};
