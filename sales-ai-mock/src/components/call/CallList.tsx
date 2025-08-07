import React, { useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Space,
  Input,
  Modal,
  Row,
  Col,
  Card,
  Typography,
  App,
} from 'antd';
import {
  PhoneOutlined,
  SearchOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { CallItem, CallResultType } from '../../types';
import CallResultForm from './CallResultForm';
import ActivityHistory from './ActivityHistory';
import CallPopup from './CallPopup';
import activityData from '../../data/activityHistory.json';
import { handleAppointmentAcquired } from '../../services/visitService';

const { Title } = Typography;

interface CallListProps {
  callList: CallItem[];
  onSelectCompany: (company: CallItem) => void;
  isCompanySelected?: boolean;
}

const CallList: React.FC<CallListProps> = ({ callList, onSelectCompany, isCompanySelected }) => {
  const { message, modal } = App.useApp();
  const [filteredList, setFilteredList] = useState(callList);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallItem | null>(null);
  const [showActivityPanel, setShowActivityPanel] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);
  const [callTarget, setCallTarget] = useState<CallItem | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CallItem | null>(null);

  // 活動履歴から最新のステータスを取得
  const getLatestActivityStatus = (companyId: string) => {
    const companyActivities = activityData.activities
      .filter(activity => activity.companyId === companyId)
      .sort(
        (a, b) =>
          new Date(b.activityDate).getTime() -
          new Date(a.activityDate).getTime()
      );

    if (companyActivities.length === 0) {
      return {
        text: '新規',
        color: 'blue',
        activityType: 'call',
        resultType: '',
      };
    }

    const latestActivity = companyActivities[0];
    return getStatusFromActivity(
      latestActivity.activityType,
      latestActivity.resultType
    );
  };

  // アクティビティタイプと結果からステータスを決定
  const getStatusFromActivity = (activityType: string, resultType?: string) => {
    // 受注完了の場合
    if (activityType === 'order' && resultType === 'order_completed') {
      return { text: '受注', color: '#f5222d', activityType, resultType };
    }

    // 見積フェーズ
    if (activityType === 'estimate') {
      if (resultType === 'estimate_accepted') {
        return { text: '見積承認', color: '#fa8c16', activityType, resultType };
      } else if (resultType === 'estimate_submitted') {
        return { text: '見積提出', color: '#fa8c16', activityType, resultType };
      }
    }

    // 商談フェーズ
    if (activityType === 'meeting') {
      if (resultType === 'meeting_completed') {
        return { text: '商談完了', color: '#722ed1', activityType, resultType };
      } else if (resultType === 'meeting_scheduled') {
        return { text: '商談予定', color: '#722ed1', activityType, resultType };
      }
    }

    // 訪問フェーズ
    if (activityType === 'visit') {
      if (resultType === 'visit_success') {
        return { text: '訪問成功', color: '#52c41a', activityType, resultType };
      } else if (resultType === 'visit_partial') {
        return { text: '部分訪問', color: '#52c41a', activityType, resultType };
      }
    }

    // 架電フェーズ
    if (activityType === 'call') {
      if (resultType === 'アポ獲得') {
        return { text: 'アポ獲得', color: '#1890ff', activityType, resultType };
      } else if (resultType === '通電') {
        return { text: '通電', color: '#1890ff', activityType, resultType };
      } else if (resultType === '架電済') {
        return { text: '架電済', color: '#1890ff', activityType, resultType };
      }
    }

    // デフォルト
    return { text: '新規', color: '#8c8c8c', activityType, resultType };
  };

  const handleSearch = (value: string) => {
    const filtered = callList.filter(
      item =>
        item.companyName.toLowerCase().includes(value.toLowerCase()) ||
        item.contactPerson.toLowerCase().includes(value.toLowerCase()) ||
        item.industry.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const handleCall = (record: CallItem) => {
    // 発信確認画面をスキップして直接録音画面に移行
    setCallTarget(record);
    setShowCallPopup(true);
    // 直接録音画面に移行するため、CallPopupコンポーネントで初期ステップを'recording'に設定
  };

  const handleCallResult = (result: {
    resultType: CallResultType;
    notes: string;
  }) => {
    // 架電結果の保存処理
    console.log('架電結果:', result);
    
    // アポ獲得時の訪問データ自動生成
    if (result.resultType === 'アポ獲得' && selectedCall) {
      const newVisit = handleAppointmentAcquired(selectedCall, result.notes);
      if (newVisit) {
        // B工業の特別メッセージ
        if (selectedCall.companyName.includes('B工業')) {
          message.success(
            '🎯 B工業とのアポが確定しました！訪問予定を明日15:30に自動設定しました。',
            5
          );
        } else {
          message.success(
            `${selectedCall.companyName} との訪問予定を1週間後に自動設定しました！`
          );
        }
        
        // 追加の案内メッセージ
        setTimeout(() => {
          message.info('訪問支援画面で詳細を確認できます。');
        }, 2000);
      } else {
        message.error('訪問予定の自動設定に失敗しました。');
      }
    } else {
      message.success('架電結果を記録しました');
    }
    
    setResultModalVisible(false);
    setSelectedCall(null);
  };

  const handleShowDetail = (record: CallItem) => {
    setSelectedCompany(record);
    setShowActivityPanel(true);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'blue';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<CallItem> = [
    {
      title: '優先度',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority === 'high' ? '高' : priority === 'medium' ? '中' : '低'}
        </Tag>
      ),
      sorter: (a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      },
    },
    {
      title: '企業名',
      dataIndex: 'companyName',
      key: 'companyName',
      render: (text, record) => (
        <a
          onClick={() => onSelectCompany(record)}
          style={{ color: '#1890ff', cursor: 'pointer' }}
        >
          {text}
        </a>
      ),
    },
    {
      title: '担当者',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
    },
    {
      title: '業界',
      dataIndex: 'industry',
      key: 'industry',
      render: (industry: string) => <Tag>{industry}</Tag>,
    },
    {
      title: 'ステータス',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => {
        const status = getLatestActivityStatus(record.id);
        return (
          <Tag
            style={{
              backgroundColor: status.color,
              borderColor: status.color,
              color: 'white',
            }}
          >
            {status.text}
          </Tag>
        );
      },
    },
    {
      title: '最終接触',
      dataIndex: 'lastContactDate',
      key: 'lastContactDate',
      sorter: (a, b) =>
        new Date(a.lastContactDate).getTime() -
        new Date(b.lastContactDate).getTime(),
    },
    {
      title: 'アクション',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<PhoneOutlined />}
            size="small"
            onClick={() => handleCall(record)}
          >
            発信
          </Button>
        </Space>
      ),
    },
  ];

  const sortedList = [...filteredList].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', marginBottom: '0', paddingBottom: '0' }}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="企業名、担当者、業界で検索"
          prefix={<SearchOutlined />}
          onChange={e => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </Space>
      <div style={{ flex: 1, overflow: 'hidden', marginBottom: '0', paddingBottom: '0', height: 'calc(100% - 60px)' }}>
        <Table
          columns={columns}
          dataSource={sortedList}
          rowKey="id"
          pagination={{ 
            pageSize: isCompanySelected ? 3 : 15,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}件`,
            showPrevNextJumpers: true,
            position: ['bottomCenter'],
            size: 'default'
          }}
          size="middle"
          scroll={{ y: isCompanySelected ? 'calc(45vh - 180px)' : 'calc(100vh - 300px)' }}
          style={{ height: '100%', marginBottom: '0' }}
        />
      </div>

      {/* 架電結果入力モーダル */}
      <Modal
        title="架電結果入力"
        open={resultModalVisible}
        onCancel={() => {
          setResultModalVisible(false);
          setSelectedCall(null);
        }}
        footer={null}
        width={600}
      >
        {selectedCall && (
          <CallResultForm
            callId={selectedCall.id}
            onSubmit={handleCallResult}
            onCancel={() => {
              setResultModalVisible(false);
              setSelectedCall(null);
            }}
          />
        )}
      </Modal>

      {callTarget && (
        <CallPopup
          visible={showCallPopup}
          onClose={() => {
            setShowCallPopup(false);
            setCallTarget(null);
          }}
          companyData={{
            id: callTarget.id,
            companyName: callTarget.companyName,
            contactPerson: callTarget.contactPerson,
            phoneNumber: callTarget.phoneNumber,
            industry: callTarget.industry
          }}
        />
      )}
    </div>
  );
};

export default CallList;
