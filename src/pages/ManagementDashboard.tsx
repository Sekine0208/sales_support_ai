import React, { useState, useEffect, useMemo } from 'react';
import { Row, Col, Spin, message } from 'antd';
import KPIGrid from '../components/management/KPIGrid';
import AnalysisFilter from '../components/management/AnalysisFilter';
import type { FilterCondition, Department, SalesUser, Product } from '../types/analytics';
import managementData from '../data/managementData.json';

const ManagementDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterCondition>({
    timeAxis: {
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      granularity: 'monthly'
    },
    analysisType: 'average'
  });
  const [groupBy, setGroupBy] = useState<'department' | 'user' | 'industry' | 'companySize'>('department');

  const departments: Department[] = managementData.departments;
  const users: SalesUser[] = managementData.users;
  const products: Product[] = managementData.products;

  const handleFilterChange = (newFilters: FilterCondition) => {
    setLoading(true);
    setFilters(newFilters);
    
    // シミュレートされた遅延（実際のAPIコールを模倣）
    setTimeout(() => {
      setLoading(false);
      message.success('フィルターを適用しました');
    }, 500);
  };

  const filteredData = useMemo(() => {
    let data: any[] = [];

    // グループ化の判定
    if (filters.companyAxis?.userId) {
      setGroupBy('user');
      data = managementData.userKPIData
        .filter(item => {
          if (filters.companyAxis?.userId && item.userId !== filters.companyAxis.userId) {
            return false;
          }
          return true;
        })
        .map(item => ({
          user: users.find(u => u.id === item.userId),
          kpi: item.kpi,
          period: item.period
        }));
    } else if (filters.customerAxis?.industry) {
      setGroupBy('industry');
      data = managementData.industryKPIData
        .filter(item => {
          if (filters.customerAxis?.industry && item.industry !== filters.customerAxis.industry) {
            return false;
          }
          return true;
        })
        .map(item => ({
          name: item.industry,
          kpi: item.kpi,
          period: item.period
        }));
    } else if (filters.customerAxis?.companySize) {
      setGroupBy('companySize');
      data = managementData.companySizeKPIData
        .filter(item => {
          if (filters.customerAxis?.companySize && item.companySize !== filters.customerAxis.companySize) {
            return false;
          }
          return true;
        })
        .map(item => ({
          name: item.companySize === 'large' ? '大規模' :
                item.companySize === 'medium' ? '中規模' : '小規模',
          kpi: item.kpi,
          period: item.period
        }));
    } else {
      setGroupBy('department');
      data = managementData.monthlyKPIData
        .filter(item => {
          if (filters.companyAxis?.departmentId && item.departmentId !== filters.companyAxis.departmentId) {
            return false;
          }
          return true;
        })
        .map(item => ({
          department: departments.find(d => d.id === item.departmentId),
          kpi: item.kpi,
          period: item.period
        }));
    }

    // 分析タイプに基づく処理
    if (filters.analysisType === 'top5' && groupBy === 'user') {
      data = data
        .sort((a, b) => b.kpi.orderCount - a.kpi.orderCount)
        .slice(0, 5);
    } else if (filters.analysisType === 'bottom5' && groupBy === 'user') {
      data = data
        .sort((a, b) => a.kpi.orderCount - b.kpi.orderCount)
        .slice(0, 5);
    }

    return data;
  }, [filters, departments, users]);

  return (
    <div className="management-dashboard">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <h1>マネジメントダッシュボード</h1>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <AnalysisFilter
            onFilterChange={handleFilterChange}
            departments={departments}
            users={users}
            products={products}
            initialFilters={filters}
          />
        </Col>
        
        <Col xs={24} lg={18}>
          <Spin spinning={loading} tip="データを読み込んでいます...">
            <KPIGrid
              data={filteredData}
              groupBy={groupBy}
              onSort={(field, order) => {
                console.log('Sort:', field, order);
              }}
            />
          </Spin>
        </Col>
      </Row>
    </div>
  );
};

export default ManagementDashboard;