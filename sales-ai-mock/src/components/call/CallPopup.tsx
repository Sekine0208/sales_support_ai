import React, { useState } from 'react';
import { Modal, message } from 'antd';
import VoiceRecordingScreen from './VoiceRecordingScreen';
import CallSummaryScreen from './CallSummaryScreen';
import ActivityHistory from './ActivityHistory';

interface CallPopupProps {
  visible: boolean;
  onClose: () => void;
  companyData: {
    id: string;
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
  // 発信確認画面をスキップして直接録音画面に移行
  const [currentStep, setCurrentStep] = useState<CallStep>('recording');
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState('');

  // 発信確認画面の処理をコメントアウト（直接録音画面に移行するため不要）
  /*
  const handleStartCall = () => {
    // 実際の発信処理（デモでは省略）
    console.log('発信開始:', companyData.phoneNumber);
    message.success('発信しました');
    setCurrentStep('recording');
  };
  */

  const handleRecordingComplete = (transcriptText: string, duration: number) => {
    setTranscript(transcriptText);
    setCallDuration(duration);
    setCurrentStep('summary');
  };

  const handleSummaryComplete = () => {
    message.success('通話記録を保存しました');
    onClose();
    // リセット
    // setCurrentStep('confirm'); // 発信確認画面をコメントアウト
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
      // setCurrentStep('confirm'); // 発信確認画面をコメントアウト
      setTranscript('');
      setCallDuration(0);
    }
  };

  const getModalTitle = () => {
    switch (currentStep) {
      // case 'confirm': // 発信確認画面をコメントアウト
      //   return '発信確認';
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
      // case 'confirm': // 発信確認画面をコメントアウト
      //   return 520;
      case 'recording':
        return 1800; // 幅をさらに拡張
      case 'summary':
        return 1000;
      default:
        return 520;
    }
  };

  const getModalHeight = () => {
    switch (currentStep) {
      case 'recording':
        return '95vh'; // 高さをさらに拡張
      default:
        return 'auto';
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
      style={{ height: getModalHeight() }}
      bodyStyle={{ 
        height: currentStep === 'recording' ? 'calc(95vh - 110px)' : 'auto',
        padding: 0,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* 発信確認画面をコメントアウト（直接録音画面に移行するため不要）
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
      */}

      {currentStep === 'recording' && (
        <div style={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          padding: '20px'
        }}>
          {/* 上半分: 録音画面 */}
          <div style={{ 
            height: '50%', 
            minHeight: '400px',
            marginBottom: '20px'
          }}>
            <VoiceRecordingScreen
              companyData={companyData}
              onComplete={handleRecordingComplete}
              onCancel={() => setCurrentStep('summary')}
            />
          </div>

          {/* 下半分: 活動履歴 */}
          <div style={{ 
            height: '50%',
            flex: 1,
            overflow: 'hidden'
          }}>
            <ActivityHistory 
              companyId={companyData.id} // 正しい企業IDを使用
              limit={50}
            />
          </div>
        </div>
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