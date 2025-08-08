export enum LiveType {
  Main = "main",
  Theatre = "theatre",
}

export interface LiveStream {
  id: number;
  playlistId: number;
  streamLink: string;
  liveType: LiveType;
}

export interface LiveStreamRecord {
  id: number;
  playlist_id: number;
  stream_link: string;
  live_type: LiveType;
}

export type NewLiveStream = Omit<LiveStream, "id">;
export type NewLiveStreamRecord = Omit<LiveStreamRecord, "id">;

export function mapLiveStreamRecordToLiveStream(r: LiveStreamRecord): LiveStream {
  return {
    id: Number(r.id),
    playlistId: Number(r.playlist_id),
    streamLink: r.stream_link,
    liveType: r.live_type,
  };
}

export function mapNewLiveStreamToRecord(p: NewLiveStream): NewLiveStreamRecord {
  return {
    playlist_id: p.playlistId,
    stream_link: p.streamLink,
    live_type: p.liveType,
  };
}

export function mapLiveStreamToRecord(p: LiveStream): LiveStreamRecord {
  return {
    id: p.id,
    playlist_id: p.playlistId,
    stream_link: p.streamLink,
    live_type: p.liveType,
  };
}
