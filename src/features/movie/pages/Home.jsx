import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../../context/AuthContext';
import MovieService from '../services/movie.api';
import GenreApi from '../services/genre.api';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import GenreFilter from '../components/GenreFilter/GenreFilter';
import MovieList from '../components/MovieList/MovieList';
import Spinner from '../../../components/common/Spinner/Spinner';
import './Home.css';

/**
 * Thời gian hiển thị mỗi slide trước khi tự động chuyển (tính bằng mili-giây).
 * 5000ms = 5 giây.
 */
const SLIDE_INTERVAL = 5000;

/**
 * Component trang chủ (Home Page).
 * Xử lý tải danh sách phim, phim nổi bật (Carousel), bộ lọc thể loại
 * và hiển thị phim đang chiếu, sắp chiếu theo chế độ có thể mở rộng.
 *
 * @returns {JSX.Element} Trang chủ của hệ thống.
 */
const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useContext(AuthContext);

  /**
   * State theo dõi slide đang hiển thị trong Carousel.
   * Giá trị là chỉ số (index) của phim trong mảng slides.
   */
  const [activeSlide, setActiveSlide] = useState(0);

  /**
   * Tải dữ liệu phim, phim nổi bật và danh sách thể loại từ Backend.
   * Chạy 1 lần duy nhất khi component được mount lên DOM.
   */
  useEffect(() => {
    Promise.all([
      MovieService.getAllMovies(),
      MovieService.getFeaturedMovies(),
      GenreApi.getAll().catch(() => []),
    ]).then(([movieData, featuredData, genreData]) => {
      setMovies(Array.isArray(movieData) ? movieData : []);
      setFeaturedMovies(Array.isArray(featuredData) ? featuredData : []);
      setGenres(Array.isArray(genreData) ? genreData : []);
      setLoading(false);
    });
  }, []);

  /**
   * Danh sách phim hiển thị trong Carousel.
   * Nếu có phim Featured → dùng danh sách đó.
   * Nếu không có phim Featured → fallback lấy phim đầu tiên trong danh sách chung.
   */
  const slides = featuredMovies.length > 0
    ? featuredMovies
    : (movies.length > 0 ? [movies[0]] : []);

  /**
   * Hàm chuyển sang slide tiếp theo (vòng lặp quay về đầu khi hết).
   * Dùng useCallback để tối ưu hiệu năng, tránh tạo lại function mỗi lần render.
   */
  const goToNextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  /**
   * Bộ hẹn giờ tự động chuyển slide sau mỗi 5 giây.
   * - Chỉ chạy khi có ít nhất 2 slide (nếu chỉ có 1 thì không cần trượt).
   * - Tự động dọn dẹp (clearInterval) khi component bị unmount hoặc khi
   *   activeSlide thay đổi (reset lại bộ đếm để đảm bảo đủ 5 giây cho slide mới).
   */
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(goToNextSlide, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length, goToNextSlide, activeSlide]);

  /**
   * Hàm xử lý khi người dùng bấm vào nút "Đặt vé ngay" trên banner.
   * - Nếu chưa đăng nhập → chuyển hướng sang trang Login kèm thông tin redirect.
   * - Nếu đã đăng nhập → chuyển thẳng đến trang chi tiết phim với mode đặt vé.
   *
   * @param {Object} movie - Đối tượng phim được chọn.
   */
  const handleBookClick = (movie) => {
    if (!movie) return;
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/movie/${movie.id}`, search: '?book=true' } } });
    } else {
      navigate(`/movie/${movie.id}?book=true`);
    }
  };

  /**
   * Hàm xử lý khi người dùng bấm "Xem trailer".
   * Mở link trailer trong tab mới hoặc hiển thị thông báo nếu chưa có trailer.
   *
   * @param {Object} movie - Đối tượng phim được chọn.
   */
  const handleTrailerClick = (movie) => {
    if (movie?.trailerUrl) {
      window.open(movie.trailerUrl, '_blank');
    } else {
      alert('Trailer đang được cập nhật!');
    }
  };

  // --- Lọc phim theo từ khóa tìm kiếm và thể loại ---
  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre ||
      movie.genres?.some((g) => g.id === selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const [showAllNow, setShowAllNow] = useState(false);
  const [showAllSoon, setShowAllSoon] = useState(false);
  const VISIBLE_LIMIT = 7;

  const nowShowing = filteredMovies.filter(
    (m) => m.status === 'NOW_SHOWING' || m.status === 'DANG_CHIEU' || m.status === 'SHOWING' || !m.status
  );
  const comingSoon = filteredMovies.filter(
    (m) => m.status === 'COMING_SOON' || m.status === 'SAP_CHIEU' || m.status === 'COMING'
  );

  const displayedNowShowing = showAllNow ? nowShowing : nowShowing.slice(0, VISIBLE_LIMIT);
  const displayedComingSoon = showAllSoon ? comingSoon : comingSoon.slice(0, VISIBLE_LIMIT);

  if (loading) return <Spinner size="large" />;

  return (
    <div className="home-page">

      {/* ============================================================
          HERO CAROUSEL BANNER
          Hiển thị nhiều phim nổi bật dưới dạng slideshow tự động.
          Mỗi slide gồm: ảnh poster nền + tên phim + nút hành động.
          ============================================================ */}
      <div className="home-page__hero">

        {/* Render từng slide — chỉ slide có class --active mới hiển thị */}
        {slides.map((movie, index) => (
          <div
            key={movie.id || index}
            className={`home-page__slide ${index === activeSlide ? 'home-page__slide--active' : ''}`}
          >
            {/* Ảnh nền poster */}
            <div
              className="home-page__hero-bg"
              style={movie.posterUrl ? { backgroundImage: `url(${movie.posterUrl})` } : {}}
            />
            {/* Lớp phủ gradient tối */}
            <div className="home-page__hero-overlay" />

            {/* Nội dung chữ và nút */}
            <div className="home-page__hero-content">
              <div className="home-page__hero-eyebrow">Phim nổi bật tuần này</div>
              <div className="home-page__hero-title">{movie.title || 'CineBook'}</div>
              <div className="home-page__hero-meta">
                {movie.genres?.[0]?.name && <span>{movie.genres[0].name}</span>}
                {movie.duration && (
                  <>
                    <div className="home-page__hero-sep" />
                    <span>{movie.duration} phút</span>
                  </>
                )}
                {movie.ageRating && (
                  <>
                    <div className="home-page__hero-sep" />
                    <span>T{movie.ageRating}+</span>
                  </>
                )}
              </div>
              <div className="home-page__hero-btns">
                <button
                  className="btn btn--primary btn--large"
                  onClick={() => handleBookClick(movie)}
                >
                  Đặt vé ngay
                </button>
                <button
                  className="btn btn--ghost btn--large"
                  onClick={() => handleTrailerClick(movie)}
                >
                  ▶ Xem trailer
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Các chấm điều hướng (Dots) — chỉ hiện khi có từ 2 slide trở lên */}
        {slides.length > 1 && (
          <div className="home-page__carousel-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`home-page__dot ${index === activeSlide ? 'home-page__dot--active' : ''}`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Chuyển đến phim ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* ============================================================
          BỘ LỌC PHIM (Search + Genre Filter)
          ============================================================ */}
      <div className="home-page__filters">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tìm kiếm phim..."
        />
        <GenreFilter genres={genres} selectedGenre={selectedGenre} onSelect={setSelectedGenre} />
      </div>

      {/* ============================================================
          DANH SÁCH PHIM (Đang chiếu / Sắp chiếu)
          ============================================================ */}
      <MovieList
        title="Phim đang chiếu"
        badge="now"
        movies={displayedNowShowing}
        emptyMessage="Không tìm thấy phim phù hợp."
        showSeeAll={nowShowing.length > VISIBLE_LIMIT}
        onSeeAll={() => setShowAllNow(!showAllNow)}
        isExpanded={showAllNow}
      />

      {comingSoon.length > 0 && (
        <MovieList
          title="Phim sắp chiếu"
          badge="soon"
          movies={displayedComingSoon}
          showSeeAll={comingSoon.length > VISIBLE_LIMIT}
          onSeeAll={() => setShowAllSoon(!showAllSoon)}
          isExpanded={showAllSoon}
        />
      )}
    </div>
  );
};

export default Home;
