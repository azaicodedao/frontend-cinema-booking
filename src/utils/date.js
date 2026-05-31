// Định dạng ngày tháng sang dạng YYYY-MM-DD từ API
export const formatLocalDate = (date) => {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
        return '';
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};
// Định dạng ngày tháng sang dạng YYYY-MM-DD từ component
export const parseLocalDateString = (dateTimeString) => {
    if (!dateTimeString) {
        return '';
    }

    const date = new Date(dateTimeString);
    return formatLocalDate(date);
};
// Kiểm tra xem suất chiếu có phải là suất chiếu sắp tới không
export const isUpcomingShowtime = (showtime, now = new Date()) => {
    if (!showtime?.startTime) {
        return false;
    }

    const startTime = new Date(showtime.startTime);
    if (Number.isNaN(startTime.getTime())) {
        return false;
    }

    return showtime.status !== 'CLOSED' && startTime > now;
};
