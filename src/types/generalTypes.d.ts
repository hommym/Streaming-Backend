export type ServerType = "main" | "file" | "ws";

export type WelcomeEmailArgs = {
  recipientEmail: string;
  fullName: string;
};

export type ResetAccountEmailArgs = {
  recipientEmail: string;
  fullName: string;
  plainPassword: string;
};

type TMDBMovieGenre = {
  id: number;
  name: string;
};

export type MovieDetails = {
  id: number;
  title: string;
  description: string;
  posterUrl: string;
  backdropUrl: string;
  rating: number;
  releaseYear: string;
  duration: number; // in minutes
  genres: string[];
  streamUrl?: string;
};

export type MovieOverview = {
  id: number;
  title: string;
  posterUrl: string;
  rating: number;
  releaseYear: string;
};

export type MovieOverviewList = {
  page: number;
  movies: MovieOverview[];
  totalPages: number;
  totalNo: number;
};

export type TMDBMovie = {
  adult: boolean; // Defaults to true
  backdrop_path: string;
  genre_ids?: number[]; // array of integers
  genres?: TMDBMovieGenre[];
  id: number; // Defaults to 0
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number; // Defaults to 0
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean; // Defaults to true
  vote_average: number; // Defaults to 0
  vote_count: number; // Defaults to 0
  runtime?: number;
};

export type TMDBResult = {
  page: number;
  results: TMDBMovie[];
  total_pages: number;
  total_results: number;
};

export type CacheArgs = {
  key: string;
  value: string;
  exp?: number;  // time in seconds 
};
