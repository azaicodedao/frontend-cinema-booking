import React, { useState, useEffect, useMemo } from 'react';
import './Movies.css';
import DateTabs from '../components/DateTabs/DateTabs';
import MovieScheduleCard from '../components/MovieScheduleCard/MovieScheduleCard';
import MovieService from '../services/movie.api';

/**
 * Trang Lịch Chiếu Phim Truyền thống (Movies Page).
 * Nơi người dùng có thể chọn một ngày bất kỳ trong tuần để xem đang có rạp nào, giờ nào mở suất chiếu.
 * Bản sửa lỗi triệt để N+1 Query: Tải toàn bộ dữ liệu một lần và lọc tại Client.
 *
 * @returns {JSX.Element} Giao diện hệ thống biểu diễn lịch chiếu toàn cục.
 */
const Movies = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [fullSchedule, setFullSchedule] = useState([]); // Chứa toàn bộ dữ liệu từ server
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Tải TOÀN BỘ lịch chiếu một lần duy nhất khi trang được load.
     */
    useEffect(() => {
        fetchAllSchedules();
    }, []);

    const fetchAllSchedules = async () => {
        setLoading(true);
        setError(null);
        try {
            // Gọi API không truyền date để lấy toàn bộ lịch chiếu từ hôm nay trở đi
            const data = await MovieService.getSchedule();
            setFullSchedule(data || []);
        } catch (err) {
            console.error('Error fetching full schedule:', err);
            setError('Không thể tải lịch chiếu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * Logic Lọc tại Client (Client-side Filtering):
     * Dựa trên selectedDate, lọc ra các suất chiếu tương ứng từ fullSchedule.
     * Dùng useMemo để tối ưu hiệu năng, chỉ tính toán lại khi fullSchedule hoặc selectedDate thay đổi.
     */
    const filteredSchedule = useMemo(() => {
        return fullSchedule
            .map(movie => ({
                ...movie,
                // Lọc các suất chiếu khớp với ngày đang chọn
                showtimes: movie.showtimes.filter(st => {
                    const stDate = st.startTime.split('T')[0];
                    return stDate === selectedDate;
                })
            }))
            // Chỉ giữ lại những phim có suất chiếu trong ngày đó
            .filter(movie => movie.showtimes.length > 0);
    }, [fullSchedule, selectedDate]);

    return (
        <div className="movies-page">
            <div className="inner">
                <h1 className="ptitle">Lịch chiếu</h1>
                <p className="psub">Chọn ngày và suất chiếu phù hợp với bạn</p>

                <DateTabs 
                    selectedDate={selectedDate} 
                    onDateChange={setSelectedDate} 
                />

                <div className="schedule-container" style={{ minHeight: '400px' }}>
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Đang chuẩn bị lịch chiếu...</p>
                        </div>
                    ) : error ? (
                        <div className="error-state">
                            <p>{error}</p>
                            <button className="btn-hero" onClick={fetchAllSchedules}>Thử lại</button>
                        </div>
                    ) : filteredSchedule.length > 0 ? (
                        <div className="schedule-list animate-fade-in">
                            {filteredSchedule.map((movie) => (
                                <MovieScheduleCard key={movie.movieId} movie={movie} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📅</div>
                            <p>Hiện không có suất chiếu nào cho ngày {selectedDate}.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Movies;
