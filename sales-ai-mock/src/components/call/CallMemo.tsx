import React, { useState, useEffect } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Tag,
  Divider,
  Typography,
  App,
} from 'antd';
import {
  SaveOutlined,
  EditOutlined,
  CheckOutlined,
  TagsOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

interface CallMemoProps {
  companyName: string;
  transcription?: string;
  onSave?: (memo: CallMemoData) => void;
}

export interface CallMemoData {
  summary: string;
  nextAction: string;
  tags: string[];
  fullTranscription: string;
  timestamp: string;
}

const CallMemo: React.FC<CallMemoProps> = ({
  companyName,
  transcription,
  onSave,
}) => {
  const { message } = App.useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [showTagInput, setShowTagInput] = useState(false);

  useEffect(() => {
    if (transcription) {
      // AIによる要約の自動生成（シミュレーション）
      const autoSummary = `【商談概要】
・新製品（業務効率化ソリューション）の提案
・在庫管理と生産計画の最適化機能に関心あり
・資料送付を約束
・来週火曜日14:00にデモ実施予定`;

      const autoNextAction = `1. 本日中に製品資料をメール送付
2. デモ用の環境準備
3. 来週火曜日14:00のアポイント登録
4. 業界別カスタマイズ提案の準備`;

      setSummary(autoSummary);
      setNextAction(autoNextAction);
      setTags(['見込み高', 'デモ予定', '製造業', '在庫管理']);
      setIsEditing(true);
    }
  }, [transcription]);

  const handleSave = () => {
    const memoData: CallMemoData = {
      summary,
      nextAction,
      tags,
      fullTranscription: transcription || '',
      timestamp: new Date().toISOString(),
    };

    if (onSave) {
      onSave(memoData);
    }

    message.success('通話メモを保存しました');
    setIsEditing(false);
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
      setShowTagInput(false);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const getTagColor = (tag: string) => {
    if (tag.includes('高') || tag.includes('重要')) return 'red';
    if (tag.includes('デモ') || tag.includes('商談')) return 'orange';
    if (tag.includes('見込み')) return 'green';
    return 'blue';
  };

  return (
    <Card
      title={`${companyName} - 通話メモ`}
      extra={
        <Button
          type={isEditing ? 'primary' : 'default'}
          icon={isEditing ? <SaveOutlined /> : <EditOutlined />}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? '保存' : '編集'}
        </Button>
      }
    >
      <Space direction="vertical" style={{ width: '100%' }} size="middle">
        <div>
          <Text strong>商談概要</Text>
          <TextArea
            value={summary}
            onChange={e => setSummary(e.target.value)}
            disabled={!isEditing}
            rows={4}
            style={{ marginTop: 8 }}
            placeholder="通話の要約を入力..."
          />
        </div>

        <Divider />

        <div>
          <Text strong>次のアクション</Text>
          <TextArea
            value={nextAction}
            onChange={e => setNextAction(e.target.value)}
            disabled={!isEditing}
            rows={4}
            style={{ marginTop: 8 }}
            placeholder="次に行うべきアクションを入力..."
          />
        </div>

        <Divider />

        <div>
          <Space style={{ marginBottom: 8 }}>
            <TagsOutlined />
            <Text strong>タグ</Text>
          </Space>
          <div>
            <Space wrap>
              {tags.map(tag => (
                <Tag
                  key={tag}
                  color={getTagColor(tag)}
                  closable={isEditing}
                  onClose={() => handleRemoveTag(tag)}
                >
                  {tag}
                </Tag>
              ))}
              {isEditing && !showTagInput && (
                <Button
                  size="small"
                  type="dashed"
                  onClick={() => setShowTagInput(true)}
                >
                  + タグ追加
                </Button>
              )}
              {isEditing && showTagInput && (
                <Input
                  size="small"
                  style={{ width: 100 }}
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  onPressEnter={handleAddTag}
                  onBlur={handleAddTag}
                  placeholder="タグ名"
                  autoFocus
                />
              )}
            </Space>
          </div>
        </div>

        {!isEditing && (
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: '#f5f5f5',
              borderRadius: 4,
            }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              最終更新: {new Date().toLocaleString('ja-JP')}
            </Text>
          </div>
        )}
      </Space>
    </Card>
  );
};

export default CallMemo;
