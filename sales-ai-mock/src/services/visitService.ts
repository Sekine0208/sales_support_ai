import type { VisitListItem, CallItem } from '../types';

// 簡単なID生成関数
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 訪問データを保存するためのローカルストレージキー
const VISITS_STORAGE_KEY = 'sales_ai_visits';

// 新しい訪問データを生成
export const createVisitFromAppointment = (
  callItem: CallItem,
  appointmentNotes?: string
): VisitListItem => {
  const visitId = `VST_${generateId()}`;
  
  // 訪問予定日を1週間後に設定（デモ用）
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 7);
  scheduledDate.setHours(14, 0, 0, 0); // 14:00に設定

  const newVisit: VisitListItem = {
    id: visitId,
    companyName: callItem.companyName,
    contactName: callItem.contactPerson,
    scheduledDate: scheduledDate.toISOString(),
    visitStatus: 'scheduled',
    purpose: appointmentNotes || '商談・提案説明',
    location: `${callItem.companyName} 本社`,
    phoneNumber: callItem.phoneNumber,
    hasNegotiation: false,
  };

  return newVisit;
};

// B工業の特別なシナリオ用の訪問データ生成
export const createBIndustryVisit = (callItem: CallItem): VisitListItem => {
  const visitId = `VST_B_${generateId()}`;
  
  // B工業の場合は明日に設定
  const scheduledDate = new Date();
  scheduledDate.setDate(scheduledDate.getDate() + 1);
  scheduledDate.setHours(15, 30, 0, 0); // 15:30に設定

  const newVisit: VisitListItem = {
    id: visitId,
    companyName: callItem.companyName,
    contactName: callItem.contactPerson,
    scheduledDate: scheduledDate.toISOString(),
    visitStatus: 'scheduled',
    purpose: '新システム導入プレゼンテーション',
    location: 'B工業株式会社 本社 会議室A',
    phoneNumber: callItem.phoneNumber,
    hasNegotiation: true, // B工業は高確度案件
  };

  return newVisit;
};

// 訪問データをローカルストレージに保存
export const saveVisitData = (visit: VisitListItem): void => {
  try {
    const existingVisits = getStoredVisits();
    const updatedVisits = [...existingVisits, visit];
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updatedVisits));
  } catch (error) {
    console.error('Failed to save visit data:', error);
  }
};

// ローカルストレージから訪問データを取得
export const getStoredVisits = (): VisitListItem[] => {
  try {
    const stored = localStorage.getItem(VISITS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load visit data:', error);
    return [];
  }
};

// 訪問データを更新
export const updateVisitData = (visitId: string, updates: Partial<VisitListItem>): void => {
  try {
    const existingVisits = getStoredVisits();
    const updatedVisits = existingVisits.map(visit =>
      visit.id === visitId ? { ...visit, ...updates } : visit
    );
    localStorage.setItem(VISITS_STORAGE_KEY, JSON.stringify(updatedVisits));
  } catch (error) {
    console.error('Failed to update visit data:', error);
  }
};

// 架電結果からアポ獲得時の処理
export const handleAppointmentAcquired = (
  callItem: CallItem,
  notes?: string
): VisitListItem | null => {
  try {
    let newVisit: VisitListItem;

    // B工業の特別処理
    if (callItem.companyName.includes('B工業')) {
      newVisit = createBIndustryVisit(callItem);
      console.log('🎯 B工業の特別シナリオでアポを生成しました:', newVisit);
    } else {
      newVisit = createVisitFromAppointment(callItem, notes);
    }

    // 訪問データを保存
    saveVisitData(newVisit);
    
    return newVisit;
  } catch (error) {
    console.error('Failed to create visit from appointment:', error);
    return null;
  }
};

// 初期化フラグ
let isInitialized = false;

// 初期化用：デフォルトデータがない場合の処理
export const initializeVisitData = (): void => {
  if (isInitialized) {
    return; // 既に初期化済みの場合は何もしない
  }
  
  const stored = getStoredVisits();
  if (stored.length === 0) {
    // デフォルトデータがない場合は何もしない（visitData.jsonからロード）
    console.log('Visit service initialized');
  }
  
  isInitialized = true;
}; 