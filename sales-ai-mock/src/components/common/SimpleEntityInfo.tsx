import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  Space,
  Button,
  Typography,
  Divider,
} from 'antd';
import {
  PhoneOutlined,
  CloseOutlined,
  UserOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import type { CallItem, VisitListItem } from '../../types';
import CallPopup from '../call/CallPopup';

const { Text } = Typography;

type EntityType = 'call' | 'visit';

interface BaseEntityData {
  companyName: string;
  contactPerson: string;
  phoneNumber?: string;
  industry?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface CallEntityData extends BaseEntityData {
  lastContactDate: string;
  purchasedProducts?: string[];
  keyPersons?: Array<{
    name: string;
    position: string;
    notes: string;
  }>;
}

interface VisitEntityData extends BaseEntityData {
  scheduledDate: string;
  purpose: string;
  location: string;
  visitStatus?: string;
}

interface SimpleEntityInfoProps {
  entityType: EntityType;
  entityData: CallEntityData | VisitEntityData;
  onClose?: () => void;
  onCall?: () => void;
  onVisitComplete?: () => void;
  onCreateNegotiation?: () => void;
}

const SimpleEntityInfo: React.FC<SimpleEntityInfoProps> = ({
  entityType,
  entityData,
  onClose,
  onCall,
  onVisitComplete,
  onCreateNegotiation,
}) => {
  const [showCallPopup, setShowCallPopup] = useState(false);

  const getPriorityConfig = (priority?: string) => {
    switch (priority) {
      case 'high':
        return { color: 'error', text: '高' };
      case 'medium':
        return { color: 'warning', text: '中' };
      case 'low':
        return { color: 'success', text: '低' };
      default:
        return { color: 'default', text: priority || '不明' };
    }
  };

  const priorityConfig = getPriorityConfig(entityData.priority);

  const handleCall = () => {
    if (onCall) {
      onCall();
    } else {
      setShowCallPopup(true);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'scheduled':
        return 'blue';
      case 'completed':
        return 'green';
      case 'cancelled':
        return 'red';
      case 'rescheduled':
        return 'orange';
      default:
        return 'default';
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'scheduled':
        return '予定';
      case 'completed':
        return '完了';
      case 'cancelled':
        return 'キャンセル';
      case 'rescheduled':
        return '再スケジュール';
      default:
        return status || '不明';
    }
  };

  const renderActionButtons = () => {
    const buttons = [];

    if (entityType === 'call') {
      buttons.push(
        <Button
          key="call"
          size="small"
          type="primary"
          icon={<PhoneOutlined />}
          onClick={handleCall}
        >
          発信
        </Button>
      );
    }

    if (entityType === 'visit') {
      if (onVisitComplete) {
        buttons.push(
          <Button
            key="complete"
            size="small"
            type="primary"
            icon={<CalendarOutlined />}
            onClick={onVisitComplete}
          >
            訪問完了
          </Button>
        );
      }
      if (onCreateNegotiation) {
        buttons.push(
          <Button
            key="negotiation"
            size="small"
            type="default"
            onClick={onCreateNegotiation}
          >
            商談設定
          </Button>
        );
      }
    }

    if (onClose) {
      buttons.push(
        <Button
          key="close"
          size="small"
          icon={<CloseOutlined />}
          onClick={onClose}
        />
      );
    }

    return buttons;
  };

  const renderBasicInfo = () => {
    const callData = entityData as CallEntityData;
    const visitData = entityData as VisitEntityData;

    return (
      <Descriptions
        column={2}
        size="small"
        layout="horizontal"
        styles={{ label: { width: '80px' } }}
      >
        <Descriptions.Item label="担当者">
          {entityData.contactPerson}
        </Descriptions.Item>
        {entityData.phoneNumber && (
          <Descriptions.Item label="電話番号">
            {entityData.phoneNumber}
          </Descriptions.Item>
        )}
        {entityData.industry && (
          <Descriptions.Item label="業界">
            {entityData.industry}
          </Descriptions.Item>
        )}
        {entityType === 'call' && callData.lastContactDate && (
          <Descriptions.Item label="最終連絡">
            {callData.lastContactDate}
          </Descriptions.Item>
        )}
        {entityType === 'visit' && visitData.scheduledDate && (
          <Descriptions.Item label="訪問予定">
            {new Date(visitData.scheduledDate).toLocaleString('ja-JP')}
          </Descriptions.Item>
        )}
        {entityType === 'visit' && visitData.purpose && (
          <Descriptions.Item label="目的">
            {visitData.purpose}
          </Descriptions.Item>
        )}
        {entityType === 'visit' && visitData.location && (
          <Descriptions.Item label="場所">
            <Space>
              <EnvironmentOutlined />
              {visitData.location}
            </Space>
          </Descriptions.Item>
        )}
      </Descriptions>
    );
  };

  const renderCallSpecificInfo = () => {
    if (entityType !== 'call') return null;
    
    const callData = entityData as CallEntityData;

    return (
      <>
        {/* 過去の受注履歴 */}
        {callData.purchasedProducts && callData.purchasedProducts.length > 0 && (
          <>
            <Divider style={{ margin: '12px 0' }} />
            <div style={{ marginBottom: 12 }}>
              <Space>
                <ShoppingOutlined style={{ color: '#1890ff' }} />
                <Text strong>過去の受注履歴:</Text>
              </Space>
              <div style={{ marginTop: 4, fontSize: '12px', color: '#666' }}>
                {callData.purchasedProducts.join('、')}
              </div>
            </div>
          </>
        )}

        {/* キーパーソン */}
        {callData.keyPersons && callData.keyPersons.length > 0 && (
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
              {callData.keyPersons.map((person, index) => (
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
      </>
    );
  };

  return (
    <>
      <Card
        size="small"
        title={
          <Space>
            <Text strong style={{ fontSize: '16px' }}>
              {entityData.companyName}
            </Text>
            {entityData.priority && (
              <Tag color={priorityConfig.color}>優先度: {priorityConfig.text}</Tag>
            )}
            {entityType === 'visit' && (entityData as VisitEntityData).visitStatus && (
              <Tag color={getStatusColor((entityData as VisitEntityData).visitStatus)}>
                {getStatusText((entityData as VisitEntityData).visitStatus)}
              </Tag>
            )}
          </Space>
        }
        extra={<Space>{renderActionButtons()}</Space>}
        style={{ marginBottom: 16 }}
      >
        {renderBasicInfo()}
        {renderCallSpecificInfo()}
      </Card>

      {/* CallPopup は架電の場合のみ */}
      {entityType === 'call' && (
        <CallPopup
          visible={showCallPopup}
          onClose={() => setShowCallPopup(false)}
          companyData={{
            companyName: entityData.companyName,
            contactPerson: entityData.contactPerson,
            phoneNumber: entityData.phoneNumber || '',
            industry: entityData.industry,
          }}
        />
      )}
    </>
  );
};

export default SimpleEntityInfo; 