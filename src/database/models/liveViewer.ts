export interface LiveViewer {
  connectionId: number;
  userId: number;
  liveId: number;
}

export interface LiveViewerRecord {
  connection_id: number;
  user_id: number;
  live_id: number;
}

export type NewLiveViewer = LiveViewer;
export type NewLiveViewerRecord = LiveViewerRecord;

export function mapLiveViewerRecordToLiveViewer(r: LiveViewerRecord): LiveViewer {
  return {
    connectionId: Number(r.connection_id),
    userId: Number(r.user_id),
    liveId: Number(r.live_id),
  };
}

export function mapLiveViewerToRecord(p: LiveViewer): LiveViewerRecord {
  return {
    connection_id: p.connectionId,
    user_id: p.userId,
    live_id: p.liveId,
  };
}
