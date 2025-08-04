import React from 'react';
import { Modal, Descriptions, Card, Typography, Tag, Space } from 'antd';
import {
  PhoneOutlined,
  TeamOutlined,
  LaptopOutlined,
  FileTextOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import type { ActivityType } from '../../types';

const { Title, Text } = Typography;

interface ActivityItem {
  id: string;
  companyId: string;
  companyName: string;
  contactId?: string;
  contactName?: string;
  userId: string;
  activityType: ActivityType;
  activityDate: string;
  summary: string;
  details?: string;
  status: string;
  resultType?: string;
  amount?: number;
}

interface ActivityDetailModalProps {
  visible: boolean;
  activity: ActivityItem | null;
  onClose: () => void;
}

const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  visible,
  activity,
  onClose,
}) => {
  if (!activity) return null;

  // フェーズごとの色パレット
  const getPhaseColor = (activityType: ActivityType) => {
    switch (activityType) {
      case 'call':
        return '#1890ff';
      case 'visit':
        return '#52c41a';
      case 'meeting':
        return '#722ed1';
      case 'estimate':
        return '#fa8c16';
      case 'order':
        return '#f5222d';
      default:
        return '#8c8c8c';
    }
  };

  // アクティビティタイプのアイコンを取得
  const getActivityIcon = (type: ActivityType) => {
    const color = getPhaseColor(type);
    switch (type) {
      case 'call':
        return <PhoneOutlined style={{ color, fontSize: 20 }} />;
      case 'visit':
        return <TeamOutlined style={{ color, fontSize: 20 }} />;
      case 'meeting':
        return <LaptopOutlined style={{ color, fontSize: 20 }} />;
      case 'estimate':
        return <FileTextOutlined style={{ color, fontSize: 20 }} />;
      case 'order':
        return <CheckOutlined style={{ color, fontSize: 20 }} />;
      default:
        return null;
    }
  };

  // 日本語のタイプ名を取得
  const getTypeLabel = (type: ActivityType) => {
    switch (type) {
      case 'call':
        return '架電';
      case 'visit':
        return '訪問';
      case 'meeting':
        return '商談';
      case 'estimate':
        return '見積り';
      case 'order':
        return '受注';
      default:
        return 'その他';
    }
  };

  const formattedDate = new Date(activity.activityDate).toLocaleString('ja-JP');

  // AI自動生成された架電情報
  const getCallAIInfo = () => ({
    bantc: {
      budget: '1,000万円～1,500万円（来年度予算で確保済み）',
      authority: '情報システム部長（IT投資の決裁権あり）',
      need: '営業効率化、データ一元管理（緊急度：高）',
      timeline: '2025年4月導入予定',
    },
    schedule: '来週火曜日 14:00 デモ実施予定',
    nextActions: [
      '製品資料の送付（本日中）',
      'デモ環境の準備',
      '業界カスタマイズ提案の作成',
      '決裁者との面談調整',
    ],
    recording: {
      summary:
        '新製品導入の検討について相談。現行システムの課題を詳しくヒアリング。特に営業データの一元管理と分析機能に強い関心を示した。',
      keywords: ['営業効率化', 'データ分析', 'クラウド化', '一元管理'],
    },
  });

  // AI自動生成された訪問情報
  const getVisitAIInfo = () => ({
    attendees: ['鈴木次郎（取締役）', '田中花子（システム担当）'],
    agenda: ['製品デモンストレーション', '導入効果の説明', '質疑応答'],
    outcome: 'IoT機能に高い評価。生産効率向上効果を数値で確認できた。',
    nextActions: [
      '詳細見積書の作成',
      '導入スケジュールの提案',
      '他部署との調整会議',
    ],
  });

  // AI自動生成された商談情報
  const getMeetingAIInfo = () => ({
    participants: ['山本九美（経営企画室長）', '佐藤三郎（技術部長）'],
    decisions: [
      'POC実施を正式決定',
      '予算枠1,200万円で承認',
      '導入時期を4月に設定',
    ],
    concerns: ['既存システムとの連携', 'データ移行の期間', '従業員の教育'],
    nextActions: [
      'POC計画書の作成',
      '技術要件の詳細確認',
      '役員会でのプレゼン準備',
    ],
  });

  return (
    <Modal
      title={
        <Space>
          {getActivityIcon(activity.activityType)}
          <span>{getTypeLabel(activity.activityType)}活動詳細</span>
        </Space>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {/* 基本情報 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Descriptions column={2} size="small">
            <Descriptions.Item label="企業名">
              {activity.companyName}
            </Descriptions.Item>
            <Descriptions.Item label="担当者">
              {activity.contactName}
            </Descriptions.Item>
            <Descriptions.Item label="日時">{formattedDate}</Descriptions.Item>
            <Descriptions.Item label="結果">
              <Tag
                style={{
                  backgroundColor: getPhaseColor(activity.activityType),
                  borderColor: getPhaseColor(activity.activityType),
                  color: 'white',
                }}
              >
                {activity.resultType}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="概要" span={2}>
              {activity.summary}
            </Descriptions.Item>
            {activity.details && (
              <Descriptions.Item label="詳細メモ" span={2}>
                {activity.details}
              </Descriptions.Item>
            )}
            {activity.amount && (
              <Descriptions.Item label="金額" span={2}>
                <Text strong style={{ color: '#52c41a', fontSize: 16 }}>
                  ¥{activity.amount.toLocaleString()}
                </Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Card>

        {/* AI自動生成情報 */}
        <Title level={5} style={{ color: '#722ed1', marginBottom: 16 }}>
          🤖 AI自動生成情報
        </Title>

        {/* 架電の詳細情報 */}
        {activity.activityType === 'call' && (
          <>
            {(() => {
              const callInfo = getCallAIInfo();
              return (
                <>
                  <Card
                    title="BANTC分析"
                    size="small"
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="予算（Budget）">
                        <Text>{callInfo.bantc.budget}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="決裁権（Authority）">
                        <Text>{callInfo.bantc.authority}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="ニーズ（Need）">
                        <Text>{callInfo.bantc.need}</Text>
                      </Descriptions.Item>
                      <Descriptions.Item label="導入時期（Timeline）">
                        <Text>{callInfo.bantc.timeline}</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card
                    title="今後の検討スケジュール"
                    size="small"
                    style={{ marginBottom: 16 }}
                  >
                    <Text>{callInfo.schedule}</Text>
                  </Card>

                  <Card
                    title="通話録音要約"
                    size="small"
                    style={{ marginBottom: 16 }}
                  >
                    <Text>{callInfo.recording.summary}</Text>
                    <div style={{ marginTop: 8 }}>
                      <Text strong>キーワード: </Text>
                      {callInfo.recording.keywords.map((keyword, index) => (
                        <Tag
                          key={index}
                          color="purple"
                          style={{ marginRight: 4 }}
                        >
                          {keyword}
                        </Tag>
                      ))}
                    </div>
                  </Card>

                  <Card title="ネクストアクション" size="small">
                    <ul style={{ marginBottom: 0 }}>
                      {callInfo.nextActions.map((action, index) => (
                        <li key={index} style={{ marginBottom: 4 }}>
                          <Text>{action}</Text>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </>
              );
            })()}
          </>
        )}

        {/* 訪問の詳細情報 */}
        {activity.activityType === 'visit' && (
          <>
            {(() => {
              const visitInfo = getVisitAIInfo();
              return (
                <>
                  <Card
                    title="訪問詳細"
                    size="small"
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="参加者">
                        {visitInfo.attendees.map((attendee, index) => (
                          <Tag
                            key={index}
                            style={{ marginBottom: 4, marginRight: 4 }}
                          >
                            {attendee}
                          </Tag>
                        ))}
                      </Descriptions.Item>
                      <Descriptions.Item label="アジェンダ">
                        <ul style={{ marginBottom: 0 }}>
                          {visitInfo.agenda.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </Descriptions.Item>
                      <Descriptions.Item label="成果">
                        {visitInfo.outcome}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card title="ネクストアクション" size="small">
                    <ul style={{ marginBottom: 0 }}>
                      {visitInfo.nextActions.map((action, index) => (
                        <li key={index} style={{ marginBottom: 4 }}>
                          <Text>{action}</Text>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </>
              );
            })()}
          </>
        )}

        {/* 商談の詳細情報 */}
        {activity.activityType === 'meeting' && (
          <>
            {(() => {
              const meetingInfo = getMeetingAIInfo();
              return (
                <>
                  <Card
                    title="商談詳細"
                    size="small"
                    style={{ marginBottom: 16 }}
                  >
                    <Descriptions column={1} size="small">
                      <Descriptions.Item label="参加者">
                        {meetingInfo.participants.map((participant, index) => (
                          <Tag
                            key={index}
                            style={{ marginBottom: 4, marginRight: 4 }}
                          >
                            {participant}
                          </Tag>
                        ))}
                      </Descriptions.Item>
                      <Descriptions.Item label="決定事項">
                        <ul style={{ marginBottom: 0 }}>
                          {meetingInfo.decisions.map((decision, index) => (
                            <li key={index}>
                              <Text strong style={{ color: '#52c41a' }}>
                                {decision}
                              </Text>
                            </li>
                          ))}
                        </ul>
                      </Descriptions.Item>
                      <Descriptions.Item label="懸念点">
                        <ul style={{ marginBottom: 0 }}>
                          {meetingInfo.concerns.map((concern, index) => (
                            <li key={index}>
                              <Text type="warning">{concern}</Text>
                            </li>
                          ))}
                        </ul>
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card title="ネクストアクション" size="small">
                    <ul style={{ marginBottom: 0 }}>
                      {meetingInfo.nextActions.map((action, index) => (
                        <li key={index} style={{ marginBottom: 4 }}>
                          <Text>{action}</Text>
                        </li>
                      ))}
                    </ul>
                  </Card>
                </>
              );
            })()}
          </>
        )}

        {/* 他の活動タイプの場合はシンプルな表示 */}
        {!['call', 'visit', 'meeting'].includes(activity.activityType) && (
          <Card title="活動詳細" size="small">
            <Text>この活動タイプの詳細AI分析は準備中です。</Text>
          </Card>
        )}
      </div>
    </Modal>
  );
};

export default ActivityDetailModal;
