import React, { useState } from 'react';
import {
  Card,
  Descriptions,
  Tag,
  List,
  Typography,
  Space,
  Button,
  Tabs,
  Modal,
  App,
} from 'antd';
import {
  UserOutlined,
  LineChartOutlined,
  ShoppingCartOutlined,
  HistoryOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import type { CallItem } from '../../types';
import CallRecording from './CallRecording';
import CallMemo from './CallMemo';
import CallHistoryModal from './CallHistoryModal';
import CallPopup from './CallPopup';
import type { CallMemoData } from './CallMemo';

const { Text } = Typography;
const { TabPane } = Tabs;

interface ReferenceInfoProps {
  selectedCompany: CallItem | null;
}

const ReferenceInfo: React.FC<ReferenceInfoProps> = ({ selectedCompany }) => {
  const { modal } = App.useApp();
  const [transcription, setTranscription] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [callHistory, setCallHistory] = useState<any[]>([]);
  const [showCallPopup, setShowCallPopup] = useState(false);

  if (!selectedCompany) {
    return (
      <Card
        style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text type="secondary">架電リストから企業を選択してください</Text>
      </Card>
    );
  }

  const handleTranscriptionComplete = (text: string) => {
    setTranscription(text);
  };

  const handleMemoSave = (memo: CallMemoData) => {
    const newHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ja-JP'),
      duration: '00:00', // 実際の通話時間を設定
      ...memo,
    };
    setCallHistory([newHistoryItem, ...callHistory]);
  };

  const handleCall = () => {
    setShowCallPopup(true);
  };

  return (
    <div>
      <Card
        title={selectedCompany.companyName}
        style={{ marginBottom: 16 }}
        extra={
          <Space>
            <Button
              icon={<HistoryOutlined />}
              onClick={() => setShowHistory(true)}
            >
              通話履歴
            </Button>
            <Button
              type="primary"
              icon={<PhoneOutlined />}
              onClick={handleCall}
            >
              発信
            </Button>
          </Space>
        }
      >
        <Descriptions column={1} size="small">
          <Descriptions.Item label="担当者">
            {selectedCompany.contactPerson}
          </Descriptions.Item>
          <Descriptions.Item label="電話番号">
            {selectedCompany.phoneNumber}
          </Descriptions.Item>
          <Descriptions.Item label="業界">
            {selectedCompany.industry}
          </Descriptions.Item>
          <Descriptions.Item label="最終接触日">
            {selectedCompany.lastContactDate}
          </Descriptions.Item>
        </Descriptions>
        <div style={{ marginTop: 16 }}>
          <Text strong>備考: </Text>
          <Text>{selectedCompany.notes}</Text>
        </div>
      </Card>

      <Tabs defaultActiveKey="1" style={{ marginBottom: 16 }}>
        <TabPane tab="基本情報" key="1">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card
              title={
                <Space>
                  <ShoppingCartOutlined />
                  過去購入製品
                </Space>
              }
              size="small"
            >
              {selectedCompany.purchasedProducts.length > 0 ? (
                <Space wrap>
                  {selectedCompany.purchasedProducts.map((product, index) => (
                    <Tag key={index} color="blue">
                      {product}
                    </Tag>
                  ))}
                </Space>
              ) : (
                <Text type="secondary">購入履歴なし</Text>
              )}
            </Card>

            <Card
              title={
                <Space>
                  <LineChartOutlined />
                  業界トレンド
                </Space>
              }
              size="small"
            >
              <List
                size="small"
                dataSource={selectedCompany.industryTrends}
                renderItem={item => (
                  <List.Item>
                    <Text>• {item}</Text>
                  </List.Item>
                )}
              />
            </Card>

            <Card
              title={
                <Space>
                  <UserOutlined />
                  キーパーソン
                </Space>
              }
              size="small"
            >
              <List
                size="small"
                dataSource={selectedCompany.keyPersons}
                renderItem={person => (
                  <List.Item>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        <Text strong>{person.name}</Text>
                        <Tag color="green">{person.position}</Tag>
                      </Space>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {person.notes}
                      </Text>
                    </Space>
                  </List.Item>
                )}
              />
            </Card>
          </Space>
        </TabPane>

        <TabPane tab="通話録音" key="2">
          <CallRecording
            companyName={selectedCompany.companyName}
            onTranscriptionComplete={handleTranscriptionComplete}
          />
        </TabPane>

        <TabPane tab="通話メモ" key="3">
          <CallMemo
            companyName={selectedCompany.companyName}
            transcription={transcription}
            onSave={handleMemoSave}
          />
        </TabPane>
      </Tabs>

      <CallHistoryModal
        visible={showHistory}
        companyName={selectedCompany.companyName}
        history={callHistory}
        onClose={() => setShowHistory(false)}
      />

      <CallPopup
        visible={showCallPopup}
        onClose={() => setShowCallPopup(false)}
        companyData={{
          companyName: selectedCompany.companyName,
          contactPerson: selectedCompany.contactPerson,
          phoneNumber: selectedCompany.phoneNumber,
          industry: selectedCompany.industry
        }}
      />
    </div>
  );
};

export default ReferenceInfo;
