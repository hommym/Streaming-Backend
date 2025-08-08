export enum InfoSource {
  System = "system",
  Tmdb = "tmdb",
}

export interface PlaylistItem {
  id: number;
  playlistId: number;
  movieId: number;
  orderNo: number;
  infoSrc: InfoSource | null;
  movieTitle: string;
  posterUrl: string;
  createdAt: string; // DATE
}

export interface PlaylistItemRecord {
  id: number;
  play_list_id: number;
  movie_id: number;
  order_no: number;
  info_src: InfoSource | null;
  movie_title: string;
  poster_url: string;
  created_at: string;
}

export type NewPlaylistItem = Omit<PlaylistItem, "id">;
export type NewPlaylistItemRecord = Omit<PlaylistItemRecord, "id">;

export function mapPlaylistItemRecordToPlaylistItem(r: PlaylistItemRecord): PlaylistItem {
  return {
    id: Number(r.id),
    playlistId: Number(r.play_list_id),
    movieId: Number(r.movie_id),
    orderNo: Number(r.order_no),
    infoSrc: r.info_src,
    movieTitle: r.movie_title,
    posterUrl: r.poster_url,
    createdAt: r.created_at,
  };
}

export function mapNewPlaylistItemToRecord(p: NewPlaylistItem): NewPlaylistItemRecord {
  return {
    play_list_id: p.playlistId,
    movie_id: p.movieId,
    order_no: p.orderNo,
    info_src: p.infoSrc,
    movie_title: p.movieTitle,
    poster_url: p.posterUrl,
    created_at: p.createdAt,
  };
}

export function mapPlaylistItemToRecord(p: PlaylistItem): PlaylistItemRecord {
  return {
    id: p.id,
    play_list_id: p.playlistId,
    movie_id: p.movieId,
    order_no: p.orderNo,
    info_src: p.infoSrc,
    movie_title: p.movieTitle,
    poster_url: p.posterUrl,
    created_at: p.createdAt,
  };
}
