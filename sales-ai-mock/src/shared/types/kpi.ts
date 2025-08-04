import type {
  AnalyticsKPI,
  Department,
  SalesUser,
} from '../../types/analytics';

/**
 * KPIグリッド用の行データ型
 */
export interface KpiRow {
  key: string | number;
  department?: Department;
  user?: SalesUser;
  kpi: AnalyticsKPI;
  period: string;
  date?: string;
  name?: string;
}

/**
 * クロス分析グリッド用の行データ型
 */
export interface CrossAnalysisRow {
  key: string;
  name: string;
  category?: string;
  departmentName?: string;
  [key: string]: string | number | undefined; // 動的KPIフィールド用
}

/**
 * フィルター条件の型ガード
 */
export interface FilterWithDepartment {
  companyAxis: {
    departmentId: string;
    userId?: string;
    productId?: string;
    teamId?: string;
  };
}

export interface FilterWithUser {
  companyAxis: {
    departmentId?: string;
    userId: string;
    productId?: string;
    teamId?: string;
  };
}

export interface FilterWithIndustry {
  customerAxis: {
    industry: string;
    companySize?: string;
    isNewCustomer?: boolean;
    region?: string;
  };
}

export interface FilterWithCompanySize {
  customerAxis: {
    industry?: string;
    companySize: string;
    isNewCustomer?: boolean;
    region?: string;
  };
}

/**
 * グループ化タイプ
 */
export type GroupByType =
  | 'all'
  | 'department'
  | 'user'
  | 'industry'
  | 'companySize'
  | 'product';

/**
 * ビュータイプ
 */
export type ViewType = 'timeline' | 'department' | 'user' | 'product';

/**
 * ソート設定
 */
export interface SortConfig {
  field: string;
  order: 'ascend' | 'descend';
}
