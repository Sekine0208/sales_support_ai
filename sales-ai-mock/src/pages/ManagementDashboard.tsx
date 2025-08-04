import React, { useState, useEffect } from 'react';
import { Row, Col, Spin, App, Tabs, Card, Divider } from 'antd';
import {
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
  ShoppingOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import KPIGrid from '../features/management/components/KPIGrid';
import AnalysisFilter from '../features/management/components/AnalysisFilter';
import CrossAnalysisGrid from '../features/management/components/CrossAnalysisGrid';
import ManagementOverview from '../components/management/ManagementOverview';
import { useKpiFilter } from '../features/management/hooks/useKpiFilter';
import type {
  FilterCondition,
  Department,
  SalesUser,
  Product,
} from '../types/analytics';
import managementData from '../data/managementData.json';

const ManagementDashboard: React.FC = () => {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [filters, setFilters] = useState<FilterCondition>({
    timeAxis: {
      startDate: '2025-01-01',
      endDate: '2025-01-31',
      granularity: 'monthly',
    },
  });

  const departments: Department[] = managementData.departments;
  const users: SalesUser[] = managementData.users;
  const products: Product[] = managementData.products;

  const { filteredData, groupBy } = useKpiFilter({
    filters,
    departments,
    users,
  });

  const handleFilterChange = (newFilters: FilterCondition) => {
    setLoading(true);
    setFilters(newFilters);

    // シミュレートされた遅延（実際のAPIコールを模倣）
    setTimeout(() => {
      setLoading(false);
      message.success('フィルターを適用しました');
    }, 500);
  };

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <DashboardOutlined />
          ファーストビュー
        </span>
      ),
      children: (
        <Spin spinning={loading} tip="データを読み込んでいます...">
          <ManagementOverview 
            data={filteredData} 
            loading={loading}
            startDate={filters.timeAxis?.startDate}
            endDate={filters.timeAxis?.endDate}
            filters={filters}
          />
        </Spin>
      ),
    },
    {
      key: 'timeline',
      label: (
        <span>
          <ClockCircleOutlined />
          時系列分析
        </span>
      ),
      children: (
        <Spin spinning={loading} tip="データを読み込んでいます...">
          <KPIGrid
            data={filteredData}
            groupBy={groupBy}
            granularity={filters.timeAxis?.granularity}
            viewType="timeline"
            onSort={(field, order) => {
              console.log('Sort:', field, order);
            }}
          />
        </Spin>
      ),
    },
    {
      key: 'department',
      label: (
        <span>
          <TeamOutlined />
          部署別
        </span>
      ),
      children: (
        <Spin spinning={loading} tip="データを読み込んでいます...">
          <CrossAnalysisGrid
            viewType="department"
            filters={filters}
            departments={departments}
            users={users}
            products={products}
          />
        </Spin>
      ),
    },
    {
      key: 'user',
      label: (
        <span>
          <UserOutlined />
          営業担当者別
        </span>
      ),
      children: (
        <Spin spinning={loading} tip="データを読み込んでいます...">
          <CrossAnalysisGrid
            viewType="user"
            filters={filters}
            departments={departments}
            users={users}
            products={products}
          />
        </Spin>
      ),
    },
    {
      key: 'product',
      label: (
        <span>
          <ShoppingOutlined />
          商材別
        </span>
      ),
      children: (
        <Spin spinning={loading} tip="データを読み込んでいます...">
          <CrossAnalysisGrid
            viewType="product"
            filters={filters}
            departments={departments}
            users={users}
            products={products}
          />
        </Spin>
      ),
    },
  ];

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
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            type="card"
            size="large"
          />
        </Col>
      </Row>
    </div>
  );
};

export default ManagementDashboard;
