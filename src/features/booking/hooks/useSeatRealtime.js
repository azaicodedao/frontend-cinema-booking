import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { WS_URL } from '../../../config/env';

const useSeatRealtime = (showtimeId, onSeatStatusUpdate) => {
  const stompClient = useRef(null);

  useEffect(() => {
    if (!showtimeId || !onSeatStatusUpdate) return undefined;

    const socket = new SockJS(WS_URL);
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        client.subscribe(`/topic/showtime/${showtimeId}`, (message) => {
          onSeatStatusUpdate(JSON.parse(message.body));
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers.message);
      },
    });

    client.activate();
    stompClient.current = client;

    return () => {
      stompClient.current?.deactivate();
      stompClient.current = null;
    };
  }, [showtimeId, onSeatStatusUpdate]);
};

export default useSeatRealtime;
