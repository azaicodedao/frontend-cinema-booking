 import { useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { WS_URL } from '../../../config/env';

const useSeatRealtime = (showtimeId, onSeatStatusUpdate) => {//  quản lý kết nối WebSocker theo thời gian thực để cập nhật trạng thái ghế (đang chọn, đã đặt, đã hủy)
  const stompClient = useRef(null);

  useEffect(() => {
    if (!showtimeId || !onSeatStatusUpdate) return undefined;

    const socket = new SockJS(WS_URL);// Khởi tạo kết nối WebSocket
    const client = new Client({
      webSocketFactory: () => socket,// Cấu hình STOMP Client để sử dụng kết nối SockJS vừa tạo
      onConnect: () => {
        client.subscribe(`/topic/showtime/${showtimeId}`, (message) => {// Đăng ký nhận tin nhắn từ topic WebSocket
          onSeatStatusUpdate(JSON.parse(message.body));
        });
      },
      onStompError: (frame) => {// Xử lý lỗi kết nối
        console.error('Broker reported error: ' + frame.headers.message);
      },
    });

    client.activate();// Bắt đầu kết nối đến WebSocket server
    stompClient.current = client;// Lưu client vào ref để có thể truy cập sau này

    return () => {// Hàm dọn dẹp, sẽ được gọi khi component unmount hoặc khi showtimeId thay đổi
      stompClient.current?.deactivate();// Đóng kết nối WebSocket
      stompClient.current = null;
    };
  }, [showtimeId, onSeatStatusUpdate]);
};

export default useSeatRealtime;
