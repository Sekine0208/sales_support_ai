import React, { useState } from 'react';
import { Modal, Button, Space, Typography, Steps, Card, message, Row, Col } from 'antd';
import { PhoneOutlined, CloseOutlined } from '@ant-design/icons';
import VoiceRecordingScreen from './VoiceRecordingScreen';
import CallSummaryScreen from './CallSummaryScreen';

const { Title, Text } = Typography;

interface CallPopupProps {
  visible: boolean;
  onClose: () => void;
  companyData: {
    companyName: string;
    contactPerson: string;
    phoneNumber: string;
    industry?: string;
  };
}

type CallStep = 'confirm' | 'recording' | 'summary';

const CallPopup: React.FC<CallPopupProps> = ({
  visible,
  onClose,
  companyData,
}) => {
  const [currentStep, setCurrentStep] = useState<CallStep>('confirm');
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState('');

  const handleStartCall = () => {
    // 実際の発信処理（デモでは省略）
    console.log('発信開始:', companyData.phoneNumber);
    message.success('発信しました');
    setCurrentStep('recording');
  };

  const handleRecordingComplete = (transcriptText: string, duration: number) => {
    setTranscript(transcriptText);
    setCallDuration(duration);
    setCurrentStep('summary');
  };

  const handleSummaryComplete = () => {
    message.success('通話記録を保存しました');
    onClose();
    // リセット
    setCurrentStep('confirm');
    setTranscript('');
    setCallDuration(0);
  };

  const handleModalClose = () => {
    if (currentStep === 'recording') {
      Modal.confirm({
        title: '通話を終了しますか？',
        content: '進行中の通話を終了し、記録画面に移行します。',
        okText: '終了',
        cancelText: 'キャンセル',
        onOk() {
          setCurrentStep('summary');
        },
      });
    } else {
      onClose();
      // リセット
      setCurrentStep('confirm');
      setTranscript('');
      setCallDuration(0);
    }
  };

  const getModalTitle = () => {
    switch (currentStep) {
      case 'confirm':
        return '発信確認';
      case 'recording':
        return '通話中';
      case 'summary':
        return '通話記録';
      default:
        return '';
    }
  };

  const getModalWidth = () => {
    switch (currentStep) {
      case 'confirm':
        return 520;
      case 'recording':
        return 800;
      case 'summary':
        return 1000;
      default:
        return 520;
    }
  };

  return (
    <Modal
      title={getModalTitle()}
      open={visible}
      onCancel={handleModalClose}
      footer={null}
      width={getModalWidth()}
      closable={currentStep !== 'recording'}
      maskClosable={false}
      centered
    >
      {currentStep === 'confirm' && (
        <div style={{ padding: '20px 0' }}>
          <Card style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={16}>
                <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                  {companyData.companyName}
                </Title>
                <Space direction="vertical" size="small">
                  <Text>
                    <strong>担当者:</strong> {companyData.contactPerson}
                  </Text>
                  <Text>
                    <strong>電話番号:</strong> {companyData.phoneNumber}
                  </Text>
                  {companyData.industry && (
                    <Text>
                      <strong>業界:</strong> {companyData.industry}
                    </Text>
                  )}
                </Space>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <PhoneOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
              </Col>
            </Row>
          </Card>
          
          <Text type="secondary" style={{ display: 'block', marginBottom: 20 }}>
            上記の番号に発信します。よろしいですか？
          </Text>
          
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleModalClose}>
              キャンセル
            </Button>
            <Button
              type="primary"
              icon={<PhoneOutlined />}
              onClick={handleStartCall}
              size="large"
            >
              発信
            </Button>
          </Space>
        </div>
      )}

      {currentStep === 'recording' && (
        <VoiceRecordingScreen
          companyData={companyData}
          onComplete={handleRecordingComplete}
          onCancel={() => setCurrentStep('summary')}
        />
      )}

      {currentStep === 'summary' && (
        <CallSummaryScreen
          companyData={companyData}
          transcript={transcript}
          callDuration={callDuration}
          onComplete={handleSummaryComplete}
          onCancel={handleModalClose}
        />
      )}
    </Modal>
  );
};

export default CallPopup; 