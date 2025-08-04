// 訪問ステータス
export type VisitStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'rescheduled';

// 訪問結果
export type VisitResult = '成功' | '失敗' | '再訪問' | 'キャンセル';

// 訪問情報
export interface Visit {
  id: string;
  callId?: string; // 架電IDとの紐付け（アポから発生した場合）
  userId: string;
  companyId: string;
  companyName: string;
  contactId: string;
  contactName: string;
  scheduledDate: string;
  actualDate?: string;
  visitStatus: VisitStatus;
  purpose: string;
  location: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 訪問結果詳細
export interface VisitResultDetail {
  id: string;
  visitId: string;
  result: VisitResult;
  hasNegotiation: boolean; // 商談発生フラグ
  negotiationId?: string; // 商談ID（商談が発生した場合）
  nextAction?: string;
  summary: string;
  details?: string;
  createdAt: string;
}

// 訪問リストアイテム（一覧表示用）
export interface VisitListItem {
  id: string;
  companyName: string;
  contactName: string;
  scheduledDate: string;
  visitStatus: VisitStatus;
  purpose: string;
  location: string;
  phoneNumber?: string;
  hasNegotiation?: boolean;
  lastResult?: VisitResult;
}
