import React from 'react';
import { Row, Col, Form, DatePicker, Select, Divider, Space } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import type { FilterCondition } from '../../../types/analytics';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface TimeAxisFilterProps {
  onValuesChange?: (values: any) => void;
}

const TimeAxisFilter: React.FC<TimeAxisFilterProps> = ({ onValuesChange }) => {
  return (
    <>
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
            />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item name="granularity" label="集計単位">
            <Select placeholder="選択してください">
              <Option value="daily">日次</Option>
              <Option value="weekly">週次</Option>
              <Option value="monthly">月次</Option>
              <Option value="yearly">年次</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default TimeAxisFilter;
