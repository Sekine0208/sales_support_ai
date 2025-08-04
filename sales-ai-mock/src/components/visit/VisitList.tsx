import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Button,
  Space,
  DatePicker,
  Select,
  Card,
  Statistic,
  Row,
  Col,
} from 'antd';
import {
  EnvironmentOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SyncOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { VisitListItem, VisitStatus } from '../../types';
import visitData from '../../data/visitData.json';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface VisitListProps {
  visitList?: VisitListItem[];
  onSelectVisit?: (visit: VisitListItem) => void;
  onSelectCompany?: (companyName: string) => void;
  onCreateNegotiation?: (visitId: string) => void;
}

const VisitList: React.FC<VisitListProps> = ({
  visitList,
  onSelectVisit,
  onSelectCompany,
  onCreateNegotiation,
}) => {
  const initialData = visitList || (visitData.visits as VisitListItem[]);
  const [filteredData, setFilteredData] = useState<VisitListItem[]>(initialData);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null]
  >([null, null]);
  const [statusFilter, setStatusFilter] = useState<VisitStatus | 'all'>('all');

  // visitListプロップが変更された時にフィルタリングデータを更新
  useEffect(() => {
    const newData = visitList || (visitData.visits as VisitListItem[]);
    setFilteredData(newData as VisitListItem[]);
  }, [visitList]);

  // ステータスに応じた色を返す
  const getStatusColor = (status: VisitStatus) => {
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

  // ステータスに応じたアイコンを返す
  const getStatusIcon = (status: VisitStatus) => {
    switch (status) {
      case 'scheduled':
        return <CalendarOutlined />;
      case 'completed':
        return <CheckCircleOutlined />;
      case 'cancelled':
        return <CloseCircleOutlined />;
      case 'rescheduled':
        return <SyncOutlined />;
      default:
        return null;
    }
  };

  // ステータスの日本語表示
  const getStatusText = (status: VisitStatus) => {
    switch (status) {
      case 'scheduled':
        return '予定';
      case 'completed':
        return '完了';
      case 'cancelled':
        return 'キャンセル';
      case 'rescheduled':
        return '再調整';
      default:
        return status;
    }
  };

  // フィルタリング処理
  const handleFilter = () => {
    let filtered = [...visitData.visits];

    // ステータスフィルター
    if (statusFilter !== 'all') {
      filtered = filtered.filter(visit => visit.visitStatus === statusFilter);
    }

    // 日付範囲フィルター
    if (dateRange[0] && dateRange[1]) {
      filtered = filtered.filter(visit => {
        const visitDate = dayjs(visit.scheduledDate);
        return (
          visitDate.isAfter(dateRange[0]!) &&
          visitDate.isBefore(dateRange[1]!.add(1, 'day'))
        );
      });
    }

    setFilteredData(filtered as VisitListItem[]);
  };

  // 日付フォーマット
  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('YYYY/MM/DD HH:mm');
  };

  const columns: ColumnsType<VisitListItem> = [
    {
      title: '訪問日時',
      dataIndex: 'scheduledDate',
      key: 'scheduledDate',
      render: (date: string) => formatDate(date),
      sorter: (a, b) =>
        new Date(a.scheduledDate).getTime() -
        new Date(b.scheduledDate).getTime(),
      defaultSortOrder: 'ascend',
    },
    {
      title: '企業名',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text, record) => (
        <a 
          onClick={() => onSelectCompany?.(text)}
          style={{ color: '#1890ff', cursor: 'pointer' }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '担当者',
      dataIndex: 'contactName',
      key: 'contactName',
    },
    {
      title: '目的',
      dataIndex: 'purpose',
      key: 'purpose',
      ellipsis: true,
    },
    {
      title: '場所',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => (
        <Space>
          <EnvironmentOutlined />
          {location}
        </Space>
      ),
    },
    {
      title: 'ステータス',
      dataIndex: 'visitStatus',
      key: 'visitStatus',
      render: (status: VisitStatus) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'アクション',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.visitStatus === 'scheduled' && (
            <Button size="small" onClick={() => onSelectVisit?.(record)}>
              詳細
            </Button>
          )}
          {record.visitStatus === 'completed' && !record.hasNegotiation && (
            <Button
              type="primary"
              size="small"
              onClick={() => onCreateNegotiation?.(record.id)}
            >
              商談設定
            </Button>
          )}
          {record.hasNegotiation && <Tag color="success">商談済</Tag>}
        </Space>
      ),
    },
  ];

  return (
    <div>
      {/* サマリーカード */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今週の訪問予定"
              value={visitData.summary.thisWeek}
              suffix="件"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="予定"
              value={visitData.summary.byStatus.scheduled}
              suffix="件"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="完了"
              value={visitData.summary.byStatus.completed}
              suffix="件"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="キャンセル"
              value={visitData.summary.byStatus.cancelled}
              suffix="件"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* フィルター */}
      <Space style={{ marginBottom: 16 }}>
        <RangePicker
          onChange={dates =>
            setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])
          }
          placeholder={['開始日', '終了日']}
        />
        <Select
          style={{ width: 150 }}
          value={statusFilter}
          onChange={setStatusFilter}
          placeholder="ステータス"
        >
          <Option value="all">すべて</Option>
          <Option value="scheduled">予定</Option>
          <Option value="completed">完了</Option>
          <Option value="cancelled">キャンセル</Option>
          <Option value="rescheduled">再調整</Option>
        </Select>
        <Button type="primary" onClick={handleFilter}>
          フィルター適用
        </Button>
      </Space>

      {/* テーブル */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={{ pageSize: 20 }}
        size="middle"
      />
    </div>
  );
};

export default VisitList;
