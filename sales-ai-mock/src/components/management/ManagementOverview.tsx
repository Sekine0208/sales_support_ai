import React from 'react';
import { Row, Col, Card } from 'antd';
import MonthlyResultsChart from './MonthlyResultsChart';
import SalesRepPerformanceChart from './SalesRepPerformanceChart';
import PipelineBarChart from './PipelineBarChart';
import type { FilterCondition } from '../../types/analytics';

interface ManagementOverviewProps {
  data: any[];
  loading?: boolean;
  startDate?: string;
  endDate?: string;
  filters?: FilterCondition;
}

const ManagementOverview: React.FC<ManagementOverviewProps> = ({ 
  data, 
  loading = false,
  startDate = '2025-01-01',
  endDate = '2025-01-31',
  filters
}) => {
  // フィルター条件に基づいてタイトルを動的生成
  const getCardTitle = (baseTitle: string) => {
    if (!filters) return baseTitle;
    
    const conditions = [];
    if (filters.companyAxis?.departmentId) {
      // 部署フィルターが適用されている場合
      conditions.push('部署別');
    }
    if (filters.companyAxis?.userId) {
      // ユーザーフィルターが適用されている場合
      conditions.push('担当者別');
    }
    if (filters.customerAxis?.industry) {
      // 業界フィルターが適用されている場合
      conditions.push(`${filters.customerAxis.industry}`);
    }
    if (filters.customerAxis?.region) {
      // 地域フィルターが適用されている場合
      conditions.push(`${filters.customerAxis.region}`);
    }
    
    return conditions.length > 0 ? `${baseTitle} (${conditions.join('・')})` : baseTitle;
  };

  return (
    <div className="management-overview">
      {/* 上段：2つの主要KPIチャート */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={24} md={12}>
          <Card 
            title={getCardTitle("当月実績")}
            size="small"
            styles={{ body: { padding: '16px' } }}
            loading={loading}
          >
            <MonthlyResultsChart 
              data={data} 
              startDate={startDate}
              endDate={endDate}
              filters={filters}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={24} md={12}>
          <Card 
            title={getCardTitle("担当者別実績")}
            size="small"
            styles={{ body: { padding: '16px' } }}
            loading={loading}
          >
            <SalesRepPerformanceChart 
              data={data}
              startDate={startDate}
              endDate={endDate}
              filters={filters}
            />
          </Card>
        </Col>
      </Row>

      {/* 下段：パイプライン状況 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title={getCardTitle("パイプライン状況")}
            size="small"
            styles={{ body: { padding: '16px' } }}
            loading={loading}
          >
            <PipelineBarChart 
              data={data} 
              filters={filters}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ManagementOverview; 