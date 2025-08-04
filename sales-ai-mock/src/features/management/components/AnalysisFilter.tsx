import React, { useState } from 'react';
import { Card, Form, Button, Space } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import type { FilterCondition } from '../../../types/analytics';
import type { Department, SalesUser, Product } from '../../../types/analytics';
import TimeAxisFilter from './TimeAxisFilter';
import CompanyAxisFilter from './CompanyAxisFilter';
import CustomerAxisFilter from './CustomerAxisFilter';
import dayjs from 'dayjs';

interface AnalysisFilterProps {
  onFilterChange: (filters: FilterCondition) => void;
  departments: Department[];
  users: SalesUser[];
  products: Product[];
  initialFilters?: FilterCondition;
}

const AnalysisFilter: React.FC<AnalysisFilterProps> = ({
  onFilterChange,
  departments,
  users,
  products,
  initialFilters,
}) => {
  const [form] = Form.useForm();
  const [selectedDepartment, setSelectedDepartment] = useState<
    string | undefined
  >(initialFilters?.companyAxis?.departmentId);

  const handleSubmit = (values: any) => {
    const filters: FilterCondition = {
      timeAxis: values.dateRange
        ? {
            startDate: values.dateRange[0].format('YYYY-MM-DD'),
            endDate: values.dateRange[1].format('YYYY-MM-DD'),
            granularity: values.granularity || 'monthly',
          }
        : undefined,
      companyAxis: {
        departmentId: values.department,
        userId: values.user,
        productId: values.product,
        teamId: undefined,
      },
      customerAxis: {
        companySize: values.companySize,
        industry: values.industry,
        isNewCustomer:
          values.customerType === 'new'
            ? true
            : values.customerType === 'existing'
              ? false
              : undefined,
        region: values.region,
      },
    };

    onFilterChange(filters);
  };

  const handleReset = () => {
    form.resetFields();
    setSelectedDepartment(undefined);
    onFilterChange({});
  };

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    form.setFieldsValue({ user: undefined });
  };

  const getInitialValues = () => {
    if (!initialFilters) return {};

    return {
      dateRange: initialFilters.timeAxis
        ? [
            dayjs(initialFilters.timeAxis.startDate),
            dayjs(initialFilters.timeAxis.endDate),
          ]
        : undefined,
      granularity: initialFilters.timeAxis?.granularity,
      department: initialFilters.companyAxis?.departmentId,
      user: initialFilters.companyAxis?.userId,
      product: initialFilters.companyAxis?.productId,
      companySize: initialFilters.customerAxis?.companySize,
      industry: initialFilters.customerAxis?.industry,
      customerType:
        initialFilters.customerAxis?.isNewCustomer === true
          ? 'new'
          : initialFilters.customerAxis?.isNewCustomer === false
            ? 'existing'
            : undefined,
      region: initialFilters.customerAxis?.region,
    };
  };

  return (
    <Card
      title={
        <Space>
          <FilterOutlined />
          <span>分析フィルター</span>
        </Space>
      }
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            リセット
          </Button>
          <Button type="primary" onClick={() => form.submit()}>
            適用
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={getInitialValues()}
      >
        <TimeAxisFilter />

        <CompanyAxisFilter
          departments={departments}
          users={users}
          products={products}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={handleDepartmentChange}
        />

        <CustomerAxisFilter />
      </Form>
    </Card>
  );
};

export default AnalysisFilter;
