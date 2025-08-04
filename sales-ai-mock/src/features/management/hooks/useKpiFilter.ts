import { useMemo } from 'react';
import type {
  FilterCondition,
  Department,
  SalesUser,
  AnalyticsKPI,
} from '../../../types/analytics';
import type { KpiRow, GroupByType } from '../../../shared/types/kpi';
import {
  hasDepartmentFilter,
  hasUserFilter,
  hasIndustryFilter,
  hasCompanySizeFilter,
  isInDateRange,
} from '../../../shared/utils/typeGuards';
import managementData from '../../../data/managementData.json';

interface UseKpiFilterParams {
  filters: FilterCondition;
  departments: Department[];
  users: SalesUser[];
}

interface UseKpiFilterReturn {
  filteredData: KpiRow[];
  groupBy: GroupByType;
}

/**
 * KPIデータのフィルタリングと集計を行うカスタムフック
 */
export const useKpiFilter = ({
  filters,
  departments,
  users,
}: UseKpiFilterParams): UseKpiFilterReturn => {
  const { filteredData, groupBy } = useMemo(() => {
    let data: KpiRow[] = [];
    let currentGroupBy: GroupByType = 'all';

    const startDate = filters.timeAxis?.startDate || '2025-01-01';
    const endDate = filters.timeAxis?.endDate || '2025-01-31';
    const granularity = filters.timeAxis?.granularity || 'monthly';

    // 集計単位に応じたデータソースの選択
    const getSourceData = () => {
      const baseFilter = (item: any) =>
        isInDateRange(item.date || '', startDate, endDate, item.period) &&
        (!hasDepartmentFilter(filters) ||
          item.departmentId === filters.companyAxis.departmentId);

      switch (granularity) {
        case 'daily':
          return managementData.dailyKPIData.filter(baseFilter);
        case 'weekly':
          return managementData.weeklyKPIData.filter(baseFilter);
        case 'yearly':
          return managementData.yearlyKPIData.filter(
            (item: any) =>
              !hasDepartmentFilter(filters) ||
              item.departmentId === filters.companyAxis.departmentId
          );
        default: // monthly
          return managementData.monthlyKPIData.filter(baseFilter);
      }
    };

    // グループ化の判定とデータ処理
    if (hasUserFilter(filters)) {
      currentGroupBy = 'user';
      data = managementData.userKPIData
        .filter(item => {
          if (item.userId !== filters.companyAxis.userId) {
            return false;
          }
          return isInDateRange('', startDate, endDate, item.period);
        })
        .map(item => ({
          key: `${item.userId}-${item.period}`,
          user: users.find(u => u.id === item.userId),
          kpi: item.kpi,
          period: item.period,
        }));
    } else if (hasDepartmentFilter(filters) && !hasUserFilter(filters)) {
      // 部署フィルターのみが適用された場合、その部署のユーザー別データを返す
      currentGroupBy = 'user';
      const departmentUsers = users.filter(u => u.departmentId === filters.companyAxis?.departmentId);
      
      data = managementData.userKPIData
        .filter(item => {
          // 該当部署のユーザーかつ期間内のデータ
          const userInDepartment = departmentUsers.some(u => u.id === item.userId);
          return userInDepartment && isInDateRange('', startDate, endDate, item.period);
        })
        .map(item => {
          const user = users.find(u => u.id === item.userId);
          const department = departments.find(d => d.id === user?.departmentId);
          return {
            key: `${item.userId}-${item.period}`,
            name: user?.name || `ユーザー${item.userId}`,
            user: user,
            department: department?.name || '不明',
            departmentId: user?.departmentId,
            userId: item.userId,
            kpi: item.kpi,
            period: item.period,
          };
        });
    } else if (hasIndustryFilter(filters)) {
      currentGroupBy = 'industry';
      data = managementData.industryKPIData
        .filter(item => {
          if (item.industry !== filters.customerAxis.industry) {
            return false;
          }
          return isInDateRange('', startDate, endDate, item.period);
        })
        .map(item => ({
          key: `${item.industry}-${item.period}`,
          name: item.industry,
          kpi: item.kpi,
          period: item.period,
        }));
    } else if (hasCompanySizeFilter(filters)) {
      currentGroupBy = 'companySize';
      data = managementData.companySizeKPIData
        .filter(item => {
          if (item.companySize !== filters.customerAxis.companySize) {
            return false;
          }
          return isInDateRange('', startDate, endDate, item.period);
        })
        .map(item => ({
          key: `${item.companySize}-${item.period}`,
          name:
            item.companySize === 'large'
              ? '大規模'
              : item.companySize === 'medium'
                ? '中規模'
                : '小規模',
          kpi: item.kpi,
          period: item.period,
        }));
    } else {
      // 全体集計
      currentGroupBy = 'all';
      const sourceData = getSourceData();

      // 期間ごとにデータを集約
      const aggregatedByPeriod = sourceData.reduce((acc: any, item: any) => {
        const key = item.date || item.period;
        if (!acc[key]) {
          acc[key] = {
            period: key,
            date: item.date,
            kpi: {
              callCount: 0,
              connectCount: 0,
              appointmentCount: 0,
              visitCount: 0,
              negotiationCount: 0,
              negotiationUnitPrice: 0,
              orderCount: 0,
              orderUnitPrice: 0,
              lostCount: 0,
            },
            items: [],
          };
        }

        const group = acc[key];
        group.kpi.callCount += item.kpi.callCount;
        group.kpi.connectCount += item.kpi.connectCount;
        group.kpi.appointmentCount += item.kpi.appointmentCount;
        group.kpi.visitCount += item.kpi.visitCount;
        group.kpi.negotiationCount += item.kpi.negotiationCount;
        group.kpi.orderCount += item.kpi.orderCount;
        group.kpi.lostCount += item.kpi.lostCount;
        group.items.push(item);

        return acc;
      }, {});

      // 平均単価を計算
      data = Object.values(aggregatedByPeriod).map((group: any) => {
        const negotiationTotal = group.items.reduce(
          (sum: number, item: any) =>
            sum + item.kpi.negotiationUnitPrice * item.kpi.negotiationCount,
          0
        );
        const orderTotal = group.items.reduce(
          (sum: number, item: any) =>
            sum + item.kpi.orderUnitPrice * item.kpi.orderCount,
          0
        );

        group.kpi.negotiationUnitPrice =
          group.kpi.negotiationCount > 0
            ? Math.round(negotiationTotal / group.kpi.negotiationCount)
            : 0;
        group.kpi.orderUnitPrice =
          group.kpi.orderCount > 0
            ? Math.round(orderTotal / group.kpi.orderCount)
            : 0;

        return {
          key: group.period,
          kpi: group.kpi,
          period: group.period,
          date: group.date,
        };
      });
    }

    // 分析タイプに基づく処理
    if (filters.analysisType === 'top5' && currentGroupBy === 'user') {
      data = data
        .sort((a, b) => b.kpi.orderCount - a.kpi.orderCount)
        .slice(0, 5);
    } else if (
      filters.analysisType === 'bottom5' &&
      currentGroupBy === 'user'
    ) {
      data = data
        .sort((a, b) => a.kpi.orderCount - b.kpi.orderCount)
        .slice(0, 5);
    }

    return { filteredData: data, groupBy: currentGroupBy };
  }, [filters, departments, users]);

  return { filteredData, groupBy };
};
