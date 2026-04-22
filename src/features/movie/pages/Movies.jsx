import React, { useState, useEffect } from 'react';
import './Movies.css';
import DateTabs from '../components/DateTabs/DateTabs';
import MovieScheduleCard from '../components/MovieScheduleCard/MovieScheduleCard';
import MovieService from '../services/movie.api';

/**
 * Trang Lịch Chiếu Phim Truyền thống (Movies Page).
 * Nơi người dùng có thể chọn một ngày bất kỳ trong tuần để xem đang có rạp nào, giờ nào mở suất chiếu.
 * Call API tự động mỗi khi người dùng ấn vào thanh chọn ngày `DateTabs`.
 *
 * @returns {JSX.Element} Giao diện hệ thống biểu diễn lịch chiếu toàn cục.
 */
const Movies = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Tự động làm mới lịch chiếu (`fetchSchedule`) khi state `selectedDate` thay đổi.
     */
    useEffect(() => {
        fetchSchedule(selectedDate);
    }, [selectedDate]);

    /** Hỏi server danh sách các phân bổ giờ chiếu dựa trên ngày truyền vào */
    const fetchSchedule = async (date) => {
        setLoading(true);
        setError(null);
        try {
            const data = await MovieService.getSchedule(date);
            setSchedule(data || []);
        } catch (err) {
            console.error('Error fetching schedule:', err);
            setError('Không thể tải lịch chiếu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="movies-page">
            <div className="inner">
                <h1 className="ptitle">Lịch chiếu</h1>
                <p className="psub">Chọn ngày và suất chiếu phù hợp với bạn</p>

                <DateTabs 
                    selectedDate={selectedDate} 
                    onDateChange={setSelectedDate} 
                />

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Đang tải lịch chiếu...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                        <button className="btn-hero" onClick={() => fetchSchedule(selectedDate)}>Thử lại</button>
                    </div>
                ) : schedule.length > 0 ? (
                    <div className="schedule-list">
                        {schedule.map((movie) => (
                            <MovieScheduleCard key={movie.movieId} movie={movie} />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📅</div>
                        <p>Hiện không có suất chiếu nào cho ngày này.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Movies;
