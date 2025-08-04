// KPI拡張データ構造定義
export interface AnalyticsKPI {
  // 基本KPI項目（9項目）
  callCount: number;              // 架電数
  connectCount: number;           // 通電数
  appointmentCount: number;       // アポ獲得数
  visitCount: number;             // 訪問数
  negotiationCount: number;       // 商談数
  negotiationUnitPrice: number;   // 商談単価（平均）
  orderCount: number;             // 受注件数
  orderUnitPrice: number;         // 受注単価（平均）
  lostCount: number;              // 失注件数
}

// 分析軸タイプ
export interface AnalysisAxis {
  timeAxis: TimeAxis;             // 時間軸
  companyAxis: CompanyAxis;       // 自社軸
  customerAxis: CustomerAxis;     // 顧客軸
  analysisType: AnalysisType;     // 分析軸
}

// 時間軸
export interface TimeAxis {
  startDate: string;              // 開始日
  endDate: string;                // 終了日
  granularity: 'daily' | 'weekly' | 'monthly' | 'yearly';  // 粒度
}

// 自社軸
export interface CompanyAxis {
  departmentId?: string;          // 部署ID
  userId?: string;                // 営業担当者ID
  productId?: string;             // 商材ID
  teamId?: string;                // チームID
}

// 顧客軸
export interface CustomerAxis {
  companySize?: 'small' | 'medium' | 'large' | 'enterprise';  // 企業規模
  industry?: string;              // 業界
  isNewCustomer?: boolean;        // 新規/既存
  region?: string;                // 地域
}

// 分析タイプ
export type AnalysisType = 
  | 'average'      // 平均値
  | 'median'       // 中央値
  | 'top5'         // 上位5人
  | 'bottom5'      // 下位5人
  | 'total'        // 合計
  | 'trend';       // トレンド

// フィルター条件
export interface FilterCondition {
  timeAxis?: TimeAxis;
  companyAxis?: CompanyAxis;
  customerAxis?: CustomerAxis;
  analysisType?: AnalysisType;
}

// 分析結果
export interface AnalyticsResult {
  kpi: AnalyticsKPI;
  filters: FilterCondition;
  period: {
    start: string;
    end: string;
  };
  metadata?: {
    calculatedAt: string;
    dataPoints: number;
    reliability: 'high' | 'medium' | 'low';
  };
}

// 部署情報
export interface Department {
  id: string;
  name: string;
  parentId?: string;
  level: number;
}

// 営業担当者情報
export interface SalesUser {
  id: string;
  name: string;
  departmentId: string;
  role: 'sales' | 'manager' | 'director';
  teamId?: string;
}

// 商材情報
export interface Product {
  id: string;
  name: string;
  category: string;
  basePrice: number;
}

// KPIトレンドデータ
export interface KPITrend {
  date: string;
  kpi: AnalyticsKPI;
}

// 営業ファネルデータ
export interface SalesFunnel {
  stage: 'call' | 'connect' | 'appointment' | 'visit' | 'negotiation' | 'order';
  count: number;
  conversionRate: number;  // 前段階からの転換率
}

// マネジメント用集計データ
export interface ManagementSummary {
  department: Department;
  users: SalesUser[];
  kpiSummary: AnalyticsKPI;
  trends: KPITrend[];
  funnel: SalesFunnel[];
  topPerformers: {
    user: SalesUser;
    kpi: AnalyticsKPI;
  }[];
  bottomPerformers: {
    user: SalesUser;
    kpi: AnalyticsKPI;
  }[];
}