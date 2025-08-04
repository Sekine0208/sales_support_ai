import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Tag, Progress, Typography, Alert } from 'antd';
import {
  AudioOutlined,
  AudioMutedOutlined,
  LoadingOutlined,
} from '@ant-design/icons';

const { Text, Paragraph } = Typography;

interface CallRecordingProps {
  companyName: string;
  onTranscriptionComplete?: (transcription: string) => void;
}

const CallRecording: React.FC<CallRecordingProps> = ({
  companyName,
  onTranscriptionComplete,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [showTranscription, setShowTranscription] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    setTranscription('');
    setShowTranscription(false);
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsTranscribing(true);

    // 文字起こしのシミュレーション
    setTimeout(() => {
      const mockTranscription = `【${companyName}との通話内容】
日時: ${new Date().toLocaleString('ja-JP')}
通話時間: ${formatTime(recordingTime)}

[担当者] お世話になっております。本日は新製品のご提案でお電話させていただきました。

[顧客] はい、どのような製品でしょうか？

[担当者] 御社の業界トレンドを踏まえまして、業務効率化を実現する新しいソリューションをご用意しました。特に在庫管理と生産計画の最適化に強みがあります。

[顧客] なるほど、興味深いですね。詳しい資料はありますか？

[担当者] はい、本日中にメールで資料をお送りさせていただきます。また、来週でしたらデモンストレーションも可能ですが、ご都合はいかがでしょうか？

[顧客] 来週の火曜日の午後なら時間が取れそうです。

[担当者] ありがとうございます。それでは来週火曜日の14時からでよろしいでしょうか？

[顧客] はい、それで結構です。

[担当者] 承知いたしました。詳細は改めてメールでご連絡させていただきます。本日はお時間いただきありがとうございました。`;

      setTranscription(mockTranscription);
      setIsTranscribing(false);
      setShowTranscription(true);
      if (onTranscriptionComplete) {
        onTranscriptionComplete(mockTranscription);
      }
    }, 3000);
  };

  return (
    <Card title="通話録音・文字起こし" size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        {!isRecording && !isTranscribing && !showTranscription && (
          <Button
            type="primary"
            icon={<AudioOutlined />}
            size="large"
            onClick={startRecording}
            block
          >
            録音開始
          </Button>
        )}

        {isRecording && (
          <>
            <Alert
              message="録音中"
              description={
                <Space>
                  <AudioOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
                  <Text strong>{formatTime(recordingTime)}</Text>
                </Space>
              }
              type="error"
              showIcon={false}
            />
            <Button
              danger
              icon={<AudioMutedOutlined />}
              size="large"
              onClick={stopRecording}
              block
            >
              録音停止
            </Button>
          </>
        )}

        {isTranscribing && (
          <Alert
            message="文字起こし中"
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text>AIが通話内容を文字に変換しています...</Text>
                <Progress percent={70} status="active" />
              </Space>
            }
            type="info"
            icon={<LoadingOutlined />}
          />
        )}

        {showTranscription && (
          <Alert
            message="文字起こし完了"
            description={
              <Space direction="vertical" style={{ width: '100%' }}>
                <Text type="secondary">
                  通話時間: {formatTime(recordingTime)}
                </Text>
                <Paragraph
                  style={{
                    maxHeight: 300,
                    overflow: 'auto',
                    border: '1px solid #f0f0f0',
                    padding: 8,
                    borderRadius: 4,
                    marginTop: 8,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {transcription}
                </Paragraph>
                <Button onClick={startRecording} type="default">
                  新しい録音を開始
                </Button>
              </Space>
            }
            type="success"
          />
        )}
      </Space>
    </Card>
  );
};

export default CallRecording;
