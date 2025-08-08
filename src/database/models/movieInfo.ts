export enum MovieInfoSource {
  System = "system",
}

export interface MovieInfo {
  id: number;
  title: string;
  duration: string; // stored as VARCHAR(4)
  genre: string;
  ratings: number;
  description: string | null;
  posterUrl: string | null;
  movieUrl: string;
  src: MovieInfoSource;
}

export interface MovieInfoRecord {
  id: number;
  title: string;
  duration: string;
  genre: string;
  ratings: number;
  descrip: string | null;
  poster_url: string | null;
  movie_url: string;
  src: MovieInfoSource;
}

export type NewMovieInfo = Omit<MovieInfo, "id">;
export type NewMovieInfoRecord = Omit<MovieInfoRecord, "id">;

export function mapMovieInfoRecordToMovieInfo(record: MovieInfoRecord): MovieInfo {
  return {
    id: Number(record.id),
    title: record.title,
    duration: record.duration,
    genre: record.genre,
    ratings: Number(record.ratings ?? 0),
    description: record.descrip,
    posterUrl: record.poster_url,
    movieUrl: record.movie_url,
    src: record.src,
  };
}

export function mapNewMovieInfoToRecord(movie: NewMovieInfo): NewMovieInfoRecord {
  return {
    title: movie.title,
    duration: movie.duration,
    genre: movie.genre,
    ratings: movie.ratings ?? 0,
    descrip: movie.description ?? null,
    poster_url: movie.posterUrl ?? null,
    movie_url: movie.movieUrl,
    src: movie.src,
  };
}

export function mapMovieInfoToRecord(movie: MovieInfo): MovieInfoRecord {
  return {
    id: movie.id,
    title: movie.title,
    duration: movie.duration,
    genre: movie.genre,
    ratings: movie.ratings,
    descrip: movie.description,
    poster_url: movie.posterUrl,
    movie_url: movie.movieUrl,
    src: movie.src,
  };
}
