import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Typography, Space, Row, Col, Divider, Tag, message } from 'antd';
import { 
  AudioOutlined, 
  PauseOutlined, 
  PlayCircleOutlined, 
  StopOutlined,
  PhoneOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface VoiceRecordingScreenProps {
  companyData: {
    companyName: string;
    contactPerson: string;
    phoneNumber: string;
    industry?: string;
  };
  onComplete: (transcript: string, duration: number) => void;
  onCancel: () => void;
}

const VoiceRecordingScreen: React.FC<VoiceRecordingScreenProps> = ({
  companyData,
  onComplete,
  onCancel,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [duration, setDuration] = useState(0);
  const [transcript, setTranscript] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptIndexRef = useRef(0);
  const isAddingTranscriptRef = useRef(false);

  // デモ用のサンプル会話文
  const sampleTranscripts = [
    "営業: こんにちは、株式会社pragmatechesの田中と申します。本日はお時間をいただき、ありがとうございます。",
    "顧客: はい、こちらこそよろしくお願いします。",
    "営業: 弊社のAI営業支援システムについてご提案させていただきたく、お電話いたしました。現在、営業活動で何かお困りのことはございませんか？",
    "顧客: そうですね、営業の効率化は課題の一つです。どのようなシステムなのでしょうか？",
    "営業: ありがとうございます。弊社のシステムは、顧客管理から商談進捗まで一元管理でき、AIが次のアクションを提案いたします。予算規模はどの程度をお考えでしょうか？",
    "顧客: 年間で500万円程度は確保していますが、ROIが見込めるなら検討したいと思います。",
    "営業: ありがとうございます。決定権者はどちらでしょうか？",
    "顧客: 私と役員の承認が必要になります。来月中には決定したいと考えています。",
    "営業: 承知いたしました。では来週、詳細な資料をお持ちして訪問させていただけますでしょうか？",
    "顧客: はい、ぜひお願いします。来週の火曜日の午後はいかがでしょうか？",
    "営業: ありがとうございます。それでは来週火曜日の午後にお伺いさせていただきます。本日はお忙しい中、貴重なお時間をいただき、ありがとうございました。"
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTranscript = () => {
    // 既に処理中、または範囲外の場合は何もしない
    if (isAddingTranscriptRef.current || transcriptIndexRef.current >= sampleTranscripts.length) {
      return;
    }
    
    isAddingTranscriptRef.current = true;
    
    // 現在のインデックスの会話を追加
    const currentIndex = transcriptIndexRef.current;
    setTranscript(prev => {
      const newText = prev + (prev ? '\n\n' : '') + sampleTranscripts[currentIndex];
      return newText;
    });
    
    // インデックスを進める
    transcriptIndexRef.current++;
    
    // 次の会話をスケジュール
    if (transcriptIndexRef.current < sampleTranscripts.length) {
      transcriptTimeoutRef.current = setTimeout(() => {
        isAddingTranscriptRef.current = false;
        addTranscript();
      }, 2000);
    } else {
      // 全ての会話が終了
      isAddingTranscriptRef.current = false;
    }
  };

  const startRecording = () => {
    // 既に録音中の場合は何もしない
    if (isRecording) return;
    
    // すべての状態をリセット
    setIsRecording(true);
    setIsPaused(false);
    setTranscript(''); // 転写テキストもリセット
    setDuration(0);    // 持続時間もリセット
    transcriptIndexRef.current = 0;
    isAddingTranscriptRef.current = false;
    
    // 既存のタイマーを確実にクリア
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (transcriptTimeoutRef.current) {
      clearTimeout(transcriptTimeoutRef.current);
      transcriptTimeoutRef.current = null;
    }
    
    // 時間タイマー開始
    intervalRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    
    // 最初の発言を追加（1秒後）
    transcriptTimeoutRef.current = setTimeout(() => {
      addTranscript();
    }, 1000);

    message.success('録音を開始しました');
  };

  const pauseRecording = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // 会話のタイマーも停止
    if (transcriptTimeoutRef.current) {
      clearTimeout(transcriptTimeoutRef.current);
    }
    isAddingTranscriptRef.current = false;
    message.info('録音を一時停止しました');
  };

  const resumeRecording = () => {
    setIsPaused(false);
    
    // 時間タイマー再開
    intervalRef.current = setInterval(() => {
      setDuration(prev => prev + 1);
    }, 1000);
    
    // 会話もまだ残っていれば再開
    if (transcriptIndexRef.current < sampleTranscripts.length && !isAddingTranscriptRef.current) {
      transcriptTimeoutRef.current = setTimeout(() => {
        addTranscript();
      }, 2000); // 再開後2秒で次の会話
    }
    
    message.success('録音を再開しました');
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPaused(false);
    
    // すべてのタイマーをクリア
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (transcriptTimeoutRef.current) {
      clearTimeout(transcriptTimeoutRef.current);
    }
    isAddingTranscriptRef.current = false;
    
    message.success('録音を終了しました');
    
    // 2秒後に完了処理（現在のトランスクリプトをそのまま使用）
    setTimeout(() => {
      onComplete(transcript, duration);
    }, 2000);
  };

  useEffect(() => {
    // 自動で録音開始
    startRecording();
    
    return () => {
      // クリーンアップ: すべてのタイマーをクリア
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (transcriptTimeoutRef.current) {
        clearTimeout(transcriptTimeoutRef.current);
      }
      isAddingTranscriptRef.current = false;
    };
  }, []);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
             {/* ヘッダー情報 */}
       <Card style={{ marginBottom: 6, flexShrink: 0, padding: '2px 8px' }}>
         <Row gutter={12} align="middle">
           <Col span={18}>
             <Space direction="vertical" size={0}>
               <Title level={5} style={{ margin: 0, fontSize: '12px', lineHeight: '1.1' }}>
                 通話中 - {companyData.companyName}
               </Title>
               <Text style={{ fontSize: '10px', lineHeight: '1.1' }}>
                 <strong>担当者:</strong> {companyData.contactPerson} | 
                 <strong> 電話番号:</strong> {companyData.phoneNumber}
               </Text>
             </Space>
           </Col>
           <Col span={6} style={{ textAlign: 'right' }}>
             <Space direction="vertical" size={0} style={{ textAlign: 'center' }}>
               <ClockCircleOutlined style={{ fontSize: '12px', color: '#1890ff' }} />
               <Text strong style={{ fontSize: '11px', lineHeight: '1.1' }}>
                 {formatTime(duration)}
               </Text>
             </Space>
           </Col>
         </Row>
       </Card>

      <Row gutter={16} style={{ flex: 1, minHeight: 0 }}>
        {/* 左側: 録音コントロール */}
        <Col span={8}>
          <Card title="録音コントロール" style={{ height: '100%' }}>
            <Space direction="vertical" size="large" style={{ width: '100%', textAlign: 'center' }}>
              {/* 録音状態 */}
              <div>
                <Tag color={isRecording && !isPaused ? 'red' : isPaused ? 'orange' : 'default'}>
                  {isRecording && !isPaused ? '録音中' : isPaused ? '一時停止' : '停止'}
                </Tag>
              </div>

              {/* コントロールボタン */}
              <Space direction="vertical" size="middle">
                {!isRecording ? (
                  <Button
                    type="primary"
                    icon={<AudioOutlined />}
                    onClick={startRecording}
                    size="large"
                  >
                    録音開始
                  </Button>
                ) : (
                  <Space direction="vertical" size="small">
                    {!isPaused ? (
                      <Button
                        icon={<PauseOutlined />}
                        onClick={pauseRecording}
                        style={{ width: 120 }}
                      >
                        一時停止
                      </Button>
                    ) : (
                      <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={resumeRecording}
                        style={{ width: 120 }}
                      >
                        再開
                      </Button>
                    )}
                    <Button
                      danger
                      icon={<StopOutlined />}
                      onClick={stopRecording}
                      style={{ width: 120 }}
                    >
                      通話終了
                    </Button>
                  </Space>
                )}
              </Space>
            </Space>
          </Card>
        </Col>

                 {/* 右側: リアルタイム文字起こし */}
         <Col span={16}>
           <Card 
             title="リアルタイム文字起こし" 
             style={{ height: '100%' }}
             bodyStyle={{ 
               height: '200px',
               overflow: 'hidden',
               padding: '12px'
             }}
           >
             <div style={{
               height: '100%',
               overflow: 'auto',
               wordBreak: 'break-word'
             }}>
               <Paragraph style={{ 
                 whiteSpace: 'pre-wrap', 
                 margin: 0,
                 fontSize: '13px',
                 lineHeight: '1.5',
                 wordBreak: 'break-word'
               }}>
                 {transcript || '会話の文字起こしがここに表示されます...'}
               </Paragraph>
             </div>
           </Card>
         </Col>
      </Row>

             {/* フッターボタン - 固定位置 */}
       <div style={{ 
         textAlign: 'right', 
         flexShrink: 0,
         marginTop: '12px',
         padding: '8px 0',
         borderTop: '1px solid #f0f0f0',
         backgroundColor: '#fff',
         position: 'relative',
         zIndex: 10
       }}>
         <Space>
           <Button onClick={onCancel}>
             キャンセル
           </Button>
           <Button
             type="primary"
             danger
             icon={<PhoneOutlined />}
             onClick={stopRecording}
             disabled={!isRecording}
           >
             通話を終了
           </Button>
         </Space>
       </div>
    </div>
  );
};

export default VoiceRecordingScreen; 