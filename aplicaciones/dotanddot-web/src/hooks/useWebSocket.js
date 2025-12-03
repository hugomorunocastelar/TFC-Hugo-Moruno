import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getSession } from '../js/session.mjs';


const WS_URL = import.meta.env.VITE_API_URL + '/ws';

export const useWebSocket = (uniqueCode, onMessage) => {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const clientRef = useRef(null);

  useEffect(() => {
    if (!uniqueCode) return;

    const token = getSession()?.token || null;
    if (!token) {
      setError('No authentication token found');
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        console.log('[WS Debug]', str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('[WS] Connected');
        setConnected(true);
        setError(null);

        
        client.subscribe(`/topic/game/${uniqueCode}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            onMessage(data);
          } catch (err) {
            console.error('[WS] Error parsing message:', err);
          }
        });
      },
      onStompError: (frame) => {
        console.error('[WS] Broker error:', frame.headers['message']);
        setError(frame.headers['message']);
        setConnected(false);
      },
      onWebSocketError: (event) => {
        console.error('[WS] WebSocket error:', event);
        setError('WebSocket connection error');
        setConnected(false);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [uniqueCode, onMessage]);

  const sendMessage = (destination, body) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination,
        body: JSON.stringify(body)
      });
    } else {
      console.error('[WS] Cannot send message: not connected');
    }
  };

  return { connected, error, sendMessage };
};
