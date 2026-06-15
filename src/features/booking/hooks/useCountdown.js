import { useState, useEffect, useCallback } from 'react';

const useCountdown = (initialSeconds, options = {}) => {
  const { enabled = true } = options; // quyết định khi nào thì bắt đầu đếm ngược
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds); // Số giây còn lại hiện tại.
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {// reset lại bộ đếm khi thời gian ban đầu thay đổi
    setSecondsLeft(initialSeconds);
    setIsExpired(initialSeconds <= 0);
  }, [initialSeconds]);

  useEffect(() => {// nếu tắt đếm ngược thì dừng lại
    if (!enabled) return undefined;

    if (secondsLeft <= 0) { // nếu hết giờ thì dừng lại
      setIsExpired(true);
      return undefined;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {// update số giây còn lại mỗi 1 giây
        if (prev <= 1) {// nếu còn 1 giây thì dừng lại
          setIsExpired(true); // Đánh dấu đã hết giờ
          clearInterval(timer); // Xóa bộ đếm để không bị chạy ngầm
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [enabled, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60); // Tính số phút còn lại
  const seconds = secondsLeft % 60; // Tính số giây còn lại
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const reset = useCallback(() => { // 
    setSecondsLeft(initialSeconds);
    setIsExpired(false);
  }, [initialSeconds]);

  return { secondsLeft, minutes, seconds, formatted, isExpired, reset };
};

export default useCountdown;
