import managementData from '../data/managementData.json';

export interface UserDailyKpi {
  userId: string;
  userName: string;
  departmentId: string;
  date: string;
  callCount: number;
  connectCount: number;
  appointmentCount: number;
  visitCount: number;
  negotiationCount: number;
  negotiationAmount: number;
  orderCount: number;
  orderAmount: number;
  lostCount: number;
}

export interface AggregatedKpi {
  callCount: number;
  connectCount: number;
  appointmentCount: number;
  visitCount: number;
  negotiationCount: number;
  negotiationAmount: number;
  orderCount: number;
  orderAmount: number;
  lostCount: number;
  negotiationUnitPrice: number;
}

export interface UserAggregatedKpi extends AggregatedKpi {
  userId: string;
  userName: string;
  departmentId: string;
  departmentName: string;
}

/**
 * 指定期間のrawdataを取得
 */
export const getRawDataByPeriod = (
  startDate: string,
  endDate: string,
  userId?: string,
  departmentId?: string
): UserDailyKpi[] => {
  const rawData = managementData.userDailyKpiRawData as UserDailyKpi[];
  
  return rawData.filter(item => {
    const itemDate = new Date(item.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const inDateRange = itemDate >= start && itemDate <= end;
    const matchesUser = !userId || item.userId === userId;
    const matchesDepartment = !departmentId || item.departmentId === departmentId;
    
    return inDateRange && matchesUser && matchesDepartment;
  });
};

/**
 * rawdataを集計してKPIを計算
 */
export const aggregateKpiData = (rawData: UserDailyKpi[]): AggregatedKpi => {
  const totals = rawData.reduce(
    (acc, item) => ({
      callCount: acc.callCount + item.callCount,
      connectCount: acc.connectCount + item.connectCount,
      appointmentCount: acc.appointmentCount + item.appointmentCount,
      visitCount: acc.visitCount + item.visitCount,
      negotiationCount: acc.negotiationCount + item.negotiationCount,
      negotiationAmount: acc.negotiationAmount + item.negotiationAmount,
      orderCount: acc.orderCount + item.orderCount,
      orderAmount: acc.orderAmount + item.orderAmount,
      lostCount: acc.lostCount + item.lostCount,
    }),
    {
      callCount: 0,
      connectCount: 0,
      appointmentCount: 0,
      visitCount: 0,
      negotiationCount: 0,
      negotiationAmount: 0,
      orderCount: 0,
      orderAmount: 0,
      lostCount: 0,
    }
  );

  // 商談単価を計算（商談金額の平均）
  const negotiationUnitPrice = totals.negotiationCount > 0 
    ? Math.round(totals.negotiationAmount / totals.negotiationCount)
    : 0;

  return {
    ...totals,
    negotiationUnitPrice,
  };
};

/**
 * ユーザー別にKPIを集計
 */
export const aggregateKpiByUser = (
  startDate: string,
  endDate: string,
  departmentId?: string
): UserAggregatedKpi[] => {
  const rawData = getRawDataByPeriod(startDate, endDate, undefined, departmentId);
  const users = managementData.users;
  const departments = managementData.departments;
  
  // ユーザーIDでグループ化
  const groupedByUser = rawData.reduce((acc, item) => {
    if (!acc[item.userId]) {
      acc[item.userId] = [];
    }
    acc[item.userId].push(item);
    return acc;
  }, {} as Record<string, UserDailyKpi[]>);

  // 各ユーザーのKPIを集計
  return Object.entries(groupedByUser).map(([userId, userRawData]) => {
    const aggregated = aggregateKpiData(userRawData);
    const user = users.find(u => u.id === userId);
    const department = departments.find(d => d.id === user?.departmentId);
    
    return {
      ...aggregated,
      userId,
      userName: user?.name || '',
      departmentId: user?.departmentId || '',
      departmentName: department?.name || '',
    };
  });
};

/**
 * 全体のKPI集計
 */
export const getTotalKpi = (
  startDate: string,
  endDate: string,
  departmentId?: string
): AggregatedKpi => {
  const rawData = getRawDataByPeriod(startDate, endDate, undefined, departmentId);
  return aggregateKpiData(rawData);
}; 