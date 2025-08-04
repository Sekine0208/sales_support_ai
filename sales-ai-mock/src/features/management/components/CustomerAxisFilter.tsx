import React from 'react';
import { Row, Col, Form, Select, Divider, Space } from 'antd';
import { ShopOutlined } from '@ant-design/icons';

const { Option } = Select;

interface CustomerAxisFilterProps {
  onValuesChange?: (values: any) => void;
}

const CustomerAxisFilter: React.FC<CustomerAxisFilterProps> = ({
  onValuesChange,
}) => {
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

  return (
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
                  <Select placeholder="全規模" allowClear>
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
                  <Select placeholder="全業界" allowClear>
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
                  <Select placeholder="全タイプ" allowClear>
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
                  <Select placeholder="全地域" allowClear>
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
  );
};

export default CustomerAxisFilter;
