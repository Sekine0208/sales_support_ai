/**
 * 数値・通貨・期間フォーマッタ関数集
 * 複数コンポーネントで使用される共通フォーマット処理
 */

/**
 * 数値をロケール対応でフォーマット
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ja-JP').format(num);
};

/**
 * 数値を通貨形式でフォーマット
 */
export const formatCurrency = (num: number): string => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(num);
};

/**
 * 達成率に応じた色を取得
 */
export const getAchievementColor = (rate: number): string => {
  if (rate >= 100) return '#52c41a';
  if (rate >= 80) return '#faad14';
  return '#f5222d';
};

/**
 * 期間フォーマット
 */
export const formatPeriod = (
  period: string,
  date?: string,
  granularity: 'daily' | 'weekly' | 'monthly' | 'yearly' = 'monthly'
): string => {
  if (date) {
    const d = new Date(date);
    if (granularity === 'daily') {
      return d.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
    } else if (granularity === 'weekly') {
      const weekStart = new Date(date);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      return `${weekStart.toLocaleDateString('ja-JP', {
        month: '2-digit',
        day: '2-digit',
      })}週`;
    }
  }
  if (granularity === 'monthly' && period) {
    return period;
  }
  if (granularity === 'yearly' && period) {
    return period + '年';
  }
  return period;
};

/**
 * 達成率を計算
 */
export const getAchievementRate = (actual: number, target: number): number => {
  return target > 0 ? Math.round((actual / target) * 100) : 0;
};
