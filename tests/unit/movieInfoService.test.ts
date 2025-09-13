import { movieinfoService } from "../../src/features/movie-info/movieInfoService";
import { TMDBResult, TMDBMovie } from "../../src/types/generalTypes";

describe("Runing MovieInfoService.tmdbApiResponseParser test..", () => {
  it("should parse TMDBResult to MovieOverviewList", () => {
    const tmdbResult: TMDBResult = {
      page: 1,
      total_pages: 2,
      total_results: 3,
      results: [
        {
          adult: false,
          backdrop_path: "/path/to/backdrop.jpg",
          genre_ids: [28, 12, 878],
          genres: [
            { id: 28, name: "Action" },
            { id: 12, name: "Adventure" },
            { id: 878, name: "Science Fiction" },
          ],
          id: 12345,
          original_language: "en",
          original_title: "The Example Movie",
          overview: "In a world where TypeScript rules, one developer must write perfect types...",
          popularity: 123.45,
          poster_path: "/path/to/poster.jpg",
          release_date: "2025-09-10",
          title: "The Example Movie",
          video: false,
          vote_average: 8.7,
          vote_count: 5421,
          runtime: 142,
        },
        {
          adult: true,
          backdrop_path: "/images/backdrops/dark-sky.jpg",
          genre_ids: [53, 9648],
          genres: [
            { id: 53, name: "Thriller" },
            { id: 9648, name: "Mystery" },
          ],
          id: 67890,
          original_language: "fr",
          original_title: "Le Secret de la Nuit",
          overview: "A detective unravels a series of mysterious events that challenge the very fabric of reality.",
          popularity: 87.32,
          poster_path: "/images/posters/dark-secret.jpg",
          release_date: "2024-11-22",
          title: "The Secret of the Night",
          video: true,
          vote_average: 7.3,
          vote_count: 1987,
          runtime: 118,
        },
      ],
    };

    const result = movieinfoService.tmdbApiResponseParser(tmdbResult);

    expect(result).toEqual({
      page: 1,
      totalPages: 2,
      totalNo: 3,
      movies: [
        {
          id: 12345,
          posterUrl: "https://image.tmdb.org/t/p/original/path/to/poster.jpg",
          rating: 8.7,
          releaseYear: "2025",
          title: "The Example Movie",
        },
        {
          id: 67890,
          posterUrl: "https://image.tmdb.org/t/p/original/images/posters/dark-secret.jpg",
          rating: 7.3,
          releaseYear: "2024",
          title: "Le Secret de la Nuit",
        },
      ],
    });
  });

  it("should parse TMDBMovie to MovieDetails", () => {
    const tmdbMovie: TMDBMovie = {
      adult: true,
      backdrop_path: "/images/backdrops/dark-sky.jpg",
      genre_ids: [53, 9648],
      genres: [
        { id: 53, name: "Thriller" },
        { id: 9648, name: "Mystery" },
      ],
      id: 67890,
      original_language: "fr",
      original_title: "Le Secret de la Nuit",
      overview: "A detective unravels a series of mysterious events that challenge the very fabric of reality.",
      popularity: 87.32,
      poster_path: "/images/posters/dark-secret.jpg",
      release_date: "2024-11-22",
      title: "The Secret of the Night",
      video: true,
      vote_average: 7.3,
      vote_count: 1987,
      runtime: 118,
    };

    const result = movieinfoService.tmdbApiResponseParser(tmdbMovie);

    expect(result).toEqual({
      genres: ["Thriller", "Mystery"],
      id: 67890,
      title: "The Secret of the Night",
      description: "A detective unravels a series of mysterious events that challenge the very fabric of reality.",
      streamUrl: undefined,
      releaseYear: "2024",
      rating: 7.3,
      duration: 118,
      posterUrl: "https://image.tmdb.org/t/p/original/images/posters/dark-secret.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/images/backdrops/dark-sky.jpg",
    });
  });

  it("should handle empty results array in TMDBResult", () => {
    const tmdbResult: TMDBResult = {
      page: 1,
      total_pages: 1,
      total_results: 0,
      results: [],
    };

    const result = movieinfoService.tmdbApiResponseParser(tmdbResult);

    expect(result).toEqual({
      page: 1,
      totalPages: 1,
      totalNo: 0,
      movies: [],
    });
  });

  it("should handle TMDBMovie with empty genres", () => {
    const tmdbMovie: TMDBMovie = {
      adult: true,
      backdrop_path: "/images/backdrops/dark-sky.jpg",
      genre_ids: [53, 9648],
      genres: [],
      id: 67890,
      original_language: "fr",
      original_title: "Le Secret de la Nuit",
      overview: "A detective unravels a series of mysterious events that challenge the very fabric of reality.",
      popularity: 87.32,
      poster_path: "/images/posters/dark-secret.jpg",
      release_date: "2024-11-22",
      title: "The Secret of the Night",
      video: true,
      vote_average: 7.3,
      vote_count: 1987,
      runtime: 118,
    };

    const result = movieinfoService.tmdbApiResponseParser(tmdbMovie);

    expect(result).toEqual({
      genres: [],
      id: 67890,
      title: "The Secret of the Night",
      description: "A detective unravels a series of mysterious events that challenge the very fabric of reality.",
      streamUrl: undefined,
      releaseYear: "2024",
      rating: 7.3,
      duration: 118,
      posterUrl: "https://image.tmdb.org/t/p/original/images/posters/dark-secret.jpg",
      backdropUrl: "https://image.tmdb.org/t/p/original/images/backdrops/dark-sky.jpg",
    });
  });
});
