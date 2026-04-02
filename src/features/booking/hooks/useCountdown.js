import { useState, useEffect, useCallback } from 'react';

const useCountdown = (initialSeconds) => {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (secondsLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const reset = useCallback(() => {
    setSecondsLeft(initialSeconds);
    setIsExpired(false);
  }, [initialSeconds]);

  return { secondsLeft, minutes, seconds, formatted, isExpired, reset };
};

export default useCountdown;
