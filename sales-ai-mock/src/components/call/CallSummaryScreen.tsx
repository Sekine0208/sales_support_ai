import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Form, 
  Input, 
  Select, 
  DatePicker, 
  message,
  Spin,
  Divider,
  Tag
} from 'antd';
import { 
  CheckOutlined, 
  EditOutlined, 
  SaveOutlined, 
  CloseOutlined,
  RobotOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface CallSummaryScreenProps {
  companyData: {
    companyName: string;
    contactPerson: string;
    phoneNumber: string;
    industry?: string;
  };
  transcript: string;
  callDuration: number;
  onComplete: () => void;
  onCancel: () => void;
}

interface BANTCData {
  budget: string;
  authority: string;
  needs: string;
  timeline: string;
  challenges: string;
}

interface CallResult {
  connected: boolean;
  resultType: 'appointment' | 'follow_up' | 'not_interested' | 'no_answer' | 'callback';
  appointmentDate?: string;
  nextAction?: string;
  notes: string;
}

const CallSummaryScreen: React.FC<CallSummaryScreenProps> = ({
  companyData,
  transcript,
  callDuration,
  onComplete,
  onCancel,
}) => {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState('');
  const [bantcData, setBantcData] = useState<BANTCData>({
    budget: '',
    authority: '',
    needs: '',
    timeline: '',
    challenges: ''
  });
  const [callResult, setCallResult] = useState<CallResult>({
    connected: true,
    resultType: 'appointment',
    notes: ''
  });
  const [form] = Form.useForm();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}分${secs}秒`;
  };

  // AIによる自動分析（デモ用）
  useEffect(() => {
    const analyzeCall = async () => {
      setLoading(true);
      
      // AIが分析している演出
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // デモデータを設定
      const generatedSummary = `本日は${companyData.companyName}の${companyData.contactPerson}様とAI営業支援システムについてお話ししました。

【会話の要点】
・現在の営業活動における課題として効率化が必要
・予算規模は年間500万円程度を確保済み
・ROIが明確であれば導入を検討される意向
・決定権は担当者様と役員の承認が必要
・来月中の決定を希望
・来週火曜日午後にアポイントメント獲得

【顧客の反応】
・システムに対して前向きな関心を示された
・具体的な予算と決定プロセスを開示いただけた
・次回の面談に積極的`;

      const generatedBANTC: BANTCData = {
        budget: '年間500万円程度（確保済み）',
        authority: '担当者+役員承認が必要',
        needs: '営業活動の効率化、ROIの明確化',
        timeline: '来月中に決定予定',
        challenges: '現在の営業プロセスの非効率性'
      };

      const generatedResult: CallResult = {
        connected: true,
        resultType: 'appointment',
        appointmentDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
        nextAction: '提案資料の準備と詳細説明',
        notes: '来週火曜日午後にアポイントメント。詳細な資料持参で訪問予定。'
      };

      setSummary(generatedSummary);
      setBantcData(generatedBANTC);
      setCallResult(generatedResult);
      
      // フォームに初期値を設定
      form.setFieldsValue({
        summary: generatedSummary,
        budget: generatedBANTC.budget,
        authority: generatedBANTC.authority,
        needs: generatedBANTC.needs,
        timeline: generatedBANTC.timeline,
        challenges: generatedBANTC.challenges,
        connected: generatedResult.connected,
        resultType: generatedResult.resultType,
        appointmentDate: generatedResult.appointmentDate ? dayjs(generatedResult.appointmentDate) : null,
        nextAction: generatedResult.nextAction,
        notes: generatedResult.notes
      });
      
      setLoading(false);
      message.success('AI分析が完了しました');
    };

    analyzeCall();
  }, [transcript, form, companyData]);

  const handleSave = () => {
    form.validateFields().then(values => {
      // 保存処理
      console.log('通話記録保存:', {
        companyData,
        duration: callDuration,
        summary: values.summary,
        bantc: {
          budget: values.budget,
          authority: values.authority,
          needs: values.needs,
          timeline: values.timeline,
          challenges: values.challenges
        },
        result: {
          connected: values.connected,
          resultType: values.resultType,
          appointmentDate: values.appointmentDate?.format('YYYY-MM-DD'),
          nextAction: values.nextAction,
          notes: values.notes
        },
        transcript
      });
      
      message.success('通話記録を保存しました');
      onComplete();
    }).catch(() => {
      message.error('入力内容を確認してください');
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '60px 0', textAlign: 'center' }}>
        <Spin size="large" />
        <div style={{ marginTop: 20 }}>
          <RobotOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: 16 }} />
          <Title level={4}>AIが通話内容を分析中...</Title>
          <Text type="secondary">
            会話の要約、BANTC情報、架電結果を自動生成しています
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px 0' }}>
      {/* ヘッダー情報 */}
      <Card style={{ marginBottom: 20 }}>
        <Row gutter={16} align="middle">
          <Col span={18}>
            <Space direction="vertical" size="small">
              <Title level={4} style={{ margin: 0 }}>
                通話記録 - {companyData.companyName}
              </Title>
              <Text>
                <strong>担当者:</strong> {companyData.contactPerson} | 
                <strong> 通話時間:</strong> {formatTime(callDuration)}
              </Text>
            </Space>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Tag color="green" style={{ fontSize: '14px', padding: '4px 12px' }}>
              <CheckOutlined /> AI分析完了
            </Tag>
          </Col>
        </Row>
      </Card>

      <Form form={form} layout="vertical">
        <Row gutter={24}>
          {/* 左側: AI要約とBANTC */}
          <Col span={12}>
            <Card title="AI要約" style={{ marginBottom: 16 }}>
              <Form.Item
                name="summary"
                label="通話要約"
                rules={[{ required: true, message: '要約を入力してください' }]}
              >
                <TextArea
                  rows={8}
                  placeholder="AIが生成した要約を確認・編集してください"
                />
              </Form.Item>
            </Card>

            <Card title="BANTC分析">
              <Form.Item
                name="budget"
                label="Budget（予算）"
                rules={[{ required: true, message: '予算情報を入力してください' }]}
              >
                <Input placeholder="予算規模や決定プロセス" />
              </Form.Item>

              <Form.Item
                name="authority"
                label="Authority（決定権）"
                rules={[{ required: true, message: '決定権情報を入力してください' }]}
              >
                <Input placeholder="決定権者や承認プロセス" />
              </Form.Item>

              <Form.Item
                name="needs"
                label="Needs（ニーズ）"
                rules={[{ required: true, message: 'ニーズを入力してください' }]}
              >
                <Input placeholder="顧客のニーズや要求" />
              </Form.Item>

              <Form.Item
                name="timeline"
                label="Timeline（導入時期）"
                rules={[{ required: true, message: '導入時期を入力してください' }]}
              >
                <Input placeholder="導入スケジュールや期限" />
              </Form.Item>

              <Form.Item
                name="challenges"
                label="Challenges（課題）"
                rules={[{ required: true, message: '課題を入力してください' }]}
              >
                <Input placeholder="現在の課題や問題点" />
              </Form.Item>
            </Card>
          </Col>

          {/* 右側: 架電結果 */}
          <Col span={12}>
            <Card title="架電結果">
              <Form.Item
                name="notes"
                label="備考・メモ"
                rules={[{ required: true, message: '備考を入力してください' }]}
              >
                <TextArea
                  rows={12}
                  placeholder="追加の備考や重要なポイント"
                />
              </Form.Item>

              <Form.Item
                name="connected"
                label="通電結果"
                rules={[{ required: true }]}
              >
                <Select placeholder="通電結果を選択">
                  <Option value={true}>通電</Option>
                  <Option value={false}>不通</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="resultType"
                label="架電結果"
                rules={[{ required: true, message: '架電結果を選択してください' }]}
              >
                <Select placeholder="結果を選択">
                  <Option value="appointment">アポイント獲得</Option>
                  <Option value="follow_up">フォローアップ</Option>
                  <Option value="not_interested">見込みなし</Option>
                  <Option value="no_answer">不在</Option>
                  <Option value="callback">架電依頼</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="appointmentDate"
                label="アポイント日時"
                dependencies={['resultType']}
              >
                <DatePicker 
                  style={{ width: '100%' }}
                  placeholder="アポイント日を選択"
                />
              </Form.Item>

              <Form.Item
                name="nextAction"
                label="次回アクション"
                rules={[{ required: true, message: '次回アクションを入力してください' }]}
              >
                <Input placeholder="次に取るべきアクション" />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>

      <Divider />

      {/* フッターボタン */}
      <div style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel} icon={<CloseOutlined />}>
            キャンセル
          </Button>
          <Button 
            type="primary" 
            onClick={handleSave}
            icon={<SaveOutlined />}
            size="large"
          >
            登録
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default CallSummaryScreen; 