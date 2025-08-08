export interface LiveMessage {
  liveId: number;
  userId: number;
  content: string;
}

export interface LiveMessageRecord {
  live_id: number;
  user_id: number;
  content: string;
}

export type NewLiveMessage = LiveMessage;
export type NewLiveMessageRecord = LiveMessageRecord;

export function mapLiveMessageRecordToLiveMessage(r: LiveMessageRecord): LiveMessage {
  return {
    liveId: Number(r.live_id),
    userId: Number(r.user_id),
    content: r.content,
  };
}

export function mapLiveMessageToRecord(p: LiveMessage): LiveMessageRecord {
  return {
    live_id: p.liveId,
    user_id: p.userId,
    content: p.content,
  };
}
