import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Typography,
  Descriptions,
  Card,
  Space,
  Tag,
  Button,
  Form,
  Input,
  Select,
  Rate,
  App,
} from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import type { CallItem, BANTCInfo } from '../../types';
import ActivityHistory from './ActivityHistory';
import ReferenceInfo from './ReferenceInfo';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { Option } = Select;

interface CustomerDetailModalProps {
  visible: boolean;
  callItem: CallItem | null;
  onClose: () => void;
  onUpdate?: (updatedItem: CallItem) => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  visible,
  callItem,
  onClose,
  onUpdate,
}) => {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState('basic');
  const [editingBANTC, setEditingBANTC] = useState(false);
  const [form] = Form.useForm();

  // BANTC情報のモックデータ（AIたたき台）
  const mockBANTCInfo: BANTCInfo = {
    id: 'BANTC001',
    contactId: 'CNT001',
    companyId: callItem?.id || '',
    budget: {
      range: '1000万円～2000万円',
      amount: 15000000,
      period: '2025年度',
      notes: '予算は確保済み。稟議は部長決裁で可能。',
    },
    authority: {
      level: 'high',
      title: '情報システム部長',
      decisionProcess: '部長決裁 → 役員会報告',
      notes: 'IT投資に関する決裁権限あり',
    },
    need: {
      urgency: 'high',
      painPoints: ['Excel管理の限界', '営業情報の分散', 'レポート作成の手間'],
      requirements: ['クラウド型', 'モバイル対応', '既存システム連携'],
      notes: '4月の新年度開始までに導入したい',
    },
    timeline: {
      targetDate: '2025-04-01',
      phase: '選定段階',
      constraints: ['予算承認期限：2月末', '現行システム契約：3月末'],
      notes: '2月中に決定、3月に導入準備',
    },
    competition: {
      competitors: ['A社CRM', 'B社SFA'],
      currentSolution: 'Excel + 独自開発システム',
      switchingCost: '移行コスト300万円程度',
      notes: 'A社と比較検討中。価格面で優位性あり',
    },
    aiGenerated: true,
    humanVerified: false,
    updatedAt: new Date().toISOString(),
  };

  const handleSaveBANTC = (values: any) => {
    // BANTC情報の保存処理
    message.success('BANTC情報を更新しました');
    setEditingBANTC(false);
  };

  if (!callItem) return null;

  return (
    <Modal
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            {callItem.companyName}
          </Title>
          <Tag
            color={
              callItem.priority === 'high'
                ? 'red'
                : callItem.priority === 'medium'
                  ? 'orange'
                  : 'default'
            }
          >
            {callItem.priority === 'high'
              ? '高'
              : callItem.priority === 'medium'
                ? '中'
                : '低'}
            優先度
          </Tag>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={null}
      bodyStyle={{ padding: 0 }}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ minHeight: 500 }}
      >
        <TabPane tab="基本情報" key="basic">
          <div style={{ padding: 24 }}>
            <Descriptions bordered column={2}>
              <Descriptions.Item label="担当者">
                {callItem.contactPerson}
              </Descriptions.Item>
              <Descriptions.Item label="電話番号">
                {callItem.phoneNumber}
              </Descriptions.Item>
              <Descriptions.Item label="業界">
                {callItem.industry}
              </Descriptions.Item>
              <Descriptions.Item label="ステータス">
                <Tag
                  color={
                    callItem.status === 'new'
                      ? 'green'
                      : callItem.status === 'negotiating'
                        ? 'blue'
                        : callItem.status === 'proposal'
                          ? 'orange'
                          : 'default'
                  }
                >
                  {callItem.status === 'new'
                    ? '新規'
                    : callItem.status === 'negotiating'
                      ? '商談中'
                      : callItem.status === 'proposal'
                        ? '提案中'
                        : '成約'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="最終接触日">
                {callItem.lastContactDate}
              </Descriptions.Item>
              <Descriptions.Item label="購入製品" span={2}>
                {callItem.purchasedProducts.map((product, index) => (
                  <Tag key={index}>{product}</Tag>
                ))}
              </Descriptions.Item>
              <Descriptions.Item label="備考" span={2}>
                <Paragraph>{callItem.notes}</Paragraph>
              </Descriptions.Item>
            </Descriptions>

            <Card title="キーパーソン" style={{ marginTop: 16 }}>
              {callItem.keyPersons.map((person, index) => (
                <Card.Grid key={index} style={{ width: '50%' }}>
                  <Space direction="vertical">
                    <Text strong>{person.name}</Text>
                    <Text type="secondary">{person.position}</Text>
                    <Text>{person.notes}</Text>
                  </Space>
                </Card.Grid>
              ))}
            </Card>
          </div>
        </TabPane>

        <TabPane tab="BANTC情報" key="bantc">
          <div style={{ padding: 24 }}>
            <Space style={{ marginBottom: 16 }}>
              {!editingBANTC ? (
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setEditingBANTC(true)}
                >
                  編集
                </Button>
              ) : (
                <>
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => form.submit()}
                  >
                    保存
                  </Button>
                  <Button
                    icon={<CloseOutlined />}
                    onClick={() => setEditingBANTC(false)}
                  >
                    キャンセル
                  </Button>
                </>
              )}
              {mockBANTCInfo.aiGenerated && <Tag color="blue">AIたたき台</Tag>}
            </Space>

            {!editingBANTC ? (
              <Descriptions bordered column={1}>
                <Descriptions.Item label="Budget（予算）">
                  <Space direction="vertical">
                    <Text strong>{mockBANTCInfo.budget.range}</Text>
                    <Text>{mockBANTCInfo.budget.notes}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Authority（決裁権限）">
                  <Space direction="vertical">
                    <Space>
                      <Text strong>{mockBANTCInfo.authority.title}</Text>
                      <Tag
                        color={
                          mockBANTCInfo.authority.level === 'high'
                            ? 'red'
                            : 'default'
                        }
                      >
                        決裁権限
                        {mockBANTCInfo.authority.level === 'high' ? '高' : '中'}
                      </Tag>
                    </Space>
                    <Text>{mockBANTCInfo.authority.decisionProcess}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Need（ニーズ）">
                  <Space direction="vertical">
                    <Space>
                      <Text>緊急度:</Text>
                      <Rate
                        disabled
                        defaultValue={
                          mockBANTCInfo.need.urgency === 'high' ? 5 : 3
                        }
                      />
                    </Space>
                    <Text strong>課題:</Text>
                    {mockBANTCInfo.need.painPoints?.map((point, index) => (
                      <Tag key={index}>{point}</Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Timeline（導入時期）">
                  <Space direction="vertical">
                    <Text strong>
                      目標: {mockBANTCInfo.timeline.targetDate}
                    </Text>
                    <Text>{mockBANTCInfo.timeline.notes}</Text>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Competition（競合）">
                  <Space direction="vertical">
                    <Text>
                      競合: {mockBANTCInfo.competition.competitors?.join(', ')}
                    </Text>
                    <Text>
                      現在: {mockBANTCInfo.competition.currentSolution}
                    </Text>
                  </Space>
                </Descriptions.Item>
              </Descriptions>
            ) : (
              <Form form={form} layout="vertical" onFinish={handleSaveBANTC}>
                <Form.Item
                  name="budgetRange"
                  label="Budget（予算）"
                  initialValue={mockBANTCInfo.budget.range}
                >
                  <Select>
                    <Option value="～500万円">～500万円</Option>
                    <Option value="500万円～1000万円">500万円～1000万円</Option>
                    <Option value="1000万円～2000万円">
                      1000万円～2000万円
                    </Option>
                    <Option value="2000万円以上">2000万円以上</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="budgetNotes"
                  label="予算に関する補足"
                  initialValue={mockBANTCInfo.budget.notes}
                >
                  <TextArea rows={2} />
                </Form.Item>
                <Form.Item
                  name="authorityLevel"
                  label="Authority（決裁権限）"
                  initialValue={mockBANTCInfo.authority.level}
                >
                  <Select>
                    <Option value="high">高（決裁権限あり）</Option>
                    <Option value="medium">中（影響力あり）</Option>
                    <Option value="low">低（情報収集者）</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="needUrgency"
                  label="Need（緊急度）"
                  initialValue={mockBANTCInfo.need.urgency}
                >
                  <Select>
                    <Option value="high">高（至急対応必要）</Option>
                    <Option value="medium">中（通常対応）</Option>
                    <Option value="low">低（情報収集段階）</Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="timelineTarget"
                  label="Timeline（導入予定）"
                  initialValue={mockBANTCInfo.timeline.targetDate}
                >
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  name="competitionNotes"
                  label="Competition（競合情報）"
                  initialValue={mockBANTCInfo.competition.notes}
                >
                  <TextArea rows={3} />
                </Form.Item>
              </Form>
            )}
          </div>
        </TabPane>

        <TabPane tab="活動履歴" key="history">
          <div style={{ padding: 24 }}>
            <ActivityHistory companyId="CMP001" />
          </div>
        </TabPane>

        <TabPane tab="参照情報" key="reference">
          <div style={{ padding: 24 }}>
            <ReferenceInfo companyId={callItem.id} />
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default CustomerDetailModal;
