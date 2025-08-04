import React from 'react';
import { Row, Col, Card, Progress, Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import type { KPIData } from '../../types';

interface KPIOverviewProps {
  data: KPIData;
}

const KPIOverview: React.FC<KPIOverviewProps> = ({ data }) => {
  const getProgressColor = (rate: number) => {
    if (rate >= 80) return '#52c41a';
    if (rate >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const kpiItems = [
    { key: 'calls', label: '架電数', data: data.kpi.calls },
    { key: 'connected', label: '通電数', data: data.kpi.connected },
    { key: 'appointments', label: 'アポ獲得数', data: data.kpi.appointments },
    { key: 'visits', label: '訪問完了数', data: data.kpi.visits },
    { key: 'negotiations', label: '商談完了数', data: data.kpi.negotiations },
    { key: 'proposals', label: '見積提出数', data: data.kpi.proposals },
    { key: 'orders', label: '受注数', data: data.kpi.orders },
  ];

  return (
    <div>
      <Card
        title={`${data.kgi.month} KGI達成状況`}
        style={{ marginBottom: 24 }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Statistic
              title="月間売上目標"
              value={data.kgi.target}
              formatter={value => formatCurrency(Number(value))}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="現在の売上"
              value={data.kgi.current}
              formatter={value => formatCurrency(Number(value))}
              valueStyle={{ color: getProgressColor(data.kgi.achievementRate) }}
              prefix={
                data.kgi.achievementRate >= 70 ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
            />
          </Col>
          <Col span={8}>
            <div style={{ textAlign: 'center' }}>
              <Progress
                type="circle"
                percent={data.kgi.achievementRate}
                strokeColor={getProgressColor(data.kgi.achievementRate)}
                format={percent => `${percent}%`}
              />
              <div style={{ marginTop: 8 }}>達成率</div>
            </div>
          </Col>
        </Row>
      </Card>

      <Card title="行動KPI進捗">
        <Row gutter={[16, 24]}>
          {kpiItems.map((item, index) => (
            <Col span={24} key={item.key}>
              <div style={{ marginBottom: index === kpiItems.length - 1 ? 0 : 16 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <span>{item.label}</span>
                  <span>
                    {item.data.current} / {item.data.target}件
                  </span>
                </div>
                <Progress
                  percent={item.data.achievementRate}
                  strokeColor={getProgressColor(item.data.achievementRate)}
                  showInfo={false}
                />
              </div>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default KPIOverview;
