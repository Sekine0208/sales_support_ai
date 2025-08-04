import React, { useMemo } from 'react';
import { Pie } from '@ant-design/charts';
import { Typography, Space, Statistic } from 'antd';
import type { FilterCondition } from '../../types/analytics';

const { Text } = Typography;

interface MonthlyResultsChartProps {
  data: any[];
  startDate?: string;
  endDate?: string;
  filters?: FilterCondition;
}

const MonthlyResultsChart: React.FC<MonthlyResultsChartProps> = ({ 
  data, 
  startDate = '2025-01-01', 
  endDate = '2025-01-31',
  filters
}) => {
  // 渡されたdataから集計したKPIを取得
  const totalKpi = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        orderAmount: 0,
        orderCount: 0,
        callCount: 0,
        connectCount: 0,
        appointmentCount: 0,
        visitCount: 0,
        negotiationCount: 0,
        lostCount: 0
      };
    }

    // dataから全KPIを集計
    const aggregated = data.reduce((acc, item) => {
      const kpi = item.kpi || {};
      return {
        orderAmount: acc.orderAmount + (kpi.orderUnitPrice * kpi.orderCount || 0),
        orderCount: acc.orderCount + (kpi.orderCount || 0),
        callCount: acc.callCount + (kpi.callCount || 0),
        connectCount: acc.connectCount + (kpi.connectCount || 0),
        appointmentCount: acc.appointmentCount + (kpi.appointmentCount || 0),
        visitCount: acc.visitCount + (kpi.visitCount || 0),
        negotiationCount: acc.negotiationCount + (kpi.negotiationCount || 0),
        lostCount: acc.lostCount + (kpi.lostCount || 0),
      };
    }, {
      orderAmount: 0,
      orderCount: 0,
      callCount: 0,
      connectCount: 0,
      appointmentCount: 0,
      visitCount: 0,
      negotiationCount: 0,
      lostCount: 0,
    });

    return aggregated;
  }, [data]);

  // データからKPI集計を計算
  const chartData = useMemo(() => {
    // フィルターされたdataから集計した受注金額を使用
    const achievedAmount = totalKpi.orderAmount;

    // 目標金額（仮に6000万円に設定）
    const targetAmount = 60000000;
    const remainingAmount = Math.max(0, targetAmount - achievedAmount);

    return [
      {
        type: '達成',
        value: achievedAmount,
        color: '#52c41a',
      },
      {
        type: '未達成',
        value: remainingAmount,
        color: '#f0f0f0',
      },
    ];
  }, [totalKpi.orderAmount]);

  // 達成率計算
  const achievementRate = useMemo(() => {
    const totalAchieved = chartData.find(item => item.type === '達成')?.value || 0;
    const totalTarget = chartData.reduce((sum, item) => sum + item.value, 0);
    return totalTarget > 0 ? Math.round((totalAchieved / totalTarget) * 100) : 0;
  }, [chartData]);

  const totalAmount = chartData.find(item => item.type === '達成')?.value || 0;

  const config = {
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    innerRadius: 0.6,
    legend: false,
    color: ['#52c41a', '#f0f0f0'],
    label: false,
    statistic: {
      title: false,
      content: false,
    },
    tooltip: {
      formatter: (datum: any) => {
        const value = new Intl.NumberFormat('ja-JP', {
          style: 'currency',
          currency: 'JPY',
          minimumFractionDigits: 0,
        }).format(datum.value);
        return {
          name: datum.type,
          value: value,
        };
      },
    },
    width: 200,
    height: 200,
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <Pie {...config} />
        
        {/* 中央の数値表示 */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
            {new Intl.NumberFormat('ja-JP', {
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(totalAmount)}円
          </div>
          <div style={{ fontSize: '14px', color: '#52c41a', fontWeight: 'bold' }}>
            ({achievementRate}%)
          </div>
        </div>
      </div>

      {/* 下部の詳細情報 */}
      <Space direction="vertical" size={4} style={{ marginTop: 16, width: '100%' }}>
        <Text style={{ fontSize: '12px' }}>
          目標: 6,000万円 / 実績: {new Intl.NumberFormat('ja-JP', {
            style: 'currency',
            currency: 'JPY',
            minimumFractionDigits: 0,
          }).format(totalAmount)}
        </Text>
        <Text type="secondary" style={{ fontSize: '10px' }}>
          受注数: {totalKpi.orderCount}件 / 商談数: {totalKpi.negotiationCount}件
        </Text>
      </Space>
    </div>
  );
};

export default MonthlyResultsChart; 