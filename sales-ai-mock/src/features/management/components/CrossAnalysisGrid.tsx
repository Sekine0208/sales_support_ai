import React, { useMemo } from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type {
  FilterCondition,
  Department,
  SalesUser,
  Product,
} from '../../../types/analytics';
import type { CrossAnalysisRow, ViewType } from '../../../shared/types/kpi';
import { formatNumber, formatCurrency } from '../../../shared/utils/format';
import { TABLE_CONFIG } from '../../../shared/constants/kpiThresholds';
import { aggregateKpiByUser, getRawDataByPeriod } from '../../../utils/kpiAggregation';
import type { UserDailyKpi } from '../../../utils/kpiAggregation';

interface CrossAnalysisGridProps {
  viewType: ViewType;
  filters: FilterCondition;
  departments: Department[];
  users: SalesUser[];
  products: Product[];
}

const CrossAnalysisGrid: React.FC<CrossAnalysisGridProps> = ({
  viewType,
  filters,
  departments,
  users,
  products,
}) => {
  const processedData = useMemo(() => {
    const startDate = filters.timeAxis?.startDate || '2025-01-01';
    const endDate = filters.timeAxis?.endDate || '2025-01-31';
    const granularity = filters.timeAxis?.granularity || 'monthly';

    // 期間内の時間軸ラベルを生成
    const timePeriods: string[] = [];
    if (granularity === 'monthly') {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let current = new Date(start.getFullYear(), start.getMonth(), 1);

      while (current <= end) {
        timePeriods.push(
          `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}`
        );
        current.setMonth(current.getMonth() + 1);
      }
    }

    // ビュータイプに応じた項目を取得
    let items: any[] = [];
    if (viewType === 'department') {
      items = departments.map(dept => ({
        id: dept.id,
        name: dept.name,
        type: 'department',
      }));
    } else if (viewType === 'user') {
      items = users.map(user => ({
        id: user.id,
        name: user.name,
        departmentId: user.departmentId,
        type: 'user',
      }));
    } else if (viewType === 'product') {
      items = products.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        type: 'product',
      }));
    }

    // クロス集計データを作成
    const crossData: CrossAnalysisRow[] = items.map(item => {
      const row: CrossAnalysisRow = {
        key: item.id,
        name: item.name,
        category: item.category || '',
        departmentName: item.departmentId
          ? departments.find(d => d.id === item.departmentId)?.name
          : '',
      };

      // 各期間のKPIデータを追加
      timePeriods.forEach(period => {
        let kpi = {
          callCount: 0,
          connectCount: 0,
          appointmentCount: 0,
          visitCount: 0,
          negotiationCount: 0,
          negotiationAmount: 0,
          orderCount: 0,
          orderAmount: 0,
          lostCount: 0,
        };

        if (viewType === 'user') {
          // ユーザービューの場合は実際のrawdataから集計
          const rawData = getRawDataByPeriod(
            `${period}-01`,
            `${period}-31`,
            item.id
          );
          
          rawData.forEach(data => {
            kpi.callCount += data.callCount;
            kpi.connectCount += data.connectCount;
            kpi.appointmentCount += data.appointmentCount;
            kpi.visitCount += data.visitCount;
            kpi.negotiationCount += data.negotiationCount;
            kpi.negotiationAmount += data.negotiationAmount;
            kpi.orderCount += data.orderCount;
            kpi.orderAmount += data.orderAmount;
            kpi.lostCount += data.lostCount;
          });
        } else if (viewType === 'department') {
          // 部署ビューの場合は該当部署のユーザーの合計
          const deptUsers = users.filter(u => u.departmentId === item.id);
          deptUsers.forEach(user => {
            const rawData = getRawDataByPeriod(
              `${period}-01`,
              `${period}-31`,
              user.id
            );
            
            rawData.forEach(data => {
              kpi.callCount += data.callCount;
              kpi.connectCount += data.connectCount;
              kpi.appointmentCount += data.appointmentCount;
              kpi.visitCount += data.visitCount;
              kpi.negotiationCount += data.negotiationCount;
              kpi.negotiationAmount += data.negotiationAmount;
              kpi.orderCount += data.orderCount;
              kpi.orderAmount += data.orderAmount;
              kpi.lostCount += data.lostCount;
            });
          });
        } else {
          // 商品ビューの場合はモックデータ（商品別データがないため）
          kpi = {
            callCount: Math.floor(Math.random() * 100) + 50,
            connectCount: Math.floor(Math.random() * 80) + 30,
            appointmentCount: Math.floor(Math.random() * 40) + 10,
            visitCount: Math.floor(Math.random() * 30) + 5,
            negotiationCount: Math.floor(Math.random() * 20) + 3,
            negotiationAmount: Math.floor(Math.random() * 2000000) + 500000,
            orderCount: Math.floor(Math.random() * 10) + 1,
            orderAmount: Math.floor(Math.random() * 3000000) + 800000,
            lostCount: Math.floor(Math.random() * 15) + 2,
          };
        }

        // 商談単価を計算
        const negotiationUnitPrice = kpi.negotiationCount > 0 
          ? Math.round(kpi.negotiationAmount / kpi.negotiationCount)
          : 0;
          
        const orderUnitPrice = kpi.orderCount > 0 
          ? Math.round(kpi.orderAmount / kpi.orderCount)
          : 0;

        row[`${period}_callCount`] = kpi.callCount;
        row[`${period}_connectCount`] = kpi.connectCount;
        row[`${period}_appointmentCount`] = kpi.appointmentCount;
        row[`${period}_visitCount`] = kpi.visitCount;
        row[`${period}_negotiationCount`] = kpi.negotiationCount;
        row[`${period}_negotiationUnitPrice`] = negotiationUnitPrice;
        row[`${period}_orderCount`] = kpi.orderCount;
        row[`${period}_orderUnitPrice`] = orderUnitPrice;
        row[`${period}_lostCount`] = kpi.lostCount;
      });

      return row;
    });

    return { crossData, timePeriods };
  }, [viewType, filters, departments, users, products]);

  const columns: ColumnsType<CrossAnalysisRow> = useMemo(() => {
    const baseColumns: ColumnsType<CrossAnalysisRow> = [
      {
        title:
          viewType === 'department'
            ? '部署名'
            : viewType === 'user'
              ? '営業担当者'
              : '商材名',
        dataIndex: 'name',
        key: 'name',
        fixed: 'left' as const,
        width: 150,
        render: (text: string, record: CrossAnalysisRow) => (
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            {viewType === 'user' && record.departmentName && (
              <div style={{ fontSize: '12px', color: '#666' }}>
                {record.departmentName}
              </div>
            )}
            {viewType === 'product' && record.category && (
              <Tag color="blue" style={{ fontSize: '10px', marginTop: '4px' }}>
                {record.category}
              </Tag>
            )}
          </div>
        ),
      },
    ];

    // 各期間のKPIカラムを動的に追加
    processedData.timePeriods.forEach(period => {
      const periodLabel = period.replace('-', '/');

      baseColumns.push({
        title: periodLabel,
        children: [
          {
            title: '架電数',
            dataIndex: `${period}_callCount`,
            key: `${period}_callCount`,
            width: 80,
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '通電数',
            dataIndex: `${period}_connectCount`,
            key: `${period}_connectCount`,
            width: 80,
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: 'アポ数',
            dataIndex: `${period}_appointmentCount`,
            key: `${period}_appointmentCount`,
            width: 80,
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '訪問数',
            dataIndex: `${period}_visitCount`,
            key: `${period}_visitCount`,
            width: 80,
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '商談数',
            dataIndex: `${period}_negotiationCount`,
            key: `${period}_negotiationCount`,
            width: 80,
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '商談単価',
            dataIndex: `${period}_negotiationUnitPrice`,
            key: `${period}_negotiationUnitPrice`,
            width: 120,
            render: (value: number) => formatCurrency(value || 0),
          },
          {
            title: '受注数',
            dataIndex: `${period}_orderCount`,
            key: `${period}_orderCount`,
            width: 80,
            render: (value: number) => formatNumber(value || 0),
          },
          {
            title: '受注単価',
            dataIndex: `${period}_orderUnitPrice`,
            key: `${period}_orderUnitPrice`,
            width: 120,
            render: (value: number) => formatCurrency(value || 0),
          },
          {
            title: '失注数',
            dataIndex: `${period}_lostCount`,
            key: `${period}_lostCount`,
            width: 80,
            render: (value: number) => formatNumber(value || 0),
          },
        ],
      });
    });

    return baseColumns;
  }, [processedData.timePeriods, viewType]);

  return (
    <Table<CrossAnalysisRow>
      columns={columns}
      dataSource={processedData.crossData}
      scroll={{ x: 1500, y: TABLE_CONFIG.MAX_TABLE_HEIGHT }}
      pagination={{
        pageSize: TABLE_CONFIG.DEFAULT_PAGE_SIZE,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} items`,
      }}
      bordered
      size="small"
    />
  );
};

export default CrossAnalysisGrid;
