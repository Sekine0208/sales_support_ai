import React, { useState, useMemo } from 'react';
import { Table, Tag, Progress, Select, Space, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { InfoCircleOutlined } from '@ant-design/icons';
import type {
  AnalyticsKPI,
  Department,
  SalesUser,
} from '../../types/analytics';

interface KPIGridProps {
  data: {
    department?: Department;
    user?: SalesUser;
    kpi: AnalyticsKPI;
    period: string;
    date?: string;
    name?: string;
  }[];
  groupBy:
    | 'all'
    | 'department'
    | 'user'
    | 'industry'
    | 'companySize'
    | 'product';
  granularity?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  viewType?: 'timeline' | 'department' | 'user' | 'product';
  onSort?: (field: string, order: 'ascend' | 'descend') => void;
}

const KPIGrid: React.FC<KPIGridProps> = ({
  data,
  groupBy,
  granularity = 'monthly',
  viewType = 'timeline',
  onSort,
}) => {
  const [sortField, setSortField] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('descend');

  const getAchievementRate = (actual: number, target: number): number => {
    return target > 0 ? Math.round((actual / target) * 100) : 0;
  };

  const getAchievementColor = (rate: number): string => {
    if (rate >= 100) return '#52c41a';
    if (rate >= 80) return '#faad14';
    return '#f5222d';
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ja-JP').format(num);
  };

  const formatCurrency = (num: number): string => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatPeriod = (period: string, date?: string): string => {
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
        return `${weekStart.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })}週`;
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

  const columns: ColumnsType<any> = [
    {
      title:
        granularity === 'daily'
          ? '日付'
          : granularity === 'weekly'
            ? '週'
            : granularity === 'monthly'
              ? '月'
              : granularity === 'yearly'
                ? '年'
                : '期間',
      dataIndex: 'period',
      key: 'period',
      fixed: 'left',
      width: 120,
      render: (text: string, record: any) =>
        formatPeriod(record.period, record.date),
      sorter: (a, b) => {
        const dateA = a.date || a.period;
        const dateB = b.date || b.period;
        return dateA.localeCompare(dateB);
      },
    },
    // 自社軸フィルター時のみ表示するカラム
    ...(groupBy === 'user'
      ? [
          {
            title: '営業担当',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 150,
            render: (text: string, record: any) => {
              if (record.user) {
                return (
                  <Space>
                    <span>{record.user.name}</span>
                    <Tag color="blue" style={{ fontSize: '10px' }}>
                      {record.user.departmentId}
                    </Tag>
                  </Space>
                );
              }
              return text;
            },
          },
        ]
      : []),
    // 顧客軸フィルター時のみ表示するカラム
    ...(groupBy === 'industry' || groupBy === 'companySize'
      ? [
          {
            title: groupBy === 'industry' ? '業界' : '企業規模',
            dataIndex: 'name',
            key: 'name',
            fixed: 'left',
            width: 150,
            render: (text: string) => text,
          },
        ]
      : []),
    {
      title: (
        <Space>
          架電数
          <Tooltip title="営業活動の基本となる架電実施数">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: ['kpi', 'callCount'],
      key: 'callCount',
      width: 100,
      align: 'right',
      render: (value: number) => formatNumber(value),
      sorter: (a, b) => a.kpi.callCount - b.kpi.callCount,
    },
    {
      title: (
        <Space>
          通電数
          <Tooltip title="実際に担当者と会話できた数">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: ['kpi', 'connectCount'],
      key: 'connectCount',
      width: 100,
      align: 'right',
      render: (value: number, record: any) => {
        const rate = getAchievementRate(value, record.kpi.callCount * 0.4);
        return (
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            <span>{formatNumber(value)}</span>
            <Progress
              percent={rate}
              size="small"
              showInfo={false}
              strokeColor={getAchievementColor(rate)}
            />
          </Space>
        );
      },
      sorter: (a, b) => a.kpi.connectCount - b.kpi.connectCount,
    },
    {
      title: (
        <Space>
          アポ獲得数
          <Tooltip title="訪問約束を取り付けた数">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: ['kpi', 'appointmentCount'],
      key: 'appointmentCount',
      width: 120,
      align: 'right',
      render: (value: number, record: any) => {
        const rate = getAchievementRate(value, record.kpi.connectCount * 0.25);
        return (
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            <span>{formatNumber(value)}</span>
            <Progress
              percent={rate}
              size="small"
              showInfo={false}
              strokeColor={getAchievementColor(rate)}
            />
          </Space>
        );
      },
      sorter: (a, b) => a.kpi.appointmentCount - b.kpi.appointmentCount,
    },
    {
      title: (
        <Space>
          訪問数
          <Tooltip title="実際に訪問を実施した数">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: ['kpi', 'visitCount'],
      key: 'visitCount',
      width: 100,
      align: 'right',
      render: (value: number) => formatNumber(value),
      sorter: (a, b) => a.kpi.visitCount - b.kpi.visitCount,
    },
    {
      title: (
        <Space>
          商談数
          <Tooltip title="商談機会を創出した数">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: ['kpi', 'negotiationCount'],
      key: 'negotiationCount',
      width: 100,
      align: 'right',
      render: (value: number, record: any) => {
        const rate = getAchievementRate(value, record.kpi.visitCount * 0.5);
        return (
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            <span>{formatNumber(value)}</span>
            <Progress
              percent={rate}
              size="small"
              showInfo={false}
              strokeColor={getAchievementColor(rate)}
            />
          </Space>
        );
      },
      sorter: (a, b) => a.kpi.negotiationCount - b.kpi.negotiationCount,
    },
    {
      title: (
        <Space>
          商談単価
          <Tooltip title="商談の平均金額">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: ['kpi', 'negotiationUnitPrice'],
      key: 'negotiationUnitPrice',
      width: 140,
      align: 'right',
      render: (value: number) => formatCurrency(value),
      sorter: (a, b) => a.kpi.negotiationUnitPrice - b.kpi.negotiationUnitPrice,
    },
    {
      title: (
        <Space>
          受注件数
          <Tooltip title="成約に至った件数">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: ['kpi', 'orderCount'],
      key: 'orderCount',
      width: 100,
      align: 'right',
      render: (value: number, record: any) => {
        const rate = getAchievementRate(
          value,
          record.kpi.negotiationCount * 0.35
        );
        return (
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            <span>{formatNumber(value)}</span>
            <Tag color={value > 0 ? 'success' : 'default'}>{rate}%</Tag>
          </Space>
        );
      },
      sorter: (a, b) => a.kpi.orderCount - b.kpi.orderCount,
    },
    {
      title: (
        <Space>
          受注単価
          <Tooltip title="受注の平均金額">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: ['kpi', 'orderUnitPrice'],
      key: 'orderUnitPrice',
      width: 140,
      align: 'right',
      render: (value: number) => formatCurrency(value),
      sorter: (a, b) => a.kpi.orderUnitPrice - b.kpi.orderUnitPrice,
    },
    {
      title: (
        <Space>
          失注件数
          <Tooltip title="受注に至らなかった商談数">
            <InfoCircleOutlined />
          </Tooltip>
        </Space>
      ),
      dataIndex: ['kpi', 'lostCount'],
      key: 'lostCount',
      width: 100,
      align: 'right',
      render: (value: number, record: any) => {
        const lostRate =
          record.kpi.negotiationCount > 0
            ? Math.round((value / record.kpi.negotiationCount) * 100)
            : 0;
        return (
          <Space direction="vertical" size={0} style={{ width: '100%' }}>
            <span>{formatNumber(value)}</span>
            <Tag color={lostRate > 50 ? 'error' : 'warning'}>{lostRate}%</Tag>
          </Space>
        );
      },
      sorter: (a, b) => a.kpi.lostCount - b.kpi.lostCount,
    },
  ];

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field) {
      setSortField(sorter.field);
      setSortOrder(sorter.order);
      if (onSort) {
        onSort(sorter.field, sorter.order);
      }
    }
  };

  const tableData = useMemo(() => {
    return data.map((item, index) => ({
      key: index,
      ...item,
    }));
  }, [data]);

  return (
    <div className="kpi-grid">
      <Table
        columns={columns}
        dataSource={tableData}
        onChange={handleTableChange}
        scroll={{ x: 1420, y: 600 }}
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showTotal: total => `全 ${total} 件`,
        }}
        summary={pageData => {
          const totalKPI = pageData.reduce(
            (acc, curr) => ({
              callCount: acc.callCount + curr.kpi.callCount,
              connectCount: acc.connectCount + curr.kpi.connectCount,
              appointmentCount:
                acc.appointmentCount + curr.kpi.appointmentCount,
              visitCount: acc.visitCount + curr.kpi.visitCount,
              negotiationCount:
                acc.negotiationCount + curr.kpi.negotiationCount,
              negotiationUnitPrice: 0,
              orderCount: acc.orderCount + curr.kpi.orderCount,
              orderUnitPrice: 0,
              lostCount: acc.lostCount + curr.kpi.lostCount,
            }),
            {
              callCount: 0,
              connectCount: 0,
              appointmentCount: 0,
              visitCount: 0,
              negotiationCount: 0,
              negotiationUnitPrice: 0,
              orderCount: 0,
              orderUnitPrice: 0,
              lostCount: 0,
            }
          );

          totalKPI.negotiationUnitPrice =
            totalKPI.negotiationCount > 0
              ? Math.round(
                  pageData.reduce(
                    (sum, curr) =>
                      sum +
                      curr.kpi.negotiationUnitPrice * curr.kpi.negotiationCount,
                    0
                  ) / totalKPI.negotiationCount
                )
              : 0;

          totalKPI.orderUnitPrice =
            totalKPI.orderCount > 0
              ? Math.round(
                  pageData.reduce(
                    (sum, curr) =>
                      sum + curr.kpi.orderUnitPrice * curr.kpi.orderCount,
                    0
                  ) / totalKPI.orderCount
                )
              : 0;

          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>
                <strong>合計</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <strong>{formatNumber(totalKPI.callCount)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right">
                <strong>{formatNumber(totalKPI.connectCount)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} align="right">
                <strong>{formatNumber(totalKPI.appointmentCount)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4} align="right">
                <strong>{formatNumber(totalKPI.visitCount)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={5} align="right">
                <strong>{formatNumber(totalKPI.negotiationCount)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={6} align="right">
                <strong>{formatCurrency(totalKPI.negotiationUnitPrice)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={7} align="right">
                <strong>{formatNumber(totalKPI.orderCount)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="right">
                <strong>{formatCurrency(totalKPI.orderUnitPrice)}</strong>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9} align="right">
                <strong>{formatNumber(totalKPI.lostCount)}</strong>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </div>
  );
};

export default KPIGrid;
