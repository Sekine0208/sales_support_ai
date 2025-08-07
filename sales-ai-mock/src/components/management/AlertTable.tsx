import React, { useMemo, useState } from 'react';
import { Table, Tag, Progress, Tooltip, Button, message, Spin } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { AlertOutlined, ExclamationCircleOutlined, BulbOutlined } from '@ant-design/icons';
import type {
  FilterCondition,
  Department,
  SalesUser,
} from '../../types/analytics';

interface AlertData {
  key: string;
  userId: string;
  userName: string;
  departmentName: string;
  alertLevel: 'high' | 'medium' | 'low';
  problemStages: string[];
  transitionRates: {
    callToConnect: number;
    connectToAppointment: number;
    appointmentToVisit: number;
    visitToNegotiation: number;
    negotiationToOrder: number;
  };
  averageRates: {
    callToConnect: number;
    connectToAppointment: number;
    appointmentToVisit: number;
    visitToNegotiation: number;
    negotiationToOrder: number;
  };
  hypothesis?: string; // 仮説フィールドを追加
}

interface AlertTableProps {
  filters: FilterCondition;
  departments: Department[];
  users: SalesUser[];
}

const AlertTable: React.FC<AlertTableProps> = ({
  filters,
  departments,
  users,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [alertData, setAlertData] = useState<AlertData[]>([]);

  // モックデータでアラート対象者を生成
  const generateAlertData = (): AlertData[] => {
    return users.slice(0, 5).map((user, index) => {
      const department = departments.find(d => d.id === user.departmentId);
      
      // ランダムに問題のある段階を設定
      const problemStages = [];
      const transitionRates = {
        callToConnect: Math.floor(Math.random() * 30) + 20, // 20-50%
        connectToAppointment: Math.floor(Math.random() * 25) + 15, // 15-40%
        appointmentToVisit: Math.floor(Math.random() * 20) + 10, // 10-30%
        visitToNegotiation: Math.floor(Math.random() * 15) + 5, // 5-20%
        negotiationToOrder: Math.floor(Math.random() * 10) + 2, // 2-12%
      };
      
      const averageRates = {
        callToConnect: 65,
        connectToAppointment: 45,
        appointmentToVisit: 35,
        visitToNegotiation: 25,
        negotiationToOrder: 15,
      };

      // 問題のある段階を特定
      if (transitionRates.callToConnect < averageRates.callToConnect * 0.8) {
        problemStages.push('架電→通電');
      }
      if (transitionRates.connectToAppointment < averageRates.connectToAppointment * 0.8) {
        problemStages.push('通電→アポ');
      }
      if (transitionRates.appointmentToVisit < averageRates.appointmentToVisit * 0.8) {
        problemStages.push('アポ→訪問');
      }
      if (transitionRates.visitToNegotiation < averageRates.visitToNegotiation * 0.8) {
        problemStages.push('訪問→商談');
      }
      if (transitionRates.negotiationToOrder < averageRates.negotiationToOrder * 0.8) {
        problemStages.push('商談→受注');
      }

      // アラートレベルを設定
      let alertLevel: 'high' | 'medium' | 'low' = 'low';
      if (problemStages.length >= 3) {
        alertLevel = 'high';
      } else if (problemStages.length >= 2) {
        alertLevel = 'medium';
      }

      return {
        key: user.id,
        userId: user.id,
        userName: user.name,
        departmentName: department?.name || '',
        alertLevel,
        problemStages,
        transitionRates,
        averageRates,
      };
    }).filter(data => data.problemStages.length > 0); // 問題のある担当者のみ表示
  };

  // 初期データを設定
  useMemo(() => {
    setAlertData(generateAlertData());
  }, [users, departments]);

  const handleGenerateHypothesis = async () => {
    setIsGenerating(true);
    
    // シミュレートされたAI分析（実際の実装では外部AI APIを呼び出し）
    setTimeout(() => {
      const updatedData = alertData.map(data => {
        // 問題箇所に基づいて仮説を生成
        let hypothesis = '';
        
        if (data.problemStages.includes('架電→通電')) {
          hypothesis += '• 時間帯の問題: 夕方の架電で通電率が低い\n';
        }
        if (data.problemStages.includes('通電→アポ')) {
          hypothesis += '• アプローチ方法: 商品説明が長すぎる\n';
        }
        if (data.problemStages.includes('アポ→訪問')) {
          hypothesis += '• 顧客層のミスマッチ: 中小企業向けアプローチで大企業に接触\n';
        }
        if (data.problemStages.includes('訪問→商談')) {
          hypothesis += '• 提案内容: 顧客のニーズに合わない提案\n';
        }
        if (data.problemStages.includes('商談→受注')) {
          hypothesis += '• クロージング技術: 決断を促す技術が不足\n';
        }
        
        if (!hypothesis) {
          hypothesis = '• 定性的データの分析が必要です';
        }
        
        return {
          ...data,
          hypothesis: hypothesis.trim()
        };
      });
      
      setAlertData(updatedData);
      setIsGenerating(false);
      message.success('AI仮説生成が完了しました');
    }, 3000);
  };

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case 'high': return '#f5222d';
      case 'medium': return '#faad14';
      case 'low': return '#52c41a';
      default: return '#d9d9d9';
    }
  };

  const getAlertLevelText = (level: string) => {
    switch (level) {
      case 'high': return '高';
      case 'medium': return '中';
      case 'low': return '低';
      default: return 'なし';
    }
  };

  const columns: ColumnsType<AlertData> = [
    {
      title: 'アラートレベル',
      dataIndex: 'alertLevel',
      key: 'alertLevel',
      width: 100,
      render: (level: string) => (
        <Tag color={getAlertLevelColor(level)}>
          <ExclamationCircleOutlined style={{ marginRight: 4 }} />
          {getAlertLevelText(level)}
        </Tag>
      ),
    },
    {
      title: '担当者名',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
      render: (text: string, record: AlertData) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.departmentName}
          </div>
        </div>
      ),
    },
    {
      title: '問題箇所',
      dataIndex: 'problemStages',
      key: 'problemStages',
      width: 200,
      render: (stages: string[]) => (
        <div>
          {stages.map((stage, index) => (
            <Tag key={index} color="red" style={{ marginBottom: 4 }}>
              {stage}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: '架電→通電',
      key: 'callToConnect',
      width: 120,
      render: (_, record: AlertData) => {
        const rate = record.transitionRates.callToConnect;
        const average = record.averageRates.callToConnect;
        const isProblem = rate < average * 0.8;
        
        return (
          <div>
            <div style={{ fontWeight: isProblem ? 'bold' : 'normal' }}>
              {rate}% / {average}%
            </div>
            <Progress 
              percent={rate} 
              size="small" 
              strokeColor={isProblem ? '#f5222d' : '#52c41a'}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: '通電→アポ',
      key: 'connectToAppointment',
      width: 120,
      render: (_, record: AlertData) => {
        const rate = record.transitionRates.connectToAppointment;
        const average = record.averageRates.connectToAppointment;
        const isProblem = rate < average * 0.8;
        
        return (
          <div>
            <div style={{ fontWeight: isProblem ? 'bold' : 'normal' }}>
              {rate}% / {average}%
            </div>
            <Progress 
              percent={rate} 
              size="small" 
              strokeColor={isProblem ? '#f5222d' : '#52c41a'}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: 'アポ→訪問',
      key: 'appointmentToVisit',
      width: 120,
      render: (_, record: AlertData) => {
        const rate = record.transitionRates.appointmentToVisit;
        const average = record.averageRates.appointmentToVisit;
        const isProblem = rate < average * 0.8;
        
        return (
          <div>
            <div style={{ fontWeight: isProblem ? 'bold' : 'normal' }}>
              {rate}% / {average}%
            </div>
            <Progress 
              percent={rate} 
              size="small" 
              strokeColor={isProblem ? '#f5222d' : '#52c41a'}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: '訪問→商談',
      key: 'visitToNegotiation',
      width: 120,
      render: (_, record: AlertData) => {
        const rate = record.transitionRates.visitToNegotiation;
        const average = record.averageRates.visitToNegotiation;
        const isProblem = rate < average * 0.8;
        
        return (
          <div>
            <div style={{ fontWeight: isProblem ? 'bold' : 'normal' }}>
              {rate}% / {average}%
            </div>
            <Progress 
              percent={rate} 
              size="small" 
              strokeColor={isProblem ? '#f5222d' : '#52c41a'}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: '商談→受注',
      key: 'negotiationToOrder',
      width: 120,
      render: (_, record: AlertData) => {
        const rate = record.transitionRates.negotiationToOrder;
        const average = record.averageRates.negotiationToOrder;
        const isProblem = rate < average * 0.8;
        
        return (
          <div>
            <div style={{ fontWeight: isProblem ? 'bold' : 'normal' }}>
              {rate}% / {average}%
            </div>
            <Progress 
              percent={rate} 
              size="small" 
              strokeColor={isProblem ? '#f5222d' : '#52c41a'}
              showInfo={false}
            />
          </div>
        );
      },
    },
    {
      title: '仮説',
      key: 'hypothesis',
      width: 300,
      render: (_, record: AlertData) => {
        if (isGenerating) {
          return (
            <div style={{ textAlign: 'center' }}>
              <Spin size="small" />
              <div style={{ fontSize: '12px', marginTop: 4 }}>生成中...</div>
            </div>
          );
        }
        
        if (!record.hypothesis) {
          return (
            <div style={{ color: '#999', fontSize: '12px' }}>
              仮説未生成
            </div>
          );
        }
        
        return (
          <div style={{ 
            fontSize: '12px', 
            lineHeight: '1.4',
            whiteSpace: 'pre-line',
            maxHeight: '100px',
            overflow: 'auto'
          }}>
            {record.hypothesis}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button 
          type="primary" 
          icon={<BulbOutlined />}
          onClick={handleGenerateHypothesis}
          loading={isGenerating}
          disabled={alertData.length === 0}
        >
          AI仮説生成
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={alertData}
        scroll={{ x: 1500, y: 400 }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} of ${total} items`,
        }}
        bordered
        size="small"
      />
    </div>
  );
};

export default AlertTable; 