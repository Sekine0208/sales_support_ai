import React, { useMemo } from 'react';
import { Column } from '@ant-design/charts';
import { Typography } from 'antd';
import type { FilterCondition } from '../../types/analytics';

const { Text } = Typography;

interface PipelineBarChartProps {
  data: any[];
  filters?: FilterCondition;
}

const PipelineBarChart: React.FC<PipelineBarChartProps> = ({ data, filters }) => {
  // データからパイプライン情報を集計
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // 全データからKPIを集計
    const totalKPI = data.reduce((acc, item) => {
      const kpi = item.kpi || {};
      return {
        callCount: acc.callCount + (kpi.callCount || 0),
        connectCount: acc.connectCount + (kpi.connectCount || 0),
        appointmentCount: acc.appointmentCount + (kpi.appointmentCount || 0),
        visitCount: acc.visitCount + (kpi.visitCount || 0),
        negotiationCount: acc.negotiationCount + (kpi.negotiationCount || 0),
        orderCount: acc.orderCount + (kpi.orderCount || 0),
      };
    }, { 
      callCount: 0, 
      connectCount: 0, 
      appointmentCount: 0, 
      visitCount: 0, 
      negotiationCount: 0, 
      orderCount: 0 
    });

    // 見積提出数を推定（商談完了数の80%）
    const proposalCount = Math.round(totalKPI.negotiationCount * 0.8);

    // 平均単価の計算
    const avgUnitPrice = data.length > 0 ? 
      data.reduce((sum, item) => sum + (item.kpi?.negotiationUnitPrice || 3500000), 0) / data.length :
      3500000;

    // 7つのパイプラインステージ定義
    const result = [
      {
        stage: '架電数',
        value: totalKPI.callCount,
        amount: totalKPI.callCount * 10000, // 架電あたり1万円の仮想金額
        color: '#722ed1',
      },
      {
        stage: '通電数',
        value: totalKPI.connectCount,
        amount: totalKPI.connectCount * 50000, // 通電あたり5万円の仮想金額
        color: '#1890ff',
      },
      {
        stage: 'アポ獲得数',
        value: totalKPI.appointmentCount,
        amount: totalKPI.appointmentCount * 200000, // アポあたり20万円の仮想金額
        color: '#13c2c2',
      },
      {
        stage: '訪問完了数',
        value: totalKPI.visitCount,
        amount: totalKPI.visitCount * 500000, // 訪問あたり50万円の仮想金額
        color: '#52c41a',
      },
      {
        stage: '商談完了数',
        value: totalKPI.negotiationCount,
        amount: totalKPI.negotiationCount * avgUnitPrice * 0.6, // 商談の見込み金額
        color: '#faad14',
      },
      {
        stage: '見積提出数',
        value: proposalCount,
        amount: proposalCount * avgUnitPrice * 0.8, // 見積の見込み金額
        color: '#fa8c16',
      },
      {
        stage: '受注数',
        value: totalKPI.orderCount,
        amount: totalKPI.orderCount * avgUnitPrice, // 受注の確定金額
        color: '#f5222d',
      },
    ];

    return result;
  }, [data]);

  const config = {
    data: chartData,
    xField: 'stage',
    yField: 'value',
    color: (datum: any) => datum.color,
    tooltip: {
      formatter: (datum: any) => {
        const amount = new Intl.NumberFormat('ja-JP', {
          style: 'currency',
          currency: 'JPY',
          notation: 'compact',
          maximumFractionDigits: 1,
        }).format(datum.amount);
        return {
          name: datum.stage,
          value: `${datum.value}件 (${amount})`,
        };
      },
    },
    yAxis: {
      label: {
        formatter: (v: string) => {
          return `${v}件`;
        },
      },
    },
    height: 300,
    animation: {
      appear: {
        animation: 'wave-in',
        duration: 1000,
      },
    },
  };

  return (
    <div>
      <Column {...config} />
      
      {/* ステージ別詳細 */}
      <div style={{ 
        marginTop: 16, 
        marginLeft: 50, // Y軸ラベル分のオフセット
        marginRight: 20, // 右側のバランス調整
        display: 'grid', 
        gridTemplateColumns: 'repeat(7, 1fr)', 
        gap: '4px',
        fontSize: '12px' 
      }}>
        {chartData.map((item, index) => (
          <div key={index} style={{ textAlign: 'center', padding: '4px' }}>
            <div style={{ color: item.color, fontWeight: 'bold', fontSize: '11px' }}>
              {item.stage}
            </div>
            <div style={{ marginTop: 4, fontWeight: 'bold' }}>
              {item.value}件
            </div>
            {item.stage === '受注数' && (
              <div style={{ fontSize: '10px', color: '#666' }}>
                {new Intl.NumberFormat('ja-JP', {
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(item.amount)}円
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineBarChart; 