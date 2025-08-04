import React, { useState } from 'react';
import {
  Card,
  Form,
  DatePicker,
  Select,
  Radio,
  Button,
  Space,
  Row,
  Col,
  Divider,
  Tag,
} from 'antd';
import {
  CalendarOutlined,
  TeamOutlined,
  ShopOutlined,
  FilterOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { FilterCondition, AnalysisType } from '../../types/analytics';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface AnalysisFilterProps {
  onFilterChange: (filters: FilterCondition) => void;
  departments: { id: string; name: string }[];
  users: { id: string; name: string; departmentId: string }[];
  products: { id: string; name: string; category: string }[];
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

  // フィルタ値の自動更新用
  const handleFilterUpdate = () => {
    const values = form.getFieldsValue();
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

  const industries = [
    '製造業',
    '小売業',
    'サービス業',
    '金融業',
    '不動産業',
    'IT・通信業',
    '医療・福祉',
    '教育',
    'その他',
  ];

  const regions = [
    '北海道',
    '東北',
    '関東',
    '中部',
    '近畿',
    '中国',
    '四国',
    '九州・沖縄',
  ];

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

  const filteredUsers = selectedDepartment
    ? users.filter(user => user.departmentId === selectedDepartment)
    : users;

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
        <Button icon={<ReloadOutlined />} onClick={handleReset}>
          リセット
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={getInitialValues()}
      >
        <Row gutter={16}>
          <Col span={24}>
            <Divider orientation="left">
              <Space>
                <CalendarOutlined />
                時間軸
              </Space>
            </Divider>
          </Col>

          <Col span={16}>
            <Form.Item
              name="dateRange"
              label="期間"
              rules={[{ required: true, message: '期間を選択してください' }]}
            >
              <RangePicker
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
                placeholder={['開始日', '終了日']}
                onChange={handleFilterUpdate}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="granularity" label="集計単位">
              <Select placeholder="選択してください" onChange={handleFilterUpdate}>
                <Option value="daily">日次</Option>
                <Option value="weekly">週次</Option>
                <Option value="monthly">月次</Option>
                <Option value="yearly">年次</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Divider orientation="left">
              <Space>
                <TeamOutlined />
                自社軸
              </Space>
            </Divider>
          </Col>

          <Col span={24}>
            <Row gutter={[16, 12]}>
              <Col span={24}>
                <Row align="middle">
                  <Col span={6}>
                    <span style={{ fontWeight: 500 }}>部署</span>
                  </Col>
                  <Col span={18}>
                    <Form.Item name="department" style={{ marginBottom: 0 }}>
                      <Select
                        placeholder="全部署"
                        allowClear
                        onChange={value => {
                          setSelectedDepartment(value);
                          form.setFieldsValue({ user: undefined });
                          handleFilterUpdate();
                        }}
                      >
                        {departments.map(dept => (
                          <Option key={dept.id} value={dept.id}>
                            {dept.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row align="middle">
                  <Col span={6}>
                    <span style={{ fontWeight: 500 }}>営業担当者</span>
                  </Col>
                  <Col span={18}>
                    <Form.Item name="user" style={{ marginBottom: 0 }}>
                      <Select placeholder="全担当者" allowClear onChange={handleFilterUpdate}>
                        {filteredUsers.map(user => (
                          <Option key={user.id} value={user.id}>
                            {user.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row align="middle">
                  <Col span={6}>
                    <span style={{ fontWeight: 500 }}>商材</span>
                  </Col>
                  <Col span={18}>
                    <Form.Item name="product" style={{ marginBottom: 0 }}>
                      <Select placeholder="全商材" allowClear onChange={handleFilterUpdate}>
                        {products.map(product => (
                          <Option key={product.id} value={product.id}>
                            <Space>
                              {product.name}
                              <Tag color="blue" style={{ fontSize: '10px' }}>
                                {product.category}
                              </Tag>
                            </Space>
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Divider orientation="left">
              <Space>
                <ShopOutlined />
                顧客軸
              </Space>
            </Divider>
          </Col>

          <Col span={24}>
            <Row gutter={[16, 12]}>
              <Col span={24}>
                <Row align="middle">
                  <Col span={6}>
                    <span style={{ fontWeight: 500 }}>企業規模</span>
                  </Col>
                  <Col span={18}>
                    <Form.Item name="companySize" style={{ marginBottom: 0 }}>
                      <Select placeholder="全規模" allowClear onChange={handleFilterUpdate}>
                        <Option value="small">小規模（～50名）</Option>
                        <Option value="medium">中規模（51～300名）</Option>
                        <Option value="large">大規模（301～1000名）</Option>
                        <Option value="enterprise">超大規模（1001名～）</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row align="middle">
                  <Col span={6}>
                    <span style={{ fontWeight: 500 }}>業界</span>
                  </Col>
                  <Col span={18}>
                    <Form.Item name="industry" style={{ marginBottom: 0 }}>
                      <Select placeholder="全業界" allowClear onChange={handleFilterUpdate}>
                        {industries.map(industry => (
                          <Option key={industry} value={industry}>
                            {industry}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row align="middle">
                  <Col span={6}>
                    <span style={{ fontWeight: 500 }}>顧客タイプ</span>
                  </Col>
                  <Col span={18}>
                    <Form.Item name="customerType" style={{ marginBottom: 0 }}>
                      <Select placeholder="全タイプ" allowClear onChange={handleFilterUpdate}>
                        <Option value="new">新規顧客</Option>
                        <Option value="existing">既存顧客</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24}>
                <Row align="middle">
                  <Col span={6}>
                    <span style={{ fontWeight: 500 }}>地域</span>
                  </Col>
                  <Col span={18}>
                    <Form.Item name="region" style={{ marginBottom: 0 }}>
                      <Select placeholder="全地域" allowClear onChange={handleFilterUpdate}>
                        {regions.map(region => (
                          <Option key={region} value={region}>
                            {region}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default AnalysisFilter;
