import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Space,
  Button,
  Typography,
  Divider,
  Modal,
  App,
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
      <Descriptions
        column={2}
        size="small"
        layout="horizontal"
        styles={{ label: { width: '80px' } }}
      >
        <Descriptions.Item label="担当者">
          {companyData.contactPerson}
        </Descriptions.Item>
        <Descriptions.Item label="電話番号">
          {companyData.phoneNumber}
        </Descriptions.Item>
        <Descriptions.Item label="業界">
          {companyData.industry}
        </Descriptions.Item>
        <Descriptions.Item label="最終連絡">
          {companyData.lastContactDate}
        </Descriptions.Item>
      </Descriptions>

      {/* 過去の受注履歴 */}
      {companyData.purchasedProducts &&
        companyData.purchasedProducts.length > 0 && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ marginBottom: 12 }}>
              <Space>
                <ShoppingOutlined style={{ color: '#1890ff' }} />
                <Text strong>過去の受注履歴:</Text>
              </Space>
              <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
                {companyData.purchasedProducts.join('、')}
              </div>
            </div>
          </>
        )}

      {/* キーパーソン */}
      {companyData.keyPersons && companyData.keyPersons.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <Space>
            <UserOutlined style={{ color: '#52c41a' }} />
            <Text strong>キーパーソン:</Text>
          </Space>
          <div
            style={{
              marginTop: 4,
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            {companyData.keyPersons.map((person, index) => (
              <div key={index} style={{ fontSize: '12px' }}>
                <div>
                  <Text strong style={{ color: '#000' }}>
                    {person.name}
                  </Text>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    （{person.position}）
                  </Text>
                </div>
                {person.notes && (
                  <div
                    style={{
                      marginTop: 2,
                      fontSize: '11px',
                      color: '#666',
                      fontStyle: 'italic',
                    }}
                  >
                    {person.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
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
