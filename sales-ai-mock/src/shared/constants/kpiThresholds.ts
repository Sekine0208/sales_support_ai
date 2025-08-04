/**
 * KPI計算で使用する閾値・変換率定数
 * ビジネスロジックの数値をここで一元管理
 */

/**
 * 営業ファネル変換率
 */
export const KPI_CONVERSION_RATES = {
  /** 架電数 → 通電数の目標変換率 */
  CALL_TO_CONNECT: 0.4,

  /** 通電数 → アポ獲得数の目標変換率 */
  CONNECT_TO_APPOINTMENT: 0.25,

  /** 訪問数 → 商談数の目標変換率 */
  VISIT_TO_NEGOTIATION: 0.5,

  /** 商談数 → 受注数の目標変換率 */
  NEGOTIATION_TO_ORDER: 0.35,
} as const;

/**
 * 達成率評価閾値
 */
export const ACHIEVEMENT_THRESHOLDS = {
  /** 優秀評価の最低達成率 */
  EXCELLENT: 100,

  /** 良好評価の最低達成率 */
  GOOD: 80,

  /** 改善要評価の最高達成率 */
  NEEDS_IMPROVEMENT: 79,
} as const;

/**
 * 失注率評価閾値
 */
export const LOSS_RATE_THRESHOLDS = {
  /** 危険レベルの失注率 */
  DANGER: 50,

  /** 注意レベルの失注率 */
  WARNING: 30,
} as const;

/**
 * テーブル・ページネーション設定
 */
export const TABLE_CONFIG = {
  /** デフォルトページサイズ */
  DEFAULT_PAGE_SIZE: 20,

  /** テーブル最大高さ */
  MAX_TABLE_HEIGHT: 600,

  /** 水平スクロール最小幅 */
  MIN_SCROLL_WIDTH: 1420,
} as const;
