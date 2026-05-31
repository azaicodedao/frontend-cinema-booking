import { useState, useEffect, useCallback } from 'react';

const useCountdown = (initialSeconds, options = {}) => {
  const { enabled = true } = options;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setSecondsLeft(initialSeconds);
    setIsExpired(initialSeconds <= 0);
  }, [initialSeconds]);

  useEffect(() => {
    if (!enabled) return undefined;

    if (secondsLeft <= 0) {
      setIsExpired(true);
      return undefined;
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
  }, [enabled, secondsLeft]);

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
