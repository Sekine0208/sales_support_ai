import type { FilterCondition } from '../../types/analytics';
import type {
  FilterWithDepartment,
  FilterWithUser,
  FilterWithIndustry,
  FilterWithCompanySize,
} from '../types/kpi';

/**
 * 部署フィルターが設定されているかチェック
 */
export const hasDepartmentFilter = (
  filter: FilterCondition
): filter is FilterCondition & FilterWithDepartment => {
  return Boolean(filter.companyAxis?.departmentId);
};

/**
 * ユーザーフィルターが設定されているかチェック
 */
export const hasUserFilter = (
  filter: FilterCondition
): filter is FilterCondition & FilterWithUser => {
  return Boolean(filter.companyAxis?.userId);
};

/**
 * 業界フィルターが設定されているかチェック
 */
export const hasIndustryFilter = (
  filter: FilterCondition
): filter is FilterCondition & FilterWithIndustry => {
  return Boolean(filter.customerAxis?.industry);
};

/**
 * 企業規模フィルターが設定されているかチェック
 */
export const hasCompanySizeFilter = (
  filter: FilterCondition
): filter is FilterCondition & FilterWithCompanySize => {
  return Boolean(filter.customerAxis?.companySize);
};

/**
 * 日付が指定範囲内かチェック
 */
export const isInDateRange = (
  date: string,
  startDate: string,
  endDate: string,
  period?: string
): boolean => {
  if (period) {
    // 月次データの場合 (period: "2025-01")
    const periodDate = new Date(period + '-01');
    const start = new Date(startDate);
    const end = new Date(endDate);
    return periodDate >= start && periodDate <= end;
  } else {
    // 日次・週次データの場合 (date: "2025-01-01")
    const itemDate = new Date(date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    return itemDate >= start && itemDate <= end;
  }
};
