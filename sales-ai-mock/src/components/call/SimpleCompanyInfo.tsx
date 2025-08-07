import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Button,
  Typography,
  Divider,
  Modal,
  App,
  Row,
  Col,
} from 'antd';
import {
  PhoneOutlined,
  CloseOutlined,
  UserOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import type { CallItem } from '../../types';
import CallPopup from './CallPopup';

const { Text } = Typography;

interface SimpleCompanyInfoProps {
  companyData: CallItem;
  onClose?: () => void;
}

const SimpleCompanyInfo: React.FC<SimpleCompanyInfoProps> = ({
  companyData,
  onClose,
}) => {
  const { modal } = App.useApp();
  const [showCallPopup, setShowCallPopup] = useState(false);

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'high':
        return { color: 'error', text: '高' };
      case 'medium':
        return { color: 'warning', text: '中' };
      case 'low':
        return { color: 'success', text: '低' };
      default:
        return { color: 'default', text: priority };
    }
  };

  const priorityConfig = getPriorityConfig(companyData.priority);

  const handleCall = () => {
    setShowCallPopup(true);
  };

  // 会社基本情報のテーブルデータ（縦横逆）
  const companyInfoData = [
    {
      key: 'companyName',
      field: '企業名',
      value: companyData.companyName,
    },
    {
      key: 'contactPerson',
      field: '担当者',
      value: companyData.contactPerson,
    },
    {
      key: 'phoneNumber',
      field: '電話番号',
      value: companyData.phoneNumber,
    },
    {
      key: 'industry',
      field: '業界',
      value: companyData.industry,
    },
    {
      key: 'lastContactDate',
      field: '最終連絡',
      value: companyData.lastContactDate,
    },
    {
      key: 'priority',
      field: '優先度',
      value: priorityConfig.text,
      render: () => <Tag color={priorityConfig.color}>{priorityConfig.text}</Tag>,
    },
  ];

  // キーパーソン情報のテーブルデータ
  const keyPersonsData = companyData.keyPersons?.map((person, index) => ({
    key: `person-${index}`,
    name: person.name,
    position: person.position,
    notes: person.notes,
  })) || [];

  // 受注履歴のテーブルデータ
  const purchaseHistoryData = companyData.purchasedProducts?.map((product, index) => ({
    key: `product-${index}`,
    product: product,
    purchaseDate: '過去の受注', // 実際のデータでは日付を表示
  })) || [];

  // 基本情報のカラム定義（縦横逆）
  const companyInfoColumns = [
    {
      title: '項目',
      dataIndex: 'field',
      key: 'field',
      width: '30%',
      render: (text: string) => (
        <Text strong style={{ fontSize: '13px' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '内容',
      dataIndex: 'value',
      key: 'value',
      width: '70%',
      render: (text: string, record: any) => {
        if (record.render) {
          return record.render();
        }
        return <Text style={{ fontSize: '13px' }}>{text}</Text>;
      },
    },
  ];

  // 基本情報のカラム定義（横並び）
  const companyInfoHorizontalColumns = [
    {
      title: '企業名',
      dataIndex: 'companyName',
      key: 'companyName',
      width: '16%',
      render: () => (
        <Text style={{ fontSize: '13px' }}>{companyData.companyName}</Text>
      ),
    },
    {
      title: '担当者',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: '16%',
      render: () => (
        <Text style={{ fontSize: '13px' }}>{companyData.contactPerson}</Text>
      ),
    },
    {
      title: '電話番号',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      width: '16%',
      render: () => (
        <Text style={{ fontSize: '13px' }}>{companyData.phoneNumber}</Text>
      ),
    },
    {
      title: '業界',
      dataIndex: 'industry',
      key: 'industry',
      width: '16%',
      render: () => (
        <Text style={{ fontSize: '13px' }}>{companyData.industry}</Text>
      ),
    },
    {
      title: '最終連絡',
      dataIndex: 'lastContactDate',
      key: 'lastContactDate',
      width: '16%',
      render: () => (
        <Text style={{ fontSize: '13px' }}>{companyData.lastContactDate}</Text>
      ),
    },
    {
      title: '優先度',
      dataIndex: 'priority',
      key: 'priority',
      width: '16%',
      render: () => (
        <Tag color={priorityConfig.color}>{priorityConfig.text}</Tag>
      ),
    },
  ];

  const keyPersonsColumns = [
    {
      title: '氏名',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (text: string) => (
        <Text strong style={{ fontSize: '13px' }}>
          {text}
        </Text>
      ),
    },
    {
      title: '役職',
      dataIndex: 'position',
      key: 'position',
      width: '30%',
      render: (text: string) => (
        <Text style={{ fontSize: '13px' }}>{text}</Text>
      ),
    },
    {
      title: '備考',
      dataIndex: 'notes',
      key: 'notes',
      width: '30%',
      render: (text: string) => (
        <Text type="secondary" style={{ fontSize: '12px', fontStyle: 'italic' }}>
          {text || '-'}
        </Text>
      ),
    },
  ];

  const purchaseHistoryColumns = [
    {
      title: '商品・サービス',
      dataIndex: 'product',
      key: 'product',
      width: '70%',
      render: (text: string) => (
        <Text style={{ fontSize: '13px' }}>{text}</Text>
      ),
    },
    {
      title: '受注日',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      width: '30%',
      render: (text: string) => (
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {text}
        </Text>
      ),
    },
  ];

  return (
    <Card
      size="small"
      title={
        <Space>
          <Text strong style={{ fontSize: '16px' }}>
            {companyData.companyName}
          </Text>
          <Tag color={priorityConfig.color}>優先度: {priorityConfig.text}</Tag>
        </Space>
      }
      extra={
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<PhoneOutlined />}
            onClick={handleCall}
          >
            発信
          </Button>
          {onClose && (
            <Button size="small" icon={<CloseOutlined />} onClick={onClose} />
          )}
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      {/* 横並びレイアウト */}
      <Row gutter={16}>
        {/* 基本情報 */}
        <Col span={8}>
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ fontSize: '14px', marginBottom: 8, display: 'block' }}>
              基本情報
            </Text>
            <Table
              columns={companyInfoHorizontalColumns}
              dataSource={[{ key: 'info' }]}
              pagination={false}
              size="small"
              bordered
              style={{ fontSize: '12px' }}
              scroll={{ x: 600 }}
            />
          </div>
        </Col>

        {/* キーパーソン情報 */}
        <Col span={8}>
          {keyPersonsData.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Space style={{ marginBottom: 8 }}>
                <UserOutlined style={{ color: '#52c41a' }} />
                <Text strong style={{ fontSize: '14px' }}>
                  キーパーソン
                </Text>
              </Space>
              <Table
                columns={keyPersonsColumns}
                dataSource={keyPersonsData}
                pagination={false}
                size="small"
                bordered
                style={{ fontSize: '12px' }}
                scroll={{ x: 400 }}
              />
            </div>
          )}
        </Col>

        {/* 受注履歴 */}
        <Col span={8}>
          {purchaseHistoryData.length > 0 && (
            <div style={{ marginBottom: 16 }}>
              <Space style={{ marginBottom: 8 }}>
                <ShoppingOutlined style={{ color: '#1890ff' }} />
                <Text strong style={{ fontSize: '14px' }}>
                  過去の受注履歴
                </Text>
              </Space>
              <Table
                columns={purchaseHistoryColumns}
                dataSource={purchaseHistoryData}
                pagination={false}
                size="small"
                bordered
                style={{ fontSize: '12px' }}
                scroll={{ x: 400 }}
              />
            </div>
          )}
        </Col>
      </Row>
      
      <CallPopup
        visible={showCallPopup}
        onClose={() => setShowCallPopup(false)}
        companyData={{
          companyName: companyData.companyName,
          contactPerson: companyData.contactPerson,
          phoneNumber: companyData.phoneNumber,
          industry: companyData.industry
        }}
      />
    </Card>
  );
};

export default SimpleCompanyInfo;
