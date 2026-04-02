import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieService from '../services/movie.api';
import GenreApi from '../services/genre.api';
import SearchBar from '../../../components/common/SearchBar/SearchBar';
import GenreFilter from '../components/GenreFilter/GenreFilter';
import MovieList from '../components/MovieList/MovieList';
import Spinner from '../../../components/common/Spinner/Spinner';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      MovieService.getAllMovies(),
      GenreApi.getAll().catch(() => []),
    ]).then(([movieData, genreData]) => {
      setMovies(Array.isArray(movieData) ? movieData : []);
      setGenres(Array.isArray(genreData) ? genreData : []);
      setLoading(false);
    });
  }, []);

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre ||
      movie.genres?.some((g) => g.id === selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const nowShowing = filteredMovies.filter(
    (m) => m.status === 'NOW_SHOWING' || m.status === 'DANG_CHIEU' || m.status === 'SHOWING' || !m.status
  );
  const comingSoon = filteredMovies.filter(
    (m) => m.status === 'COMING_SOON' || m.status === 'SAP_CHIEU' || m.status === 'COMING'
  );

  const featured = movies.length > 0 ? movies[0] : null;

  if (loading) return <Spinner size="large" />;

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <div className="home-page__hero">
        <div className="home-page__hero-bg" />
        <div className="home-page__hero-overlay" />
        <div className="home-page__hero-content">
          <div className="home-page__hero-eyebrow">Phim nổi bật tuần này</div>
          <div className="home-page__hero-title">{featured?.title || 'CineBook'}</div>
          <div className="home-page__hero-meta">
            {featured?.genres?.[0]?.name && <span>{featured.genres[0].name}</span>}
            {featured?.duration && (
              <>
                <div className="home-page__hero-sep" />
                <span>{featured.duration} phút</span>
              </>
            )}
            {featured?.ageLimit && (
              <>
                <div className="home-page__hero-sep" />
                <span>T{featured.ageLimit}+</span>
              </>
            )}
          </div>
          <div className="home-page__hero-btns">
            <button className="btn btn--primary btn--large" onClick={() => featured && navigate(`/movie/${featured.id}?book=true`)}>
              Đặt vé ngay
            </button>
            <button className="btn btn--ghost btn--large">▶ Xem trailer</button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="home-page__filters">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Tìm kiếm phim..."
        />
        <GenreFilter genres={genres} selectedGenre={selectedGenre} onSelect={setSelectedGenre} />
      </div>

      {/* Movie Grids */}
      <MovieList
        title="Phim đang chiếu"
        badge="now"
        movies={nowShowing.length > 0 ? nowShowing : filteredMovies}
        emptyMessage="Không tìm thấy phim phù hợp."
      />

      {comingSoon.length > 0 && (
        <MovieList
          title="Phim sắp chiếu"
          badge="soon"
          movies={comingSoon}
        />
      )}
    </div>
  );
};

export default Home;
