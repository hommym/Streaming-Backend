export enum PlaylistSource {
  System = "system",
  User = "user",
}

export interface Playlist {
  id: number;
  title: string;
  ownerId: number;
  src: PlaylistSource;
  createdAt: string; // DATE as ISO string (yyyy-mm-dd)
}

export interface PlaylistRecord {
  id: number;
  title: string;
  owner_id: number;
  src: PlaylistSource;
  created_at: string; // DATE
}

export type NewPlaylist = Omit<Playlist, "id">;
export type NewPlaylistRecord = Omit<PlaylistRecord, "id">;

export function mapPlaylistRecordToPlaylist(record: PlaylistRecord): Playlist {
  return {
    id: Number(record.id),
    title: record.title,
    ownerId: Number(record.owner_id),
    src: record.src,
    createdAt: record.created_at,
  };
}

export function mapNewPlaylistToRecord(p: NewPlaylist): NewPlaylistRecord {
  return {
    title: p.title,
    owner_id: p.ownerId,
    src: p.src,
    created_at: p.createdAt,
  };
}

export function mapPlaylistToRecord(p: Playlist): PlaylistRecord {
  return {
    id: p.id,
    title: p.title,
    owner_id: p.ownerId,
    src: p.src,
    created_at: p.createdAt,
  };
}
