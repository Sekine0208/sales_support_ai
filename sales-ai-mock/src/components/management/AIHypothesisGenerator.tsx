import React, { useState } from 'react';
import { Modal, Button, Card, Row, Col, Progress, Tag, Spin, message } from 'antd';
import { FunnelPlotOutlined, BulbOutlined, CheckCircleOutlined, AlertOutlined } from '@ant-design/icons';

interface Hypothesis {
  id: string;
  title: string;
  description: string;
  evidence: string[];
  suggestions: string[];
  confidence: number;
}

interface AIHypothesisGeneratorProps {
  visible: boolean;
  onClose: () => void;
  selectedUser?: {
    id: string;
    name: string;
    department: string;
  };
  selectedFunnel?: {
    stage: string;
    transitionRate: number;
    averageRate: number;
  };
}

const AIHypothesisGenerator: React.FC<AIHypothesisGeneratorProps> = ({
  visible,
  onClose,
  selectedUser,
  selectedFunnel,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);

  const handleGenerateHypothesis = async () => {
    setIsGenerating(true);
    
    // シミュレートされたAI分析（実際の実装では外部AI APIを呼び出し）
    setTimeout(() => {
      const mockHypotheses: Hypothesis[] = [
        {
          id: '1',
          title: '時間帯の問題',
          description: '夕方の架電で通電率が平均より30%低い',
          evidence: [
            '夕方17:00-19:00の架電で通電率が15%',
            '午前中の架電では通電率が45%',
            '顧客の在宅率が夕方は低い傾向'
          ],
          suggestions: [
            '午前中（9:00-12:00）の架電時間を増やす',
            '夕方の架電は事前アポを取った顧客に限定',
            '時間帯別の通電率をモニタリング'
          ],
          confidence: 85
        },
        {
          id: '2',
          title: 'アプローチ方法の改善',
          description: '商品説明が平均より2分長く、顧客の興味を失っている',
          evidence: [
            '平均説明時間が8分（他担当者は6分）',
            '説明中に顧客からの質問が少ない',
            '商談記録で「説明が長い」というフィードバック'
          ],
          suggestions: [
            '商品説明を簡潔にまとめる（3-5分）',
            '顧客の反応を見ながら説明時間を調整',
            '説明資料を事前に準備'
          ],
          confidence: 78
        },
        {
          id: '3',
          title: '顧客層のミスマッチ',
          description: '中小企業向けアプローチで大企業に接触している',
          evidence: [
            '大企業顧客に対して中小企業向け提案をしている',
            '顧客の規模に応じたアプローチができていない',
            '商談記録で「提案内容が合わない」という声'
          ],
          suggestions: [
            '顧客の規模に応じたアプローチ方法を習得',
            '大企業向けの提案資料を準備',
            '顧客層別のアプローチ研修を受講'
          ],
          confidence: 92
        }
      ];
      
      setHypotheses(mockHypotheses);
      setIsGenerating(false);
      message.success('AI分析が完了しました');
    }, 3000);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return '#52c41a';
    if (confidence >= 60) return '#faad14';
    return '#f5222d';
  };

  return (
    <Modal
      title={
        <div>
          <AlertOutlined style={{ marginRight: 8 }} />
          AI仮説生成 - アラート対象者分析
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>
          閉じる
        </Button>,
        <Button 
          key="generate" 
          type="primary" 
          icon={<BulbOutlined />}
          onClick={handleGenerateHypothesis}
          loading={isGenerating}
          disabled={!selectedUser || !selectedFunnel}
        >
          AI分析実行
        </Button>
      ]}
    >
      <div style={{ padding: '16px 0' }}>
        {/* 分析対象データ */}
        {selectedUser && selectedFunnel && (
          <Card title="分析対象データ" size="small" style={{ marginBottom: 16 }}>
            <Row gutter={[16, 8]}>
              <Col span={8}>
                <strong>担当者:</strong> {selectedUser.name}
              </Col>
              <Col span={8}>
                <strong>部署:</strong> {selectedUser.department}
              </Col>
              <Col span={8}>
                <strong>分析段階:</strong> {selectedFunnel.stage}
              </Col>
            </Row>
            <Row gutter={[16, 8]} style={{ marginTop: 8 }}>
              <Col span={8}>
                <strong>遷移率:</strong> {selectedFunnel.transitionRate}%
              </Col>
              <Col span={8}>
                <strong>平均:</strong> {selectedFunnel.averageRate}%
              </Col>
              <Col span={8}>
                <strong>差:</strong> 
                <span style={{ 
                  color: selectedFunnel.transitionRate < selectedFunnel.averageRate ? '#f5222d' : '#52c41a' 
                }}>
                  {selectedFunnel.transitionRate - selectedFunnel.averageRate}%
                </span>
              </Col>
            </Row>
          </Card>
        )}

        {/* AI分析結果 */}
        {isGenerating && (
          <Card title="AI分析中..." size="small" style={{ marginBottom: 16 }}>
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size="large" />
              <p style={{ marginTop: 16 }}>定性的データを分析して仮説を生成しています...</p>
            </div>
          </Card>
        )}

        {hypotheses.length > 0 && (
          <Card title="AI仮説結果" size="small">
            {hypotheses.map((hypothesis, index) => (
              <Card 
                key={hypothesis.id}
                size="small" 
                style={{ marginBottom: 16 }}
                title={
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span>
                      <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                      {hypothesis.title}
                    </span>
                    <Tag color={getConfidenceColor(hypothesis.confidence)}>
                      信頼度: {hypothesis.confidence}%
                    </Tag>
                  </div>
                }
              >
                <p><strong>問題:</strong> {hypothesis.description}</p>
                
                <div style={{ marginTop: 12 }}>
                  <strong>根拠:</strong>
                  <ul style={{ marginTop: 4 }}>
                    {hypothesis.evidence.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 12 }}>
                  <strong>改善提案:</strong>
                  <ul style={{ marginTop: 4 }}>
                    {hypothesis.suggestions.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: 12 }}>
                  <Progress 
                    percent={hypothesis.confidence} 
                    size="small"
                    strokeColor={getConfidenceColor(hypothesis.confidence)}
                    format={() => `信頼度: ${hypothesis.confidence}%`}
                  />
                </div>
              </Card>
            ))}
          </Card>
        )}

        {!selectedUser || !selectedFunnel ? (
          <Card title="分析対象の選択" size="small">
            <p>ファネル分析タブで分析対象の担当者とファネル段階を選択してください。</p>
          </Card>
        ) : null}
      </div>
    </Modal>
  );
};

export default AIHypothesisGenerator; 