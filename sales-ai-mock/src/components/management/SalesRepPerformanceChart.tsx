import React, { useMemo } from 'react';
import { Column } from '@ant-design/charts';
import { Typography, Space } from 'antd';
import { aggregateKpiByUser } from '../../utils/kpiAggregation';
import type { FilterCondition } from '../../types/analytics';

const { Text } = Typography;

interface SalesRepPerformanceChartProps {
  data: any[];
  startDate?: string;
  endDate?: string;
  filters?: FilterCondition;
}

const SalesRepPerformanceChart: React.FC<SalesRepPerformanceChartProps> = ({ 
  data,
  startDate = '2025-01-01',
  endDate = '2025-01-31',
  filters
}) => {
  // 渡されたdataから営業担当者別の実績を集計
  const chartData = useMemo(() => {
    // 部署フィルターが適用されている場合は、フィルターされたユーザー別データが返される
    if (filters?.companyAxis?.departmentId && !filters?.companyAxis?.userId) {
      if (!data || data.length === 0) {
        return [];
      }

      // 部署フィルター適用時：ユーザー別データを集計
      const userAggregated = data.reduce((acc: any, item: any) => {
        const userId = item.userId || item.user?.id;
        const userName = item.name || item.user?.name || 'Unknown';
        const departmentName = item.department || item.user?.departmentName || '不明';
        
        if (!acc[userId]) {
          acc[userId] = {
            userId,
            name: userName,
            department: departmentName,
            kpi: {
              orderCount: 0,
              orderUnitPrice: 0,
              callCount: 0,
              connectCount: 0,
              appointmentCount: 0,
              visitCount: 0,
              negotiationCount: 0,
              lostCount: 0,
            },
          };
        }
        
        // KPIを累積
        const kpi = item.kpi || {};
        acc[userId].kpi.orderCount += kpi.orderCount || 0;
        acc[userId].kpi.orderUnitPrice = kpi.orderUnitPrice || 0; // 単価は最新値を使用
        acc[userId].kpi.callCount += kpi.callCount || 0;
        acc[userId].kpi.connectCount += kpi.connectCount || 0;
        acc[userId].kpi.appointmentCount += kpi.appointmentCount || 0;
        acc[userId].kpi.visitCount += kpi.visitCount || 0;
        acc[userId].kpi.negotiationCount += kpi.negotiationCount || 0;
        acc[userId].kpi.lostCount += kpi.lostCount || 0;
        
        return acc;
      }, {});

      const processedData = Object.values(userAggregated)
        .map((user: any) => {
          const orderAmount = (user.kpi.orderUnitPrice || 0) * (user.kpi.orderCount || 0);
          return {
            name: user.name,
            value: orderAmount,
            department: user.department,
            orderCount: user.kpi.orderCount,
            orderUnitPrice: user.kpi.orderUnitPrice,
          };
        })
        .filter(item => item.value > 0) // 受注のあるデータのみ
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // 上位5名

      return processedData;
    } else {
      // フィルター未適用時または全体表示時：rawdataから直接ユーザー別実績を集計
      const userKpis = aggregateKpiByUser(startDate, endDate);
      
      // 上位5名のユーザーを取得（受注金額順）
      const topUsers = userKpis
        .sort((a, b) => b.orderAmount - a.orderAmount)
        .slice(0, 5)
        .map(user => ({
          name: user.userName,
          value: user.orderAmount,
          department: user.departmentName,
          orderCount: user.orderCount,
          orderUnitPrice: user.orderCount > 0 ? Math.round(user.orderAmount / user.orderCount) : 0,
        }));

      return topUsers;
    }
  }, [data, filters, startDate, endDate]);

  // フィルター状況の表示用テキスト
  const filterText = useMemo(() => {
    if (!filters) return '';
    
    const conditions = [];
    if (filters.companyAxis?.departmentId) {
      conditions.push('部署別フィルター適用');
    }
    if (filters.companyAxis?.userId) {
      conditions.push('担当者フィルター適用');
    }
    if (filters.customerAxis?.industry) {
      conditions.push(`業界: ${filters.customerAxis.industry}`);
    }
    if (filters.customerAxis?.region) {
      conditions.push(`地域: ${filters.customerAxis.region}`);
    }
    
    return conditions.length > 0 ? ` (${conditions.join('・')})` : '';
  }, [filters]);

  const config = {
    data: chartData,
    xField: 'name',
    yField: 'value',
    color: '#1890ff',
    columnWidthRatio: 0.6,
    height: 200,
    xAxis: {
      line: null,
      tickLine: null,
      label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fontSize: 10,
        },
      },
      title: null,
    },
    yAxis: false,
    label: false,
    tooltip: {
      formatter: (datum: any) => {
        const value = new Intl.NumberFormat('ja-JP', {
          style: 'currency',
          currency: 'JPY',
          minimumFractionDigits: 0,
        }).format(datum.value);
        return {
          name: '受注金額',
          value: `${value} (${datum.orderCount}件)`,
        };
      },
    },
  };

  const totalOrderAmount = chartData.reduce((sum, item) => sum + item.value, 0);
  const totalOrderCount = chartData.reduce((sum, item) => sum + item.orderCount, 0);

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', width: '100%' }}>
        <Column {...config} />
      </div>

      {/* 下部のサマリー情報 */}
      <Space direction="vertical" size={4} style={{ marginTop: 16, width: '100%' }}>
        <Text type="secondary" style={{ fontSize: '12px' }}>
          上位5名合計: {new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            minimumFractionDigits: 0,
          }).format(totalOrderAmount)}
        </Text>
        <Text type="secondary" style={{ fontSize: '10px' }}>
          受注件数: {totalOrderCount}件
        </Text>
      </Space>
    </div>
  );
};

export default SalesRepPerformanceChart; 