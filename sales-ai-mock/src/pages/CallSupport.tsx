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
    <div>
      <Row gutter={16}>
        <Col xs={24} lg={selectedCompany ? 14 : 24}>
          <Card title="架電リスト" style={{ height: '100%' }}>
            <CallList
              callList={callList}
              onSelectCompany={handleSelectCompany}
            />
          </Card>
        </Col>
        {selectedCompany && (
          <Col xs={24} lg={10}>
            <div>
              <SimpleCompanyInfo
                companyData={selectedCompany}
                onClose={() => setSelectedCompany(null)}
              />
              <Card title="活動履歴" size="small">
                <ActivityHistory companyId={selectedCompany.id} />
              </Card>
            </div>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default CallSupport;
