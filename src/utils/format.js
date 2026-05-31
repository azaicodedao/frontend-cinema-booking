export const formatCurrency = (amount) => ( // Định dạng tiền tệ sang VND
  `${new Intl.NumberFormat('vi-VN').format(Number(amount || 0))} đ`
);

export const formatDate = (date) => { // Định dạng ngày tháng sang dd/MM/yyyy
  if (!date) return '—';
  return new Date(date).toLocaleDateString('vi-VN');
};

export const formatLongDate = (date) => { // Định dạng ngày tháng sang thứ, dd/MM/yyyy
  if (!date) return '—';
  return new Date(date).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (date) => { // Định dạng ngày tháng sang dd/MM/yyyy, HH:mm
  if (!date) return '—';
  return new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTime = (date) => { // Định dạng thời gian sang HH:mm
  if (!date) return '—';
  return new Date(date).toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatCountdown = (seconds) => { // Định dạng thời gian đếm ngược sang MM:ss
  const safeSeconds = Math.max(0, Number(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};
