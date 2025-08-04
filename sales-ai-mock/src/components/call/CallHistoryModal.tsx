import React from 'react';
import { Modal, List, Tag, Space, Typography, Collapse, Empty } from 'antd';
import {
  ClockCircleOutlined,
  PhoneOutlined,
  TagsOutlined,
} from '@ant-design/icons';
import type { CallMemoData } from './CallMemo';

const { Text, Paragraph } = Typography;
const { Panel } = Collapse;

interface CallHistoryItem extends CallMemoData {
  id: string;
  duration: string;
  date: string;
}

interface CallHistoryModalProps {
  visible: boolean;
  companyName: string;
  history: CallHistoryItem[];
  onClose: () => void;
}

const CallHistoryModal: React.FC<CallHistoryModalProps> = ({
  visible,
  companyName,
  history,
  onClose,
}) => {
  const mockHistory: CallHistoryItem[] =
    history.length > 0
      ? history
      : [
          {
            id: '1',
            date: '2025-01-15 14:30',
            duration: '15:23',
            summary:
              '初回商談。製品概要説明と課題ヒアリング。在庫管理の効率化に強い関心。',
            nextAction: '詳細資料の送付、次回アポイント調整',
            tags: ['初回商談', '在庫管理', '関心高'],
            fullTranscription: '...',
            timestamp: '2025-01-15T14:30:00',
          },
          {
            id: '2',
            date: '2025-01-08 10:00',
            duration: '08:45',
            summary:
              '製品デモ実施。実際の操作感を確認。導入時期と予算について相談。',
            nextAction: '見積書作成、決裁者との面談設定',
            tags: ['デモ実施', '予算相談', '前向き'],
            fullTranscription: '...',
            timestamp: '2025-01-08T10:00:00',
          },
          {
            id: '3',
            date: '2024-12-20 16:15',
            duration: '05:12',
            summary: 'フォローアップ。年末の挨拶と来期予算の確認。',
            nextAction: '1月に再度連絡',
            tags: ['フォローアップ', '予算確認'],
            fullTranscription: '...',
            timestamp: '2024-12-20T16:15:00',
          },
        ];

  const displayHistory = history.length > 0 ? history : mockHistory;

  const getTagColor = (tag: string) => {
    if (tag.includes('高') || tag.includes('重要')) return 'red';
    if (tag.includes('デモ') || tag.includes('商談')) return 'orange';
    if (tag.includes('見込み') || tag.includes('前向き')) return 'green';
    return 'blue';
  };

  return (
    <Modal
      title={`${companyName} - 通話履歴`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      {displayHistory.length > 0 ? (
        <List
          dataSource={displayHistory}
          renderItem={item => (
            <List.Item key={item.id}>
              <Collapse style={{ width: '100%' }}>
                <Panel
                  header={
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <Space>
                        <ClockCircleOutlined />
                        <Text strong>{item.date}</Text>
                        <Text type="secondary">通話時間: {item.duration}</Text>
                      </Space>
                      <Paragraph ellipsis={{ rows: 2 }} style={{ margin: 0 }}>
                        {item.summary}
                      </Paragraph>
                      <Space wrap>
                        <TagsOutlined />
                        {item.tags.map(tag => (
                          <Tag
                            key={tag}
                            color={getTagColor(tag)}
                            style={{ marginRight: 0 }}
                          >
                            {tag}
                          </Tag>
                        ))}
                      </Space>
                    </Space>
                  }
                  key={item.id}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <div>
                      <Text strong>商談概要:</Text>
                      <Paragraph style={{ marginTop: 8 }}>
                        {item.summary}
                      </Paragraph>
                    </div>
                    <div>
                      <Text strong>次のアクション:</Text>
                      <Paragraph style={{ marginTop: 8 }}>
                        {item.nextAction}
                      </Paragraph>
                    </div>
                    {item.fullTranscription && (
                      <div>
                        <Text strong>文字起こし全文:</Text>
                        <Paragraph
                          style={{
                            marginTop: 8,
                            maxHeight: 200,
                            overflow: 'auto',
                            border: '1px solid #f0f0f0',
                            padding: 8,
                            borderRadius: 4,
                            fontSize: 12,
                            whiteSpace: 'pre-wrap',
                          }}
                        >
                          {item.fullTranscription}
                        </Paragraph>
                      </div>
                    )}
                  </Space>
                </Panel>
              </Collapse>
            </List.Item>
          )}
        />
      ) : (
        <Empty description="通話履歴がありません" />
      )}
    </Modal>
  );
};

export default CallHistoryModal;
