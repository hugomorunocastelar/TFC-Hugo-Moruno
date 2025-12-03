import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getToken } from '../auth.mjs';

export const useGameWebSocket = (uniqueCode, onUpdate) => {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState(null);
    const clientRef = useRef(null);

    useEffect(() => {
        if (!uniqueCode) return;

        const token = getToken();
        const socket = new SockJS(`${import.meta.env.VITE_API_URL}/ws`);
        
        const stompClient = new Client({
            webSocketFactory: () => socket,
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            debug: (str) => {
                console.log('[STOMP]', str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClient.onConnect = () => {
            console.log('WebSocket connected for game:', uniqueCode);
            setConnected(true);
            setError(null);

            stompClient.subscribe(`/topic/game/${uniqueCode}`, (message) => {
                try {
                    const update = JSON.parse(message.body);
                    console.log('Received game update:', update);
                    if (onUpdate) {
                        onUpdate(update);
                    }
                } catch (err) {
                    console.error('Error parsing WebSocket message:', err);
                }
            });
        };

        stompClient.onStompError = (frame) => {
            console.error('STOMP error:', frame);
            setError('WebSocket connection error');
            setConnected(false);
        };

        stompClient.onWebSocketClose = () => {
            console.log('WebSocket closed');
            setConnected(false);
        };

        stompClient.activate();
        clientRef.current = stompClient;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
            }
        };
    }, [uniqueCode, onUpdate]);

    const sendUpdate = (action, data) => {
        if (!clientRef.current || !connected) {
            console.error('WebSocket not connected');
            return false;
        }

        try {
            clientRef.current.publish({
                destination: `/app/referee/${uniqueCode}/update`,
                body: JSON.stringify({
                    action,
                    ...data
                })
            });
            return true;
        } catch (err) {
            console.error('Error sending WebSocket message:', err);
            return false;
        }
    };

    return {
        connected,
        error,
        sendUpdate
    };
};
