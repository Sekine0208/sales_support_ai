import React, { useState } from 'react';
import { Row, Col, Card } from 'antd';
import CallList from '../components/call/CallList';
import SimpleCompanyInfo from '../components/call/SimpleCompanyInfo';
import ActivityHistory from '../components/call/ActivityHistory';
import callData from '../data/callListData.json';
import type { CallItem } from '../types';

const CallSupport: React.FC = () => {
  const [selectedCompany, setSelectedCompany] = useState<CallItem | null>(null);
  const callList = callData.callList as CallItem[];

  const handleSelectCompany = (company: CallItem) => {
    setSelectedCompany(company);
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 上側：架電リスト */}
      <div style={{ 
        flex: selectedCompany ? '0 0 45%' : '1 1 auto', 
        overflow: 'hidden',
        minHeight: selectedCompany ? '400px' : 'calc(100vh - 50px)',
        marginBottom: '0',
        paddingBottom: '0'
      }}>
        <Card title="架電リスト" style={{ height: '100%', marginBottom: '0' }}>
          <CallList
            callList={callList}
            onSelectCompany={handleSelectCompany}
            isCompanySelected={!!selectedCompany}
          />
        </Card>
      </div>

      {/* 下側：会社情報と活動履歴 */}
      {selectedCompany && (
        <div style={{ 
          flex: '0 0 55%', 
          overflow: 'auto',
          borderTop: '1px solid #f0f0f0',
          marginTop: '0',
          paddingTop: '0',
          height: '55vh'
        }}>
          <div style={{ padding: '16px', height: '100%' }}>
            <SimpleCompanyInfo
              companyData={selectedCompany}
              onClose={() => setSelectedCompany(null)}
            />
            <Card title="活動履歴" size="small" style={{ marginTop: 16 }}>
              <ActivityHistory companyId={selectedCompany.id} />
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default CallSupport;
