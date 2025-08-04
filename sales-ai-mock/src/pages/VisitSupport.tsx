import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Modal, App } from 'antd';
import VisitList from '../components/visit/VisitList';
import VisitResultForm from '../components/visit/VisitResultForm';
import SimpleEntityInfo from '../components/common/SimpleEntityInfo';
import ActivityHistory from '../components/call/ActivityHistory';
import CustomerDetailModal from '../components/call/CustomerDetailModal';
import type { VisitListItem, VisitResult, CallItem } from '../types';
import callData from '../data/callListData.json';
import visitData from '../data/visitData.json';
import { getStoredVisits, initializeVisitData } from '../services/visitService';

const VisitSupport: React.FC = () => {
  const { message } = App.useApp();
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<VisitListItem | null>(null);
  const [selectedCallItem, setSelectedCallItem] = useState<CallItem | null>(null);
  const [selectedCompanyForHistory, setSelectedCompanyForHistory] = useState<CallItem | null>(null);
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [visitList, setVisitList] = useState<VisitListItem[]>([]);

  // 訪問データの初期化とロード
  useEffect(() => {
    initializeVisitData();
    loadVisitData();
    
    // ローカルストレージの変更を監視
    const handleStorageChange = () => {
      loadVisitData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // 定期的にデータを更新（架電からのアポ獲得を即座に反映）
    const interval = setInterval(() => {
      loadVisitData();
    }, 3000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const loadVisitData = () => {
    // ローカルストレージからの訪問データとJSONファイルからのデータを統合
    const storedVisits = getStoredVisits();
    const jsonVisits = visitData.visits as VisitListItem[];
    
    // IDの重複を避けて統合
    const allVisits = [...jsonVisits];
    storedVisits.forEach(storedVisit => {
      if (!allVisits.some(v => v.id === storedVisit.id)) {
        allVisits.push(storedVisit);
      }
    });
    
    // 予定日でソート（新しい順）
    allVisits.sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime());
    
    setVisitList(allVisits);
  };

  const handleSelectVisit = (visit: VisitListItem) => {
    setSelectedVisit(visit);
    // 訪問に関連する架電情報を取得
    const callItem = callData.callList.find(
      (item: any) => item.companyName === visit.companyName
    );
    if (callItem) {
      setSelectedCallItem(callItem as CallItem);
    }
  };

  const handleSelectCompany = (companyName: string) => {
    // 企業名から対応する架電情報を取得
    const callItem = callData.callList.find(
      (item: any) => item.companyName === companyName
    );
    
    if (callItem) {
      setSelectedCompanyForHistory(callItem as CallItem);
      setShowCompanyDetails(true);
      // 訪問選択をクリア
      setSelectedVisit(null);
    } else {
      message.error(`企業情報が見つかりませんでした: ${companyName}`);
    }
  };

  const handleShowDetails = (visit: VisitListItem) => {
    setSelectedVisit(visit);
    // 訪問に関連する架電情報を取得（詳細モーダル用）
    const callItem = callData.callList.find(
      (item: any) => item.companyName === visit.companyName
    );
    if (callItem) {
      setSelectedCallItem(callItem as CallItem);
      setDetailModalVisible(true);
    }
  };

  const handleCreateNegotiation = (visitId: string) => {
    // 商談作成処理（モック）
    message.success('商談を設定しました');
    console.log('Create negotiation for visit:', visitId);
  };

  const handleVisitResult = (result: {
    result: VisitResult;
    hasNegotiation: boolean;
    nextAction?: string;
    summary: string;
    details?: string;
  }) => {
    // 訪問結果の保存処理
    console.log('訪問結果:', result);
    message.success('訪問結果を記録しました');

    if (result.hasNegotiation) {
      // 商談が発生した場合の処理
      setTimeout(() => {
        message.info('商談リストに追加されました');
      }, 1000);
    }

    setResultModalVisible(false);
    setSelectedVisit(null);
  };

  const handleCompleteVisit = (visit: VisitListItem) => {
    setSelectedVisit(visit);
    setResultModalVisible(true);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col xs={24} lg={selectedVisit || (showCompanyDetails && selectedCompanyForHistory) ? 14 : 24}>
          <Card title="訪問リスト" style={{ height: '100%' }}>
            <VisitList
              visitList={visitList}
              onSelectVisit={handleSelectVisit}
              onSelectCompany={handleSelectCompany}
              onCreateNegotiation={handleCreateNegotiation}
            />
          </Card>
        </Col>
        {(selectedVisit || (showCompanyDetails && selectedCompanyForHistory)) && (
          <Col xs={24} lg={10}>
            <div>
              {/* 訪問詳細表示 */}
              {selectedVisit && (
                <SimpleEntityInfo
                  entityType="visit"
                  entityData={{
                    companyName: selectedVisit.companyName,
                    contactPerson: selectedVisit.contactName,
                    phoneNumber: selectedVisit.phoneNumber,
                    scheduledDate: selectedVisit.scheduledDate,
                    purpose: selectedVisit.purpose,
                    location: selectedVisit.location,
                    visitStatus: selectedVisit.visitStatus,
                  }}
                  onClose={() => setSelectedVisit(null)}
                  onVisitComplete={() => handleCompleteVisit(selectedVisit)}
                  onCreateNegotiation={() => handleCreateNegotiation(selectedVisit.id)}
                />
              )}
              
              {/* 企業詳細表示 */}
              {showCompanyDetails && selectedCompanyForHistory && !selectedVisit && (
                <SimpleEntityInfo
                  entityType="call"
                  entityData={{
                    companyName: selectedCompanyForHistory.companyName,
                    contactPerson: selectedCompanyForHistory.contactPerson,
                    phoneNumber: selectedCompanyForHistory.phoneNumber,
                    industry: selectedCompanyForHistory.industry,
                    priority: selectedCompanyForHistory.priority,
                    lastContactDate: selectedCompanyForHistory.lastContactDate,
                    purchasedProducts: selectedCompanyForHistory.purchasedProducts,
                    keyPersons: selectedCompanyForHistory.keyPersons,
                  }}
                  onClose={() => {
                    setShowCompanyDetails(false);
                    setSelectedCompanyForHistory(null);
                  }}
                />
              )}
              
              {/* 活動履歴 */}
              {((selectedVisit && selectedCallItem) || (showCompanyDetails && selectedCompanyForHistory)) && (
                <Card title="活動履歴" size="small">
                  <ActivityHistory 
                    companyId={selectedCallItem?.id || selectedCompanyForHistory?.id || ''} 
                  />
                </Card>
              )}
            </div>
          </Col>
        )}
      </Row>

      {/* 訪問結果入力モーダル */}
      <Modal
        title="訪問結果入力"
        open={resultModalVisible}
        onCancel={() => {
          setResultModalVisible(false);
          setSelectedVisit(null);
        }}
        footer={null}
        width={700}
      >
        {selectedVisit && (
          <VisitResultForm
            visitId={selectedVisit.id}
            onSubmit={handleVisitResult}
            onCancel={() => {
              setResultModalVisible(false);
              setSelectedVisit(null);
            }}
          />
        )}
      </Modal>

      {/* 顧客詳細モーダル */}
      <CustomerDetailModal
        visible={detailModalVisible}
        callItem={selectedCallItem}
        onClose={() => {
          setDetailModalVisible(false);
          setSelectedCallItem(null);
          setSelectedVisit(null);
        }}
      />
    </div>
  );
};

export default VisitSupport;
