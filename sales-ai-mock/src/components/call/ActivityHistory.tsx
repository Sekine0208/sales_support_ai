import React, { useState } from 'react';
import {
  Card,
  Tag,
  Typography,
  Button,
  Empty,
  Select,
  Input,
  Space,
  DatePicker,
  Table,
  Divider,
  Badge,
  Modal,
  App,
} from 'antd';
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  PhoneOutlined,
  TeamOutlined,
  MailOutlined,
  FileTextOutlined,
  LaptopOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import type { ActivityType, ActivityStatus } from '../../types';
import activityData from '../../data/activityHistory.json';
import dayjs from 'dayjs';
import ActivityDetailModal from './ActivityDetailModal';

const { Text, Title } = Typography;
const { TextArea } = Input;

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
  status: ActivityStatus;
  resultType?: string;
  amount?: number;
}

interface ActivityHistoryProps {
  companyId?: string;
  contactId?: string;
  limit?: number;
}

interface EditingCell {
  rowIndex: number;
  dataIndex: string;
  value: any;
}

const ActivityHistory: React.FC<ActivityHistoryProps> = ({
  companyId,
  contactId,
  limit = 50,
}) => {
  const { message } = App.useApp();
  const [activities, setActivities] = useState<ActivityItem[]>(
    activityData.activities as ActivityItem[]
  );
  const [editingItem, setEditingItem] = useState<{
    id: string;
    field: string;
    value: any;
  } | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityItem | null>(
    null
  );

  // 統一色パレット - 5フェーズの基本色
  const colorPalette = {
    call: '#1890ff', // 青 - 架電フェーズ
    visit: '#52c41a', // 緑 - 訪問フェーズ
    meeting: '#722ed1', // 紫 - 商談フェーズ
    estimate: '#fa8c16', // オレンジ - 見積りフェーズ
    order: '#f5222d', // 赤 - 受注フェーズ
    default: '#8c8c8c', // グレー - デフォルト
  };

  // フェーズに応じた基本色を取得
  const getPhaseColor = (activityType: ActivityType) => {
    switch (activityType) {
      case 'call':
        return colorPalette.call;
      case 'visit':
        return colorPalette.visit;
      case 'meeting':
        return colorPalette.meeting;
      case 'estimate':
        return colorPalette.estimate;
      case 'order':
        return colorPalette.order;
      default:
        return colorPalette.default;
    }
  };

  // 結果に応じた色の濃淡を取得
  const getResultColorVariation = (
    activityType: ActivityType,
    resultType?: string
  ) => {
    const baseColor = getPhaseColor(activityType);

    if (!resultType) return baseColor;

    // 成功系 - 基本色そのまま（濃い）
    if (
      [
        'アポ獲得',
        'visit_success',
        'meeting_completed',
        'estimate_accepted',
        'order_completed',
        '通電',
      ].includes(resultType)
    ) {
      return baseColor;
    }

    // 処理中・進行中系 - 少し薄く
    if (
      [
        'estimate_submitted',
        'meeting_scheduled',
        'order_processing',
        '架電済',
      ].includes(resultType)
    ) {
      return baseColor + 'CC'; // 80%透明度
    }

    // 警告・部分成功系 - 中間の濃さ
    if (
      [
        'visit_partial',
        'visit_reschedule',
        'meeting_postponed',
        '不在',
      ].includes(resultType)
    ) {
      return baseColor + 'AA'; // 66%透明度
    }

    // 失敗・拒否系 - 薄く
    if (
      [
        '拒否',
        'visit_failed',
        'meeting_cancelled',
        'estimate_rejected',
        'order_cancelled',
      ].includes(resultType)
    ) {
      return baseColor + '66'; // 40%透明度
    }

    return baseColor;
  };

  // アクティビティタイプに応じたアイコンを返す
  const getActivityIcon = (
    type: ActivityType,
    size: 'small' | 'medium' | 'large' = 'medium'
  ) => {
    const sizeMap = { small: 14, medium: 18, large: 24 };
    const iconSize = sizeMap[size];
    const color = getPhaseColor(type);

    switch (type) {
      case 'call':
        return <PhoneOutlined style={{ color, fontSize: iconSize }} />;
      case 'visit':
        return <TeamOutlined style={{ color, fontSize: iconSize }} />;
      case 'meeting':
        return <LaptopOutlined style={{ color, fontSize: iconSize }} />;
      case 'estimate':
        return <FileTextOutlined style={{ color, fontSize: iconSize }} />;
      case 'order':
        return <CheckOutlined style={{ color, fontSize: iconSize }} />;
      default:
        return null;
    }
  };

  // アクティビティタイプの日本語表示
  const getActivityTypeLabel = (type: ActivityType) => {
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

  // 結果タイプの日本語表示
  const getResultTypeLabel = (resultType?: string) => {
    if (!resultType) return '';
    switch (resultType) {
      // 訪問フェーズ
      case 'visit_success':
        return '訪問成功';
      case 'visit_partial':
        return '部分訪問';
      case 'visit_failed':
        return '訪問失敗';
      case 'visit_reschedule':
        return '訪問再調整';
      // 商談フェーズ
      case 'meeting_scheduled':
        return '商談設定';
      case 'meeting_completed':
        return '商談完了';
      case 'meeting_postponed':
        return '商談延期';
      case 'meeting_cancelled':
        return '商談中止';
      // 見積りフェーズ
      case 'estimate_submitted':
        return '見積提出';
      case 'estimate_accepted':
        return '見積承認';
      case 'estimate_rejected':
        return '見積拒否';
      // 受注フェーズ
      case 'order_completed':
        return '受注完了';
      case 'order_processing':
        return '受注処理中';
      case 'order_cancelled':
        return '受注キャンセル';
      default:
        return resultType; // 既に日本語の場合はそのまま
    }
  };

  // フィルタリング
  let filteredActivities = activities;
  if (companyId) {
    filteredActivities = filteredActivities.filter(
      a => a.companyId === companyId
    );
  }
  if (contactId) {
    filteredActivities = filteredActivities.filter(
      a => a.contactId === contactId
    );
  }

  // 最新の活動から表示
  const sortedActivities = filteredActivities
    .slice(0, limit)
    .sort(
      (a, b) =>
        new Date(b.activityDate).getTime() - new Date(a.activityDate).getTime()
    );

  // 編集開始
  const startEdit = (itemId: string, field: string, value: any) => {
    setEditingItem({ id: itemId, field, value });
  };

  // 編集保存
  const saveEdit = () => {
    if (!editingItem) return;

    const newActivities = [...activities];
    const activityIndex = activities.findIndex(a => a.id === editingItem.id);

    if (activityIndex !== -1) {
      (newActivities[activityIndex] as any)[editingItem.field] =
        editingItem.value;
      setActivities(newActivities);
      message.success('保存しました');
    }
    setEditingItem(null);
  };

  // 編集キャンセル
  const cancelEdit = () => {
    setEditingItem(null);
  };

  // 詳細表示ハンドラー
  const handleShowDetail = (activity: ActivityItem) => {
    setSelectedActivity(activity);
    setDetailModalVisible(true);
  };

  // 詳細モーダルを閉じる
  const handleCloseDetail = () => {
    setDetailModalVisible(false);
    setSelectedActivity(null);
  };

  // 編集可能フィールドの描画
  const renderEditableField = (
    item: ActivityItem,
    field: string,
    value: any,
    type: 'input' | 'textarea' | 'select' | 'date' = 'input'
  ) => {
    const isEditing =
      editingItem?.id === item.id && editingItem?.field === field;

    if (isEditing) {
      if (type === 'select') {
        return (
          <Select
            value={editingItem.value}
            onChange={value => setEditingItem({ ...editingItem, value })}
            style={{ width: '100%' }}
            size="small"
            options={[
              // 架電フェーズ
              { value: '架電済', label: '架電済' },
              { value: '通電', label: '通電' },
              { value: 'アポ獲得', label: 'アポ獲得' },
              { value: '不在', label: '不在' },
              { value: '拒否', label: '拒否' },
              { value: 'その他', label: 'その他' },
              // 訪問フェーズ
              { value: 'visit_success', label: '訪問成功' },
              { value: 'visit_partial', label: '部分訪問' },
              { value: 'visit_failed', label: '訪問失敗' },
              { value: 'visit_reschedule', label: '訪問再調整' },
              // 商談フェーズ
              { value: 'meeting_scheduled', label: '商談設定' },
              { value: 'meeting_completed', label: '商談完了' },
              { value: 'meeting_postponed', label: '商談延期' },
              { value: 'meeting_cancelled', label: '商談中止' },
              // 見積りフェーズ
              { value: 'estimate_submitted', label: '見積提出' },
              { value: 'estimate_accepted', label: '見積承認' },
              { value: 'estimate_rejected', label: '見積拒否' },
              // 受注フェーズ
              { value: 'order_completed', label: '受注完了' },
              { value: 'order_processing', label: '受注処理中' },
              { value: 'order_cancelled', label: '受注キャンセル' },
            ]}
          />
        );
      } else if (type === 'textarea') {
        return (
          <TextArea
            value={editingItem.value}
            onChange={e =>
              setEditingItem({ ...editingItem, value: e.target.value })
            }
            rows={2}
            autoSize={{ minRows: 1, maxRows: 3 }}
            size="small"
          />
        );
      } else if (type === 'date') {
        return (
          <DatePicker
            value={editingItem.value ? dayjs(editingItem.value) : null}
            onChange={date =>
              setEditingItem({ ...editingItem, value: date?.toISOString() })
            }
            showTime
            style={{ width: '100%' }}
            size="small"
          />
        );
      } else {
        return (
          <Input
            value={editingItem.value}
            onChange={e =>
              setEditingItem({ ...editingItem, value: e.target.value })
            }
            size="small"
          />
        );
      }
    }

    return (
      <span
        onClick={() => startEdit(item.id, field, value)}
        style={{
          cursor: 'pointer',
          borderBottom: '1px dashed #d9d9d9',
          paddingBottom: 1,
        }}
      >
        {value || '-'}
      </span>
    );
  };

  // テーブル用のデータを準備
  const tableData = sortedActivities.map((item, index) => ({
    key: item.id,
    ...item,
    index,
  }));

  // テーブルカラム定義
  const columns = [
    {
      title: '日時',
      dataIndex: 'activityDate',
      key: 'activityDate',
      width: 120,
      render: (date: string, record: ActivityItem) => {
        const formattedDate = new Date(date).toLocaleDateString('ja-JP', {
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        });
        return renderEditableField(record, 'activityDate', formattedDate, 'date');
      },
    },
    {
      title: '種別',
      dataIndex: 'activityType',
      key: 'activityType',
      width: 80,
      render: (type: ActivityType, record: ActivityItem) => (
        <Space>
          {getActivityIcon(type, 'small')}
          <Text style={{ fontSize: '12px' }}>
            {getActivityTypeLabel(type)}
          </Text>
        </Space>
      ),
    },
    {
      title: '結果',
      dataIndex: 'resultType',
      key: 'resultType',
      width: 120,
      render: (resultType: string, record: ActivityItem) => {
        if (!resultType) return '-';
        return (
          <Tag
            style={{
              backgroundColor: getResultColorVariation(
                record.activityType,
                resultType
              ),
              borderColor: getResultColorVariation(
                record.activityType,
                resultType
              ),
              color: 'white',
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '4px',
            }}
          >
            {renderEditableField(
              record,
              'resultType',
              getResultTypeLabel(resultType),
              'select'
            )}
          </Tag>
        );
      },
    },
    {
      title: '概要',
      dataIndex: 'summary',
      key: 'summary',
      width: 200,
      render: (summary: string, record: ActivityItem) => (
        <Text style={{ fontSize: '12px' }}>
          {renderEditableField(record, 'summary', summary)}
        </Text>
      ),
    },
    {
      title: '詳細',
      dataIndex: 'details',
      key: 'details',
      width: 250,
      render: (details: string, record: ActivityItem) => (
        <Text style={{ fontSize: '11px', color: '#666' }}>
          {renderEditableField(record, 'details', details, 'textarea')}
        </Text>
      ),
    },
    {
      title: '金額',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount: number, record: ActivityItem) => {
        if (!amount) return '-';
        return (
          <Text strong style={{ fontSize: '12px', color: '#52c41a' }}>
            {renderEditableField(
              record,
              'amount',
              `¥${amount.toLocaleString()}`
            )}
          </Text>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 80,
      render: (_: any, record: ActivityItem) => (
        <Button
          size="small"
          icon={<InfoCircleOutlined />}
          onClick={() => handleShowDetail(record)}
          style={{
            fontSize: '11px',
            backgroundColor: '#f0f0f0',
            borderColor: '#d9d9d9',
            color: '#595959',
            borderRadius: '4px',
          }}
        >
          詳細
        </Button>
      ),
    },
  ];

  if (sortedActivities.length === 0) {
    return (
      <Empty description="活動履歴がありません" style={{ padding: '40px 0' }} />
    );
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {editingItem && (
        <Card
          size="small"
          style={{ marginBottom: 16, backgroundColor: '#f6ffed', flexShrink: 0 }}
        >
          <Space>
            <Button
              type="primary"
              icon={<CheckOutlined />}
              size="small"
              onClick={saveEdit}
            >
              保存
            </Button>
            <Button icon={<CloseOutlined />} size="small" onClick={cancelEdit}>
              キャンセル
            </Button>
            <Text type="secondary" style={{ fontSize: 12 }}>
              編集中...
            </Text>
          </Space>
        </Card>
      )}

      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <Table
          columns={columns}
          dataSource={tableData}
          pagination={false}
          size="small"
          bordered
          scroll={{ x: 800, y: 250 }}
          style={{ fontSize: '12px', height: '100%' }}
        />
      </div>

      <div style={{ marginTop: 16, textAlign: 'center', flexShrink: 0 }}>
        <Text type="secondary" style={{ fontSize: 12 }}>
          {filteredActivities.length}件の活動履歴 | 項目をクリックして編集
        </Text>
      </div>

      {/* 活動詳細モーダル */}
      <ActivityDetailModal
        visible={detailModalVisible}
        activity={selectedActivity}
        onClose={handleCloseDetail}
      />
    </div>
  );
};

export default ActivityHistory;
