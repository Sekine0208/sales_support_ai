import React from 'react';
import { Alert, Button, Space } from 'antd';
import {
  PhoneOutlined,
  WarningOutlined,
  InfoCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { KPIData } from '../../types';

interface NextActionProps {
  nextAction: KPIData['nextAction'];
  onAction: () => void;
}

const NextAction: React.FC<NextActionProps> = ({ nextAction, onAction }) => {
  const getAlertType = () => {
    switch (nextAction.urgency) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'info';
    }
  };

  const getIcon = () => {
    switch (nextAction.urgency) {
      case 'high':
        return <ExclamationCircleOutlined />;
      case 'medium':
        return <WarningOutlined />;
      case 'low':
        return <InfoCircleOutlined />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  const getActionIcon = () => {
    switch (nextAction.actionType) {
      case 'call':
        return <PhoneOutlined />;
      default:
        return null;
    }
  };

  const getActionText = () => {
    switch (nextAction.actionType) {
      case 'call':
        return '架電リストへ';
      case 'appointment':
        return 'スケジュール確認';
      case 'proposal':
        return '提案書作成へ';
      default:
        return 'アクション実行';
    }
  };

  return (
    <Alert
      message="次にやること"
      description={
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>{nextAction.message}</div>
          <Button
            type="primary"
            danger={nextAction.urgency === 'high'}
            icon={getActionIcon()}
            onClick={onAction}
          >
            {getActionText()}
          </Button>
        </Space>
      }
      type={getAlertType()}
      icon={getIcon()}
      showIcon
      style={{ marginBottom: 24 }}
    />
  );
};

export default NextAction;
