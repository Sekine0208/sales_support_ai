import React from 'react';
import { Row, Col, Form, Select, Divider, Space, Tag } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import type { Department, SalesUser, Product } from '../../../types/analytics';

const { Option } = Select;

interface CompanyAxisFilterProps {
  departments: Department[];
  users: SalesUser[];
  products: Product[];
  selectedDepartment?: string;
  onDepartmentChange?: (value: string) => void;
}

const CompanyAxisFilter: React.FC<CompanyAxisFilterProps> = ({
  departments,
  users,
  products,
  selectedDepartment,
  onDepartmentChange,
}) => {
  const filteredUsers = selectedDepartment
    ? users.filter(user => user.departmentId === selectedDepartment)
    : users;

  return (
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
                    onChange={onDepartmentChange}
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
                  <Select placeholder="全担当者" allowClear>
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
                  <Select placeholder="全商材" allowClear>
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
  );
};

export default CompanyAxisFilter;
